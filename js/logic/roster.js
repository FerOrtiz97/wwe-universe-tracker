// Reglas y consultas del roster.

const SHOWS_VALIDOS = ["RAW", "SmackDown", "NXT", "Retirado"];
const JUEGOS_VALIDOS = ["WWE 2K25", "WWE 2K26"];

function generarIdUnico(estado, nombre) {
  const base = slugify(nombre) || `luchador-${Date.now()}`;
  let id = base;
  let contador = 2;
  while (estado.roster.some((w) => w.id === id)) id = `${base}-${contador++}`;
  return id;
}

function normalizarShows(shows) {
  if (Array.isArray(shows)) return shows.filter((s) => SHOWS_VALIDOS.includes(s));
  if (typeof shows === "string" && SHOWS_VALIDOS.includes(shows)) return [shows];
  return ["NXT"];
}

function agregarLuchador(estado, datos) {
  const nombre = String(datos.nombre || "").trim();
  if (!nombre) throw new Error("El nombre es obligatorio.");
  const nuevo = {
    id: generarIdUnico(estado, nombre),
    nombre,
    genero: datos.genero === "Mujer" ? "Mujer" : "Hombre",
    shows: normalizarShows(datos.shows ?? datos.show),
    overallBase: datos.overallBase ?? null,
    overallActual: datos.overallActual ?? datos.overallBase ?? null,
    edadBase: datos.edadBase ?? null,
    edadActual: datos.edadActual ?? datos.edadBase ?? null,
  };
  estado.roster.push(nuevo);
  return nuevo;
}

function editarLuchador(estado, id, cambios) {
  const luchador = estado.roster.find((w) => w.id === id);
  if (!luchador) throw new Error(`No existe el luchador ${id}`);
  if (cambios.nombre !== undefined) {
    const nombre = String(cambios.nombre).trim();
    if (!nombre) throw new Error("El nombre no puede quedar vacío.");
    luchador.nombre = nombre;
  }
  if (cambios.shows !== undefined) luchador.shows = normalizarShows(cambios.shows);
  if (cambios.show !== undefined && cambios.shows === undefined) luchador.shows = normalizarShows(cambios.show);
  ["genero", "overallBase", "overallActual", "edadBase", "edadActual"].forEach((campo) => {
    if (cambios[campo] !== undefined) luchador[campo] = cambios[campo];
  });
  return luchador;
}

function retirarLuchador(estado, id) {
  const luchador = editarLuchador(estado, id, {});
  luchador.shows = ["Retirado"];
  return luchador;
}

function eliminarLuchador(estado, id) {
  const indice = estado.roster.findIndex((w) => w.id === id);
  if (indice === -1) throw new Error("No existe el luchador.");
  // Solo se elimina del roster. Los registros históricos mantienen el id.
  const eliminado = estado.roster.splice(indice, 1)[0];
  // Teams & Stables no puede quedar apuntando a un luchador que ya no existe.
  if (typeof quitarLuchadorDeEquipos === "function") quitarLuchadorDeEquipos(estado, id);
  return eliminado;
}

function luchadorPerteneceAShow(w, show) {
  const shows = normalizarShows(w.shows ?? w.show);
  return show === "todos" || shows.includes(show);
}

function listarLuchadores(estado, opciones = {}) {
  const { busqueda = "", show = "todos", genero = "todos", ordenarPor = "nombre", orden = "asc" } = opciones;
  let lista = estado.roster.slice();
  if (show !== "todos") lista = lista.filter((w) => luchadorPerteneceAShow(w, show));
  if (genero !== "todos") lista = lista.filter((w) => w.genero === genero);
  if (busqueda.trim()) {
    const texto = busqueda.trim().toLowerCase();
    lista = lista.filter((w) => w.nombre.toLowerCase().includes(texto));
  }
  lista.sort((a, b) => {
    const va = a[ordenarPor];
    const vb = b[ordenarPor];
    let cmp;
    if (typeof va === "string") cmp = va.localeCompare(String(vb ?? ""), "es", { sensitivity: "base" });
    else cmp = (va ?? -Infinity) - (vb ?? -Infinity);
    if (cmp === 0) cmp = a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    return orden === "asc" ? cmp : -cmp;
  });
  return lista;
}

function promedio(numeros) {
  const validos = numeros.filter((n) => n !== null && n !== undefined && !Number.isNaN(Number(n)));
  return validos.length ? validos.reduce((acc, n) => acc + Number(n), 0) / validos.length : null;
}

function resumenRoster(estado) {
  const roster = estado.roster;
  const porShow = { RAW: 0, SmackDown: 0, NXT: 0, Retirado: 0 };
  for (const w of roster) for (const show of normalizarShows(w.shows ?? w.show)) if (porShow[show] !== undefined) porShow[show]++;
  const porGenero = { Mujer: 0, Hombre: 0 };
  for (const w of roster) if (porGenero[w.genero] !== undefined) porGenero[w.genero]++;
  const totalGenero = porGenero.Mujer + porGenero.Hombre;
  return {
    total: roster.length,
    porShow,
    activos: roster.filter((w) => !normalizarShows(w.shows ?? w.show).includes("Retirado")).length,
    overallPromedio: promedio(roster.map((w) => w.overallActual)),
    edadPromedio: promedio(roster.map((w) => w.edadActual)),
    porGenero,
    porcentajeMujeres: totalGenero ? Math.round((porGenero.Mujer / totalGenero) * 100) : null,
    porcentajeHombres: totalGenero ? Math.round((porGenero.Hombre / totalGenero) * 100) : null,
  };
}

function resumenPorShowYGenero(estado) {
  return ["RAW", "SmackDown", "NXT", "Retirado"].map((show) => {
    const delShow = estado.roster.filter((w) => luchadorPerteneceAShow(w, show));
    const mujeres = delShow.filter((w) => w.genero === "Mujer").length;
    const hombres = delShow.filter((w) => w.genero === "Hombre").length;
    const total = mujeres + hombres;
    return { show, mujeres, hombres, total, porcentajeMujeres: total ? Math.round(mujeres / total * 100) : null, porcentajeHombres: total ? Math.round(hombres / total * 100) : null };
  });
}

function nombreLuchadorPorId(estado, id) {
  const w = estado.roster.find((x) => x.id === id);
  if (w) return w.nombre;
  for (const t of estado.temporadas || []) {
    const r = t.registros.find((x) => x.luchadorId === id);
    if (r?.nombreOriginal) return r.nombreOriginal;
  }
  return "Luchador eliminado";
}

function obtenerLuchadorParaHistorial(estado, id) {
  const w = estado.roster.find((x) => x.id === id);
  if (w) return w;
  return { id, nombre: nombreLuchadorPorId(estado, id), genero: null, shows: ["Retirado"], overallBase: null, overallActual: null, edadBase: null, edadActual: null, eliminado: true };
}
