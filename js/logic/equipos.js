// =========================================================================
// equipos.js — Teams & Stables (Tag Teams y Stables/Grupos)
// -------------------------------------------------------------------------
// Fuente de datos ÚNICA de equipos. Vive dentro del estado central de la
// app (el mismo que se guarda en localStorage y se exporta/importa):
//
//   estado.equipos = {
//     stables:  [{ id, nombre, miembros: [luchadorId, ...] }],
//     tagTeams: [{ id, nombre, miembros: [luchadorId, luchadorId],
//                  stableOrigenId: <id de un Stable> | null }],
//   }
//
// Reglas:
//   - El id es interno y estable; el nombre se puede editar libremente.
//   - Un luchador pertenece a UN solo Stable, pero puede estar además en
//     uno o varios Tag Teams.
//   - Un Tag Team tiene exactamente 2 luchadores. Puede ser independiente
//     (stableOrigenId = null) o derivado de un Stable.
//   - Un Tag Team derivado es una entidad propia (se edita por separado),
//     pero se elimina junto con el Stable del que salió.
//   - Un Stable que queda sin miembros se elimina solo (y con él sus Tag
//     Teams derivados).
//   - Nada de esto borra luchadores del Roster.
//
// Para el Calendario (integración futura): consultar SIEMPRE con las
// funciones de la sección "Consultas" (listarTagTeams, listarStables,
// tagTeamsDeLuchador, stableDeLuchador, resolverEquipo...). El Calendario
// no debe guardar ni hardcodear equipos propios.
// =========================================================================

const MIEMBROS_TAG_TEAM = 2;

// ---------- Estado / normalización ----------

function crearIdEquipo(prefijo, usados) {
  let id;
  do { id = `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; }
  while (usados.has(id));
  return id;
}

function idsEquipos(estado) {
  const eq = equiposDe(estado);
  return new Set([...eq.stables, ...eq.tagTeams].map((e) => e.id));
}

// Igual que normalizarCalendario: se llama desde normalizarEstado() para que
// backups viejos (sin equipos) y datos importados queden con la forma correcta.
function normalizarEquipos(estado) {
  const eq = estado.equipos && typeof estado.equipos === "object" ? estado.equipos : {};
  const soloObjetos = (x) => (Array.isArray(x) ? x.filter((e) => e && typeof e === "object") : []);
  const idsUnicos = (m) => [...new Set((Array.isArray(m) ? m : []).filter((id) => typeof id === "string" && id))];
  const usados = new Set();
  const asegurarId = (e, prefijo) => {
    if (typeof e.id !== "string" || !e.id || usados.has(e.id)) e.id = crearIdEquipo(prefijo, usados);
    usados.add(e.id);
  };

  eq.stables = soloObjetos(eq.stables);
  eq.tagTeams = soloObjetos(eq.tagTeams);

  const enStable = new Set();
  eq.stables.forEach((s) => {
    asegurarId(s, "stable");
    s.nombre = String(s.nombre ?? "").trim() || "Stable sin nombre";
    // Un luchador solo puede estar en un Stable: se conserva la primera aparición.
    s.miembros = idsUnicos(s.miembros).filter((id) => !enStable.has(id));
    s.miembros.forEach((id) => enStable.add(id));
  });

  const idsStables = new Set(eq.stables.map((s) => s.id));
  eq.tagTeams.forEach((t) => {
    asegurarId(t, "tag");
    t.nombre = String(t.nombre ?? "").trim() || "Tag Team sin nombre";
    t.miembros = idsUnicos(t.miembros);
    t.stableOrigenId = idsStables.has(t.stableOrigenId) ? t.stableOrigenId : null;
  });

  estado.equipos = eq;
  return eq;
}

function equiposDe(estado) {
  return estado.equipos && Array.isArray(estado.equipos.stables) && Array.isArray(estado.equipos.tagTeams)
    ? estado.equipos
    : normalizarEquipos(estado);
}

// ---------- Consultas (las usa la UI y las usará el Calendario) ----------

function listarStables(estado) { return equiposDe(estado).stables.slice(); }
function listarTagTeams(estado) { return equiposDe(estado).tagTeams.slice(); }
function obtenerStable(estado, id) { return equiposDe(estado).stables.find((s) => s.id === id) || null; }
function obtenerTagTeam(estado, id) { return equiposDe(estado).tagTeams.find((t) => t.id === id) || null; }

function stableDeLuchador(estado, luchadorId) {
  return equiposDe(estado).stables.find((s) => s.miembros.includes(luchadorId)) || null;
}
function tagTeamsDeLuchador(estado, luchadorId) {
  return equiposDe(estado).tagTeams.filter((t) => t.miembros.includes(luchadorId));
}
function tagTeamsDerivados(estado, stableId) {
  return equiposDe(estado).tagTeams.filter((t) => t.stableOrigenId === stableId);
}
// Luchadores del Roster que todavía no están en ningún Stable.
function luchadoresSinStable(estado) {
  const enStable = new Set(equiposDe(estado).stables.flatMap((s) => s.miembros));
  return estado.roster.filter((w) => !enStable.has(w.id));
}
// Devuelve el equipo con los datos completos de cada luchador (nombre, género, shows...).
function resolverEquipo(estado, equipo) {
  return { ...equipo, luchadores: equipo.miembros.map((id) => obtenerLuchadorParaHistorial(estado, id)) };
}

// ---------- Validaciones internas ----------

function validarNombreEquipo(nombre, etiqueta) {
  const limpio = String(nombre ?? "").trim();
  if (!limpio) throw new Error(`El nombre del ${etiqueta} es obligatorio.`);
  return limpio;
}

function validarLuchadoresEnRoster(estado, ids) {
  ids.forEach((id) => {
    if (!estado.roster.some((w) => w.id === id)) throw new Error("Uno de los luchadores no existe en el Roster.");
  });
}

function validarLuchadorSinStable(estado, luchadorId) {
  const otro = stableDeLuchador(estado, luchadorId);
  if (otro) throw new Error(`${nombreLuchadorPorId(estado, luchadorId)} ya pertenece al Stable ${otro.nombre}.`);
}

// `actuales` = miembros que el Tag Team ya tiene (al editar se pueden conservar
// aunque ya no sean miembros del Stable de origen).
function validarMiembrosTagTeam(estado, miembros, stableOrigen, actuales = []) {
  const ids = Array.isArray(miembros) ? miembros.filter(Boolean) : [];
  if (ids.length !== MIEMBROS_TAG_TEAM || new Set(ids).size !== MIEMBROS_TAG_TEAM) {
    throw new Error(`Un Tag Team necesita exactamente ${MIEMBROS_TAG_TEAM} luchadores distintos.`);
  }
  validarLuchadoresEnRoster(estado, ids);
  if (stableOrigen) {
    ids.forEach((id) => {
      if (!stableOrigen.miembros.includes(id) && !actuales.includes(id)) {
        throw new Error(`${nombreLuchadorPorId(estado, id)} no es miembro actual de ${stableOrigen.nombre}.`);
      }
    });
  }
  return ids;
}

// ---------- Stables ----------

function crearStable(estado, datos) {
  const eq = equiposDe(estado);
  const nombre = validarNombreEquipo(datos.nombre, "Stable");
  const miembros = [...new Set((datos.miembros || []).filter(Boolean))];
  if (!miembros.length) throw new Error("Un Stable necesita al menos un miembro.");
  validarLuchadoresEnRoster(estado, miembros);
  miembros.forEach((id) => validarLuchadorSinStable(estado, id));
  const stable = { id: crearIdEquipo("stable", idsEquipos(estado)), nombre, miembros };
  eq.stables.push(stable);
  return stable;
}

function renombrarStable(estado, id, nombre) {
  const stable = obtenerStable(estado, id);
  if (!stable) throw new Error("No existe el Stable.");
  stable.nombre = validarNombreEquipo(nombre, "Stable");
  return stable;
}

function agregarMiembroStable(estado, stableId, luchadorId) {
  const stable = obtenerStable(estado, stableId);
  if (!stable) throw new Error("No existe el Stable.");
  if (!luchadorId) throw new Error("Elegí un luchador.");
  validarLuchadoresEnRoster(estado, [luchadorId]);
  validarLuchadorSinStable(estado, luchadorId);
  stable.miembros.push(luchadorId);
  return stable;
}

// Si el Stable queda sin miembros se elimina automáticamente (con sus Tag Teams
// derivados). Devuelve el resultado de eliminarStable, o null si el Stable sigue.
function quitarMiembroStable(estado, stableId, luchadorId) {
  const stable = obtenerStable(estado, stableId);
  if (!stable) throw new Error("No existe el Stable.");
  if (!stable.miembros.includes(luchadorId)) throw new Error("Ese luchador no es miembro del Stable.");
  stable.miembros = stable.miembros.filter((id) => id !== luchadorId);
  return stable.miembros.length ? null : eliminarStable(estado, stableId);
}

// Elimina el Stable y todos los Tag Teams derivados de él. No toca el Roster.
function eliminarStable(estado, id) {
  const eq = equiposDe(estado);
  const stable = obtenerStable(estado, id);
  if (!stable) throw new Error("No existe el Stable.");
  const tagTeamsEliminados = eq.tagTeams.filter((t) => t.stableOrigenId === id);
  eq.tagTeams = eq.tagTeams.filter((t) => t.stableOrigenId !== id);
  eq.stables = eq.stables.filter((s) => s.id !== id);
  return { stable, tagTeamsEliminados };
}

// ---------- Tag Teams ----------

function crearTagTeam(estado, datos) {
  const eq = equiposDe(estado);
  const nombre = validarNombreEquipo(datos.nombre, "Tag Team");
  const stableOrigen = datos.stableOrigenId ? obtenerStable(estado, datos.stableOrigenId) : null;
  if (datos.stableOrigenId && !stableOrigen) throw new Error("El Stable de origen no existe.");
  const miembros = validarMiembrosTagTeam(estado, datos.miembros, stableOrigen);
  const tag = { id: crearIdEquipo("tag", idsEquipos(estado)), nombre, miembros, stableOrigenId: stableOrigen ? stableOrigen.id : null };
  eq.tagTeams.push(tag);
  return tag;
}

// Tag Team derivado: los miembros solo pueden ser miembros actuales del Stable.
// Después es una entidad independiente (se edita y se usa por separado).
function crearTagTeamDerivado(estado, stableId, datos) {
  if (!obtenerStable(estado, stableId)) throw new Error("El Stable de origen no existe.");
  return crearTagTeam(estado, { ...datos, stableOrigenId: stableId });
}

function editarTagTeam(estado, id, cambios) {
  const tag = obtenerTagTeam(estado, id);
  if (!tag) throw new Error("No existe el Tag Team.");
  const nombre = cambios.nombre !== undefined ? validarNombreEquipo(cambios.nombre, "Tag Team") : tag.nombre;
  const stableOrigen = tag.stableOrigenId ? obtenerStable(estado, tag.stableOrigenId) : null;
  const miembros = cambios.miembros !== undefined
    ? validarMiembrosTagTeam(estado, cambios.miembros, stableOrigen, tag.miembros)
    : tag.miembros;
  tag.nombre = nombre;
  tag.miembros = miembros;
  return tag;
}

function eliminarTagTeam(estado, id) {
  const eq = equiposDe(estado);
  const tag = obtenerTagTeam(estado, id);
  if (!tag) throw new Error("No existe el Tag Team.");
  eq.tagTeams = eq.tagTeams.filter((t) => t.id !== id);
  return tag;
}

// ---------- Integración con el Roster ----------

// Se llama desde eliminarLuchador (roster.js). Un Tag Team no puede quedar con
// un solo luchador, así que se elimina; el luchador sale de su Stable y, si el
// Stable queda vacío, se elimina con sus Tag Teams derivados.
function quitarLuchadorDeEquipos(estado, luchadorId) {
  const eq = equiposDe(estado);
  eq.tagTeams = eq.tagTeams.filter((t) => !t.miembros.includes(luchadorId));
  const stable = stableDeLuchador(estado, luchadorId);
  if (stable) quitarMiembroStable(estado, stable.id, luchadorId);
}
