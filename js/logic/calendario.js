// Reglas del módulo Calendario.
// El Calendario propone combates: Exposición aporta los protagonistas y el
// Roster general aporta preferentemente los oponentes de Overall <=75.

const TIPOS_COMBATE_CALENDARIO = {
  "1vs1": { label: "1 vs 1", participantes: 2 },
  "2vs2": { label: "2 vs 2", participantes: 4 },
  "triple": { label: "Triple Threat", participantes: 3 },
  "fatal4": { label: "Fatal 4-Way", participantes: 4 },
  "3vs3": { label: "3 vs 3", participantes: 6 },
  "2vs2vs2": { label: "2 vs 2 vs 2", participantes: 6 },
};

const PROBABILIDADES_TIPOS_COMBATE_CALENDARIO = {
  "1vs1": 30,
  "2vs2": 25,
  "triple": 15,
  "fatal4": 10,
  "3vs3": 10,
  "2vs2vs2": 10,
};

function normalizarProbabilidadesTiposCalendario(calendario) {
  const actuales = calendario?.probabilidadesTipos;
  const tipos = Object.keys(TIPOS_COMBATE_CALENDARIO);
  const valores = {};
  tipos.forEach(tipo => {
    const valor = Number(actuales?.[tipo]);
    valores[tipo] = Number.isFinite(valor) && valor >= 0 ? valor : PROBABILIDADES_TIPOS_COMBATE_CALENDARIO[tipo];
  });

  const total = tipos.reduce((suma, tipo) => suma + valores[tipo], 0);
  const validas = tipos.every(tipo => Number.isFinite(valores[tipo]) && valores[tipo] >= 0);
  if (!validas || Math.abs(total - 100) > 1e-9) {
    return { ...PROBABILIDADES_TIPOS_COMBATE_CALENDARIO };
  }
  return valores;
}

function sortearTipoCombateCalendario(probabilidades, bloqueados = new Set()) {
  const disponibles = Object.keys(TIPOS_COMBATE_CALENDARIO)
    .filter(tipo => !bloqueados.has(tipo));

  if (!disponibles.length) return null;

  const total = disponibles.reduce((suma, tipo) => suma + Number(probabilidades[tipo] || 0), 0);
  if (total <= 0) return disponibles[Math.floor(Math.random() * disponibles.length)];

  let objetivo = Math.random() * total;
  for (const tipo of disponibles) {
    objetivo -= Number(probabilidades[tipo] || 0);
    if (objetivo < 0) return tipo;
  }
  return disponibles[disponibles.length - 1];
}

function normalizarCalendario(estado) {
  estado.calendario = estado.calendario && typeof estado.calendario === "object" ? estado.calendario : {};
  estado.calendario.temporadaId ??= estado.config?.temporadaActualId ?? null;
  estado.calendario.miercoles = Array.isArray(estado.calendario.miercoles) ? estado.calendario.miercoles : [];
  estado.calendario.jueves = Array.isArray(estado.calendario.jueves) ? estado.calendario.jueves : [];
  estado.calendario.probabilidadesTipos = normalizarProbabilidadesTiposCalendario(estado.calendario);
  estado.calendario.miercoles.forEach(normalizarCombateCalendario);
  estado.calendario.jueves.forEach(normalizarCombateCalendario);
  return estado.calendario;
}

function normalizarCombateCalendario(combate) {
  combate.id ??= `combate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  combate.tipo ??= "1vs1";
  // Compatibilidad con carteleras anteriores: "sixTag" era el nombre viejo
  // del combate de 6 participantes. El Calendario actual usa exactamente
  // los seis tipos definidos arriba.
  if (combate.tipo === "sixTag") combate.tipo = "3vs3";
  if (!TIPOS_COMBATE_CALENDARIO[combate.tipo]) combate.tipo = "1vs1";
  const anteriores = Array.isArray(combate.participantes) ? combate.participantes : [];
  combate.participantes = anteriores.map((p, indice) => {
    if (typeof p === "string") return { id: p, rol: indice === 0 ? "protagonista" : "oponente" };
    return { id: p.id, rol: p.rol === "protagonista" ? "protagonista" : "oponente" };
  }).filter(p => p.id);
  if (["2vs2", "3vs3", "2vs2vs2"].includes(combate.tipo)) {
    const cantidadPorEquipo = combate.tipo === "2vs2vs2" ? 2 : combate.tipo === "3vs3" ? 3 : 2;
    if (!Array.isArray(combate.equipos) || combate.equipos.length !== (combate.tipo === "2vs2vs2" ? 3 : 2)) {
      combate.equipos = [];
      for (let i = 0; i < (combate.tipo === "2vs2vs2" ? 3 : 2); i++) {
        combate.equipos.push(combate.participantes.slice(i * cantidadPorEquipo, (i + 1) * cantidadPorEquipo).map(p => p.id));
      }
    } else {
      combate.equipos = combate.equipos.map(e => Array.isArray(e) ? e.filter(Boolean) : []);
    }
  } else {
    combate.equipos = null;
  }
  combate.ganadorId ??= null;
  combate.resultadoRegistrado = !!combate.resultadoRegistrado;
  // Género forzado por combate (selector "Cambiar tipo de combate" ampliado):
  // null = 🎲 Aleatorio (comportamiento automático de siempre); "Hombre" /
  // "Mujer" = ese combate se restringe exclusivamente a ese género.
  combate.generoForzado = combate.generoForzado === "Hombre" || combate.generoForzado === "Mujer" ? combate.generoForzado : null;
  // 🔒 Bloqueo por combate: un combate bloqueado no se toca con ninguna
  // regeneración automática (individual, "regenerar desbloqueados" ni la
  // regeneración global de la cartelera).
  combate.bloqueado = !!combate.bloqueado;
  return combate;
}

function prioridadCalendario(balance) {
  if (balance <= 0) return 1;
  if (balance === 1) return 2;
  if (balance <= 10) return 3;
  if (balance <= 29) return 4;
  return 5;
}

function datosParticipantesCalendario(estado) {
  const mapa = new Map();
  for (const entrada of listarExposicion(estado)) {
    const d = datosExposicion(estado, entrada);
    if (!d || mapa.has(d.luchadorId)) continue;
    const w = obtenerLuchadorParaHistorial(estado, d.luchadorId);
    if (!w) continue;
    const resumen = resumenExposicion(estado, d.luchadorId);
    const total = resumen.totalCombates;
    const participacion = clasificarParticipacionCalendario(total);
    const balance = resumen.balance;
    mapa.set(d.luchadorId, {
      id: d.luchadorId,
      nombre: w.nombre,
      genero: w.genero,
      shows: normalizarShows(w.shows ?? w.show),
      overall: Number(w.overallActual ?? w.overallBase ?? 0),
      balance,
      participacion,
      victorias: resumen.victorias,
      derrotas: resumen.derrotas,
      totalCombates: total,
      tendencia: clasificarTendenciaCalendario(resumen),
      prioridad: prioridadCalendario(balance),
      apariciones: 0,
    });
  }
  return [...mapa.values()];
}

function datosRosterOponentesCalendario(estado, idsExposicion) {
  return estado.roster
    .filter(w => !normalizarShows(w.shows ?? w.show).includes("Retirado"))
    .filter(w => !idsExposicion.has(w.id))
    .map(w => ({
      id: w.id,
      nombre: w.nombre,
      genero: w.genero,
      shows: normalizarShows(w.shows ?? w.show),
      overall: Number(w.overallActual ?? w.overallBase ?? 0),
      esExposicion: false,
      apariciones: 0,
    }));
}

function aleatorio(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

function elegirConPrioridad(lista, usados = new Set(), opciones = {}) {
  const { excluirIds = new Set() } = opciones;
  const candidatos = lista.filter(w => !usados.has(w.id) && !excluirIds.has(w.id));
  if (!candidatos.length) return null;

  const minPrioridad = Math.min(...candidatos.map(w => w.prioridad));
  const porPrioridad = candidatos.filter(w => w.prioridad === minPrioridad);
  const minBalance = Math.min(...porPrioridad.map(w => w.balance));
  const porBalance = porPrioridad.filter(w => w.balance === minBalance);
  const minParticipacion = Math.min(...porBalance.map(w => w.totalCombates));
  const porParticipacion = porBalance.filter(w => w.totalCombates === minParticipacion);
  const minApariciones = Math.min(...porParticipacion.map(w => w.apariciones || 0));
  const empate = porParticipacion.filter(w => (w.apariciones || 0) === minApariciones);
  return aleatorio(empate);
}

function ordenarProtagonistasCalendario(lista, usadosGlobales = new Set(), excluirIds = new Set(), aparicionesGlobales = new Map()) {
  // Ya no ordena: devuelve SOLO los candidatos que hoy son elegibles.
  //  1) Se excluyen los ya asignados en el combate actual (excluirIds).
  //  2) Los usados globalmente quedan AFUERA mientras exista algún protagonista
  //     sin usar. Solo si no queda ninguno se habilita repetir, empezando por
  //     los que menos apariciones acumulan.
  //  3) Del grupo resultante se conserva únicamente la prioridad más baja
  //     disponible (P1 → P2 → P3 → P4 → P5). Dentro de esa prioridad no hay
  //     criterio de orden (ni balance, ni combates, ni nombre): quien llama
  //     sortea al azar entre los devueltos.
  const base = lista.filter(w => !excluirIds.has(w.id));
  if (!base.length) return [];

  let grupo = base.filter(w => !usadosGlobales.has(w.id));
  if (!grupo.length) {
    const apariciones = w => aparicionesGlobales.get(w.id) || 0;
    const minApariciones = Math.min(...base.map(apariciones));
    grupo = base.filter(w => apariciones(w) === minApariciones);
  }

  const minPrioridad = Math.min(...grupo.map(w => w.prioridad));
  return grupo.filter(w => w.prioridad === minPrioridad);
}

// `genero` null = todos los géneros: hombres y mujeres comparten la misma escala P1..P5.
function elegirProtagonistaCalendario(exposicion, genero, usadosGlobales = new Set(), excluirIds = new Set(), aparicionesGlobales = new Map()) {
  const base = exposicion
    .filter(w => (!genero || w.genero === genero) && !excluirIds.has(w.id))
    .map(w => ({ ...w, apariciones: aparicionesGlobales.get(w.id) || 0 }));
  if (!base.length) return null;

  const candidatos = ordenarProtagonistasCalendario(base, usadosGlobales, excluirIds, aparicionesGlobales);
  return candidatos.length ? { ...aleatorio(candidatos) } : null;
}

// Se usa para completar equipos temporales: misma regla que un protagonista
// individual (prioridad más baja disponible + azar + sin repetir usados).
function elegirProtagonistaAleatorioCalendario(exposicion, genero, excluirIds = new Set(), aparicionesGlobales = new Map(), usadosGlobales = new Set()) {
  return elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, excluirIds, aparicionesGlobales);
}

// Géneros con los que se puede armar el combate. Solo se repite un protagonista
// si NINGÚN género viable tiene suficientes protagonistas sin usar.
function generosViablesCalendario(exposicion, oponentes, usadosGlobales, tipo) {
  const cantidad = TIPOS_COMBATE_CALENDARIO[tipo]?.participantes ?? 2;
  const cantidadProtagonistas = cantidadProtagonistasCalendario(tipo);
  const cantidadOponentes = cantidad - cantidadProtagonistas;

  const estructurales = ["Hombre", "Mujer"].filter(g =>
    exposicion.filter(w => w.genero === g).length >= cantidadProtagonistas &&
    oponentes.filter(w => w.genero === g).length >= cantidadOponentes
  );
  const sinRepetir = estructurales.filter(g =>
    exposicion.filter(w => w.genero === g && !usadosGlobales.has(w.id)).length >= cantidadProtagonistas
  );
  return sinRepetir.length ? sinRepetir : estructurales;
}

function elegirGeneroParaCombateCalendario(exposicion, oponentes, usadosGlobales, tipo, aparicionesGlobales = new Map()) {
  const generos = generosViablesCalendario(exposicion, oponentes, usadosGlobales, tipo);
  if (!generos.length) return null;
  if (generos.length === 1) return generos[0];

  // El género nunca es una escala aparte: P1 de hombres y de mujeres forman UNA
  // sola prioridad. Se sortea entre TODOS los candidatos de la prioridad más
  // baja disponible y el género del elegido define el género del combate.
  const base = exposicion.filter(w => generos.includes(w.genero));
  const candidatos = ordenarProtagonistasCalendario(base, usadosGlobales, new Set(), aparicionesGlobales);
  return candidatos.length ? aleatorio(candidatos).genero : aleatorio(generos);
}

function elegirOponenteCalendario(oponentes, genero, usadosGlobales = new Set(), usadosLocal = new Set(), excluirIds = new Set(), aparicionesGlobales = new Map()) {
  const base = oponentes.filter(w => w.genero === genero && !usadosLocal.has(w.id) && !excluirIds.has(w.id));
  if (!base.length) return null;

  // Overall <=75 sigue siendo la preferencia principal. Dentro de ese grupo
  // se favorecen las menores apariciones de la cartelera actual. Repetir no
  // está prohibido si las reglas de selección lo llevan a ser la alternativa.
  const bajos = base.filter(w => w.overall <= 75);
  const grupo = bajos.length ? bajos : base;
  const minApariciones = Math.min(...grupo.map(w => aparicionesGlobales.get(w.id) || 0));
  const menosApariciones = grupo.filter(w => (aparicionesGlobales.get(w.id) || 0) === minApariciones);
  return aleatorio(menosApariciones);
}

function tiposViablesCalendario(exposicion, oponentes, tipo, generoPreferido = null) {
  const cantidad = TIPOS_COMBATE_CALENDARIO[tipo]?.participantes ?? 2;
  const cantidadProtagonistas = tipo === "2vs2" ? 2 : tipo === "3vs3" ? 3 : tipo === "2vs2vs2" ? 2 : 1;
  const nOponentes = cantidad - cantidadProtagonistas;
  return ["Hombre", "Mujer"].filter(g => {
    if (generoPreferido && g !== generoPreferido) return false;
    return exposicion.filter(w => w.genero === g).length >= cantidadProtagonistas &&
      oponentes.filter(w => w.genero === g).length >= nOponentes;
  });
}

function cantidadProtagonistasCalendario(tipo) {
  return tipo === "2vs2" ? 2 : tipo === "3vs3" ? 3 : tipo === "2vs2vs2" ? 2 : 1;
}

function rankingProtagonistaEquipoCalendario(estado, ids, datosExposicion, aparicionesGlobales) {
  const mapa = new Map(datosExposicion.map(w => [w.id, w]));
  return ids.map(id => mapa.get(id)).filter(Boolean).sort((a, b) =>
    a.prioridad - b.prioridad ||
    a.balance - b.balance ||
    a.totalCombates - b.totalCombates ||
    (aparicionesGlobales.get(a.id) || 0) - (aparicionesGlobales.get(b.id) || 0)
  );
}

function compararEquiposProtagonistasCalendario(a, b, datosExposicion, aparicionesGlobales) {
  const ra = rankingProtagonistaEquipoCalendario(null, a, datosExposicion, aparicionesGlobales);
  const rb = rankingProtagonistaEquipoCalendario(null, b, datosExposicion, aparicionesGlobales);
  for (let i = 0; i < Math.min(ra.length, rb.length); i++) {
    const x = ra[i], y = rb[i];
    const comparacion = x.prioridad - y.prioridad ||
      x.balance - y.balance ||
      x.totalCombates - y.totalCombates ||
      (aparicionesGlobales.get(x.id) || 0) - (aparicionesGlobales.get(y.id) || 0);
    if (comparacion) return comparacion;
  }
  return 0;
}

function compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales) {
  if (a === b || (a.length === b.length && a.every((id, i) => id === b[i]))) return 0;
  const datosA = a.map(id => mapaOponentes.get(id)).filter(Boolean);
  const datosB = b.map(id => mapaOponentes.get(id)).filter(Boolean);
  const bajosA = datosA.filter(w => w.overall <= 75).length;
  const bajosB = datosB.filter(w => w.overall <= 75).length;
  if (bajosA !== bajosB) return bajosB - bajosA;

  // Si ambos equipos cumplen igual la preferencia de Overall, se elige el
  // que haya tenido menos apariciones acumuladas en la cartelera.
  const aparicionesA = datosA.reduce((s, w) => s + (aparicionesGlobales.get(w.id) || 0), 0);
  const aparicionesB = datosB.reduce((s, w) => s + (aparicionesGlobales.get(w.id) || 0), 0);
  if (aparicionesA !== aparicionesB) return aparicionesA - aparicionesB;

  const overallA = datosA.reduce((s, w) => s + w.overall, 0);
  const overallB = datosB.reduce((s, w) => s + w.overall, 0);
  if (overallA !== overallB) return overallA - overallB;
  return 0;
}

function equiposTagValidosCalendario(estado, poolIds, genero, cantidad, usadosGlobales, usadosLocal = new Set(), datosProtagonistas = null, aparicionesGlobales = new Map()) {
  const pool = new Set(poolIds);
  const base = listarTagTeams(estado)
    .filter(tag => Array.isArray(tag.miembros) && tag.miembros.length === 2)
    .map(tag => tag.miembros.slice())
    .filter(ids => new Set(ids).size === 2)
    .filter(ids => ids.every(id => pool.has(id)))
    .filter(ids => ids.every(id => {
      const w = obtenerLuchadorParaHistorial(estado, id);
      return w?.genero === genero && !usadosLocal.has(id);
    }));

  // Lado protagonistas (Exposición): la prioridad decide el ANCLA, no todo el
  // equipo. Un Tag es candidato si AL MENOS UNO de sus miembros es un ancla
  // elegible (grupo que ya calcula ordenarProtagonistasCalendario: prioridad
  // más baja sin usar). El compañero puede tener otra prioridad. Un Tag cuyos
  // miembros son todos de peor prioridad no se adelanta a un ancla válida.
  if (datosProtagonistas) {
    const elegibles = ordenarProtagonistasCalendario(
      datosProtagonistas.filter(w => w.genero === genero),
      usadosGlobales, usadosLocal, aparicionesGlobales
    );
    const idsElegibles = new Set(elegibles.map(w => w.id));
    return base.filter(ids => ids.some(id => idsElegibles.has(id)));
  }

  // Lado oponentes (Roster): no hay escala de prioridad; comportamiento sin cambios
  // (se prefiere un Tag sin miembros repetidos y, si no hay ninguno, se permite repetir).
  const sinRepetir = base.filter(ids => ids.every(id => !usadosGlobales.has(id)));
  return sinRepetir.length ? sinRepetir : base;
}

function equiposTresValidosCalendario(estado, poolIds, genero, usadosGlobales, usadosLocal = new Set(), datosProtagonistas = null, aparicionesGlobales = new Map()) {
  const pool = new Set(poolIds);
  const candidatos = [];
  const vistos = new Set();
  const stables = listarStables(estado);
  const tags = listarTagTeams(estado);

  for (const stable of stables) {
    // Igual que en equiposTagValidosCalendario: usadosLocal siempre descarta
    // (no repetir dentro del mismo combate); usadosGlobales se resuelve
    // después como preferencia, no como descarte total del Stable.
    const miembros = stable.miembros.filter(id => pool.has(id) && !usadosLocal.has(id));
    if (miembros.length < 3) continue;

    const agregar = ids => {
      const unicos = [...new Set(ids)];
      if (unicos.length !== 3 || !unicos.every(id => miembros.includes(id))) return;
      if (!unicos.every(id => obtenerLuchadorParaHistorial(estado, id)?.genero === genero)) return;
      const clave = unicos.slice().sort().join("|");
      if (vistos.has(clave)) return;
      vistos.add(clave);
      candidatos.push(unicos);
    };

    // Prioridad: un Tag Team existente dentro del Stable + un tercer miembro compatible.
    for (const tag of tags.filter(t => t.stableOrigenId === stable.id)) {
      const base = tag.miembros.filter(id => miembros.includes(id));
      if (base.length !== 2) continue;
      for (const tercero of miembros) {
        if (!base.includes(tercero)) agregar([...base, tercero]);
      }
    }

    // Si no hay Tag Team utilizable, también se consideran tríos del mismo Stable.
    for (let i = 0; i < miembros.length; i++) {
      for (let j = i + 1; j < miembros.length; j++) {
        for (let k = j + 1; k < miembros.length; k++) agregar([miembros[i], miembros[j], miembros[k]]);
      }
    }
  }

  // Igual criterio que en equiposTagValidosCalendario: del lado protagonistas,
  // un trío es candidato si al menos uno de sus miembros es un ancla elegible
  // de la prioridad vigente; los acompañantes pueden ser de otra prioridad.
  if (datosProtagonistas) {
    const elegibles = ordenarProtagonistasCalendario(
      datosProtagonistas.filter(w => w.genero === genero),
      usadosGlobales, usadosLocal, aparicionesGlobales
    );
    const idsElegibles = new Set(elegibles.map(w => w.id));
    return candidatos.filter(ids => ids.some(id => idsElegibles.has(id)));
  }

  const sinRepetir = candidatos.filter(ids => ids.every(id => !usadosGlobales.has(id)));
  return sinRepetir.length ? sinRepetir : candidatos;
}

function elegirEquipoCalendario(candidatos, comparar, aleatorioEnEmpate = true) {
  if (!candidatos.length) return null;
  const ordenados = candidatos.slice().sort(comparar);
  const mejor = ordenados[0];
  const iguales = ordenados.filter(c => comparar(c, mejor) === 0);
  return aleatorioEnEmpate ? aleatorio(iguales) : mejor;
}

// Tags (2vs2 y 2vs2vs2) o Stables (3vs3) existentes y disponibles para el equipo protagonista.
function equiposExistentesProtagonistasCalendario(estado, ids, tipo, genero, usadosGlobales, usadosLocal = new Set(), datosProtagonistas = null, aparicionesGlobales = new Map()) {
  return tipo === "3vs3"
    ? equiposTresValidosCalendario(estado, ids, genero, usadosGlobales, usadosLocal, datosProtagonistas, aparicionesGlobales)
    : equiposTagValidosCalendario(estado, ids, genero, 2, usadosGlobales, usadosLocal, datosProtagonistas, aparicionesGlobales);
}

// Lado protagonistas: la PRIORIDAD elige el ANCLA (azar dentro de la prioridad
// más baja disponible) y el Tag/Stable real del ancla aporta los ACOMPAÑANTES,
// aunque tengan otra prioridad. `equipo` es null si el ancla no tiene una
// estructura válida para este tipo de combate (el llamador completa el equipo).
function elegirEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, usadosGlobales, usadosLocal, aparicionesGlobales) {
  const ancla = elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, usadosLocal, aparicionesGlobales);
  if (!ancla) return { ancla: null, equipo: null };
  const candidatos = equiposExistentesProtagonistasCalendario(
    estado, exposicion.map(w => w.id), tipo, genero, usadosGlobales, usadosLocal, exposicion, aparicionesGlobales
  ).filter(equipo => equipo.includes(ancla.id));
  const equipo = elegirEquipoCalendario(candidatos, (a, b) => compararEquiposProtagonistasCalendario(a, b, exposicion, aparicionesGlobales));
  return { ancla, equipo };
}

// Completa un equipo protagonista a partir de `base` (ids ya elegidos: el ancla,
// o los protagonistas que se conservan al cambiar de tipo).
//  1) Si existe un Tag/Stable real válido que contiene a TODOS los de `base`,
//     ese equipo determina los acompañantes (no se sortea contra otras opciones).
//  2) Si no, equipo temporal: se completa con protagonistas que NO tengan un
//     Tag/Stable real válido (esos aparecen cuando son ancla, con su estructura,
//     y no como relleno que la parte), con la regla de siempre (prioridad +
//     azar, sin repetir mientras se pueda). Solo si no alcanzan luchadores sin
//     estructura se completa con cualquiera.
function completarEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, base, cantidad, usadosGlobales, aparicionesGlobales) {
  const ids = exposicion.map(w => w.id);
  const reales = equiposExistentesProtagonistasCalendario(estado, ids, tipo, genero, new Set(), new Set(), null, new Map());

  const real = elegirEquipoCalendario(
    reales.filter(equipo => base.every(id => equipo.includes(id))),
    (a, b) => compararEquiposProtagonistasCalendario(a, b, exposicion, aparicionesGlobales)
  );
  if (real) return real;

  const conEstructura = new Set(reales.flat());
  for (const evitar of [conEstructura, new Set()]) {
    const libres = new Set([...base, ...evitar]);
    const equipo = base.slice();
    while (equipo.length < cantidad) {
      const candidato = elegirProtagonistaAleatorioCalendario(exposicion, genero, libres, aparicionesGlobales, usadosGlobales);
      if (!candidato) break;
      equipo.push(candidato.id);
      libres.add(candidato.id);
    }
    if (equipo.length === cantidad) return equipo;
  }
  return null;
}

// Equipo temporal de oponentes (no se guarda en estado.equipos): se usa cuando
// no hay Tag/Stable disponible en el Roster.
function equipoOponentesTemporalCalendario(oponentes, genero, cantidad, usadosGlobales, usadosLocal, aparicionesGlobales) {
  const elegidos = [];
  const bloqueados = new Set(usadosLocal);
  while (elegidos.length < cantidad) {
    const op = elegirOponenteCalendario(oponentes, genero, usadosGlobales, bloqueados, new Set(), aparicionesGlobales);
    if (!op) return null;
    elegidos.push(op.id);
    bloqueados.add(op.id);
  }
  return elegidos;
}

// Cantidad y tamaño de los equipos del lado OPONENTE según el tipo de combate.
// 1vs1 / Triple Threat / Fatal 4-Way: oponentes individuales (sin estructura).
function tamanosEquipoOponentesCalendario(tipo) {
  if (tipo === "2vs2") return [2];
  if (tipo === "3vs3") return [3];
  if (tipo === "2vs2vs2") return [2, 2];
  return [];
}

// Analogo a completarEquipoProtagonistaCalendario pero para el lado OPONENTE
// (usado al cambiar el tipo de combate). Reglas de la sección 17: los
// oponentes no están en Exposición, tienen Overall <=75 preferente, mismo
// género, y pueden usar Tags/Stables reales del Roster cuando corresponda.
//  1) Si existe un Tag/Stable real que contiene a TODOS los ids de `base`
//     (los oponentes que se conservan), ese equipo real determina el resto.
//  2) Si no, se completa con un equipo temporal (no se guarda como estructura
//     permanente), respetando `base` y sin repetir a los ya usados en el
//     combate (`excluirIds`) ni, mientras se pueda, a los usados en otras
//     carteleras (`usadosGlobales`).
function completarEquipoOponenteCalendario(estado, oponentes, cantidad, genero, base, usadosGlobales, aparicionesGlobales, excluirIds = new Set()) {
  if (cantidad <= 1) return base.length ? base.slice(0, cantidad) : null;

  const idsOponentes = oponentes.map(w => w.id);
  const usadosLocalParaReales = new Set(excluirIds);
  base.forEach(id => usadosLocalParaReales.delete(id));

  const reales = cantidad === 3
    ? equiposTresValidosCalendario(estado, idsOponentes, genero, new Set(), usadosLocalParaReales)
    : equiposTagValidosCalendario(estado, idsOponentes, genero, 2, new Set(), usadosLocalParaReales);

  const mapaOponentes = new Map(oponentes.map(w => [w.id, w]));
  if (base.length) {
    const real = elegirEquipoCalendario(
      reales.filter(equipo => equipo.length === cantidad && base.every(id => equipo.includes(id))),
      (a, b) => compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales)
    );
    if (real) return real;
  } else if (reales.length) {
    const real = elegirEquipoCalendario(
      reales.filter(equipo => equipo.length === cantidad),
      (a, b) => compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales)
    );
    if (real) return real;
  }

  const equipo = base.slice();
  const bloqueados = new Set([...excluirIds, ...equipo]);
  while (equipo.length < cantidad) {
    const candidato = elegirOponenteCalendario(oponentes, genero, usadosGlobales, bloqueados, new Set(), aparicionesGlobales);
    if (!candidato) return null;
    equipo.push(candidato.id);
    bloqueados.add(candidato.id);
  }
  return equipo;
}

function construirEquiposCalendario(estado, exposicion, oponentes, tipo, genero, usadosGlobales, aparicionesGlobales) {
  const idsOponentes = oponentes.map(w => w.id);
  const usadosLocal = new Set();
  const mapaOponentes = new Map(oponentes.map(w => [w.id, w]));
  const cantidadEquipos = tipo === "2vs2vs2" ? 3 : 2;
  const equipos = [];

  if (tipo === "2vs2") {
    const { ancla, equipo } = elegirEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!ancla) return null;
    let equipoA = equipo;

    equipoA ??= completarEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, [ancla.id], 2, usadosGlobales, aparicionesGlobales);
    if (!equipoA) return null;
    equipoA.forEach(id => usadosLocal.add(id));

    const tagsB = equiposTagValidosCalendario(estado, idsOponentes, genero, 2, usadosGlobales, usadosLocal);
    const equipoB = elegirEquipoCalendario(tagsB, (a, b) => compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales))
      ?? equipoOponentesTemporalCalendario(oponentes, genero, 2, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!equipoB || equipoB.some(id => usadosLocal.has(id))) return null;
    equipos.push(equipoA, equipoB);
  }

  if (tipo === "3vs3") {
    const { ancla, equipo } = elegirEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!ancla) return null;
    let equipoA = equipo;

    equipoA ??= completarEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, [ancla.id], 3, usadosGlobales, aparicionesGlobales);
    if (!equipoA) return null;
    equipoA.forEach(id => usadosLocal.add(id));

    const candidatosB = equiposTresValidosCalendario(estado, idsOponentes, genero, usadosGlobales, usadosLocal);
    const equipoB = elegirEquipoCalendario(candidatosB, (a, b) => compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales))
      ?? equipoOponentesTemporalCalendario(oponentes, genero, 3, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!equipoB || equipoB.some(id => usadosLocal.has(id))) return null;
    equipos.push(equipoA, equipoB);
  }

  if (tipo === "2vs2vs2") {
    const { ancla, equipo } = elegirEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!ancla) return null;
    let equipoA = equipo;

    equipoA ??= completarEquipoProtagonistaCalendario(estado, exposicion, tipo, genero, [ancla.id], 2, usadosGlobales, aparicionesGlobales);
    if (!equipoA) return null;
    equipoA.forEach(id => usadosLocal.add(id));
    equipos.push(equipoA);

    for (let i = 0; i < 2; i++) {
      const candidatos = equiposTagValidosCalendario(estado, idsOponentes, genero, 2, usadosGlobales, usadosLocal);
      const equipo = elegirEquipoCalendario(candidatos, (a, b) => compararEquiposOponentesCalendario(a, b, mapaOponentes, aparicionesGlobales))
        ?? equipoOponentesTemporalCalendario(oponentes, genero, 2, usadosGlobales, usadosLocal, aparicionesGlobales);
      if (!equipo || equipo.some(id => usadosLocal.has(id))) return null;
      equipo.forEach(id => usadosLocal.add(id));
      equipos.push(equipo);
    }
  }

  if (equipos.length !== cantidadEquipos) return null;
  const ids = equipos.flat();
  if (ids.length !== new Set(ids).size) return null;
  return equipos;
}

// `generoForzado`: null = comportamiento automático de siempre (el ancla
// decide el género). "Hombre"/"Mujer" fuerza ese género para el combate
// completo (protagonistas y oponentes); si no hay suficientes luchadores de
// ese género para el tipo, se devuelve null sin tocar nada.
function construirParticipantesCalendario(exposicion, oponentes, tipo, usadosGlobales = new Set(), aparicionesGlobales = new Map(), estado = null, generoForzado = null) {
  const cantidad = TIPOS_COMBATE_CALENDARIO[tipo]?.participantes ?? 2;
  if (cantidad < 2) return null;

  const cantidadProtagonistas = cantidadProtagonistasCalendario(tipo);
  const cantidadOponentes = cantidad - cantidadProtagonistas;

  // La prioridad decide el ancla (escala P1→P5 global, sin escala aparte por
  // género) y el género del ancla define el del combate. Un Tag/Stable nunca
  // se adelanta a la prioridad: se aplica después, sobre el ancla elegida.
  // Si el género viene forzado (selector 👨/👩 por combate), se usa ese en
  // lugar de dejar que lo decida el ancla, siempre que sea estructuralmente viable.
  let genero;
  if (generoForzado === "Hombre" || generoForzado === "Mujer") {
    const viable = tiposViablesCalendario(exposicion, oponentes, tipo, generoForzado).length > 0;
    genero = viable ? generoForzado : null;
  } else {
    genero = elegirGeneroParaCombateCalendario(exposicion, oponentes, usadosGlobales, tipo, aparicionesGlobales);
  }
  if (!genero) return null;

  // Los combates por equipos consultan exclusivamente Teams & Stables.
  // Si no existe una combinación válida, se usa el generador normal de participantes.
  if (estado && ["2vs2", "3vs3", "2vs2vs2"].includes(tipo)) {
    const equipos = construirEquiposCalendario(estado, exposicion, oponentes, tipo, genero, usadosGlobales, aparicionesGlobales);
    if (equipos) {
      const participantes = equipos.flatMap((equipo, indiceEquipo) =>
        equipo.map(id => ({ id, rol: indiceEquipo === 0 ? "protagonista" : "oponente" }))
      );
      participantes.forEach(p => aparicionesGlobales.set(p.id, (aparicionesGlobales.get(p.id) || 0) + 1));
      return { participantes, equipos };
    }
  }

  const participantes = [];
  const usadosLocal = new Set();
  for (let i = 0; i < cantidadProtagonistas; i++) {
    const protagonista = elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, usadosLocal, aparicionesGlobales);
    if (!protagonista) return null;
    participantes.push({ id: protagonista.id, rol: "protagonista" });
    usadosLocal.add(protagonista.id);
  }
  for (let i = 0; i < cantidadOponentes; i++) {
    const oponente = elegirOponenteCalendario(oponentes, genero, usadosGlobales, usadosLocal, new Set(), aparicionesGlobales);
    if (!oponente) return null;
    participantes.push({ id: oponente.id, rol: "oponente" });
    usadosLocal.add(oponente.id);
  }
  participantes.forEach(p => aparicionesGlobales.set(p.id, (aparicionesGlobales.get(p.id) || 0) + 1));
  return { participantes, equipos: null };
}

function generarCarteleraCalendario(estado, cantidad = 9, aparicionesGlobales = new Map()) {
  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);
  if (!exposicion.length) throw new Error("No hay luchadores seleccionados en Exposición para generar el Calendario.");
  if (!oponentes.length) throw new Error("No hay luchadores disponibles en el Roster para utilizar como oponentes.");

  const probabilidades = normalizarProbabilidadesTiposCalendario(normalizarCalendario(estado));
  const tiposPorShow = Object.fromEntries(Object.keys(TIPOS_COMBATE_CALENDARIO).map(tipo => [tipo, 0]));
  const usadosGlobales = new Set(aparicionesGlobales.keys());
  const combates = [];

  for (let i = 0; i < cantidad; i++) {
    const bloqueados = new Set(Object.keys(tiposPorShow).filter(tipo => tiposPorShow[tipo] >= 3));
    let tipo = sortearTipoCombateCalendario(probabilidades, bloqueados);
    if (!tipo) throw new Error("No hay tipos de combate disponibles para sortear.");

    const resultadoParticipantes = construirParticipantesCalendario(exposicion, oponentes, tipo, usadosGlobales, aparicionesGlobales, estado);
    if (!resultadoParticipantes) throw new Error("No hay suficientes luchadores válidos para completar la cartelera.");

    const participantes = resultadoParticipantes.participantes;
    participantes.forEach(p => usadosGlobales.add(p.id));
    tiposPorShow[tipo] += 1;
    combates.push({
      id: `combate-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      tipo,
      participantes,
      ganadorId: null,
      resultadoRegistrado: false,
    });
  }
  return combates;
}

function generarCalendarioCompleto(estado) {
  const temporadaId = estado.config?.temporadaActualId ?? estado.temporadas.at(-1)?.id ?? null;
  if (!temporadaId) throw new Error("No existe una temporada actual para registrar los resultados.");
  const aparicionesGlobales = new Map();
  return {
    temporadaId,
    miercoles: generarCarteleraCalendario(estado, 9, aparicionesGlobales),
    jueves: generarCarteleraCalendario(estado, 9, aparicionesGlobales),
  };
}

function candidatosCambioCalendario(estado, combate, indiceParticipante) {
  const participante = combate.participantes[indiceParticipante];
  if (!participante) return [];
  const actuales = new Set(combate.participantes.map(p => p.id));
  actuales.delete(participante.id);
  const genero = obtenerLuchadorParaHistorial(estado, participante.id)?.genero;

  if (participante.rol === "protagonista") {
    const exposicion = datosParticipantesCalendario(estado).filter(w => w.genero === genero && !actuales.has(w.id));
    return exposicion.sort((a, b) => a.prioridad - b.prioridad || a.balance - b.balance || a.totalCombates - b.totalCombates || a.nombre.localeCompare(b.nombre, "es"));
  }

  const idsExposicion = new Set(datosParticipantesCalendario(estado).map(w => w.id));
  const roster = datosRosterOponentesCalendario(estado, idsExposicion)
    .filter(w => w.genero === genero && !actuales.has(w.id));
  const bajos = roster.filter(w => w.overall <= 75);
  const altos = roster.filter(w => w.overall > 75);
  return [...bajos.sort((a,b) => a.overall - b.overall || a.nombre.localeCompare(b.nombre,"es")), ...altos.sort((a,b) => a.overall - b.overall || a.nombre.localeCompare(b.nombre,"es"))];
}

function cambiarParticipanteCalendario(estado, combate, indiceParticipante, nuevoId) {
  if (!combate || combate.resultadoRegistrado) throw new Error("No se puede cambiar un participante después de registrar el resultado.");
  const candidato = candidatosCambioCalendario(estado, combate, indiceParticipante).find(w => w.id === nuevoId);
  if (!candidato) throw new Error("El participante elegido no es válido para este combate.");
  const anteriorId = combate.participantes[indiceParticipante].id;
  combate.participantes[indiceParticipante].id = candidato.id;
  if (Array.isArray(combate.equipos)) {
    for (const equipo of combate.equipos) {
      const posicion = equipo.indexOf(anteriorId);
      if (posicion !== -1) { equipo[posicion] = candidato.id; break; }
    }
  }
  if (combate.ganadorId === anteriorId) combate.ganadorId = null;
}

function cambiarTipoCombateCalendario(estado, combate, nuevoTipo, calendario) {
  if (!TIPOS_COMBATE_CALENDARIO[nuevoTipo]) throw new Error("Tipo de combate no válido.");
  if (combate.resultadoRegistrado) throw new Error("No se puede cambiar un combate con resultado registrado.");

  const nuevoTotal = TIPOS_COMBATE_CALENDARIO[nuevoTipo].participantes;
  const cantidadProtagonistas = nuevoTipo === "2vs2" ? 2 : nuevoTipo === "3vs3" ? 3 : nuevoTipo === "2vs2vs2" ? 2 : 1;
  const cantidadOponentes = nuevoTotal - cantidadProtagonistas;
  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);

  const protagonistasActuales = combate.participantes.filter(p => p.rol === "protagonista");
  const oponentesActuales = combate.participantes.filter(p => p.rol !== "protagonista");
  const referencia = protagonistasActuales[0] ?? combate.participantes[0];
  const genero = referencia ? obtenerLuchadorParaHistorial(estado, referencia.id)?.genero : null;
  if (!referencia || !genero) throw new Error("Este combate no tiene un protagonista válido.");

  const cal = calendario || normalizarCalendario(estado);
  const usadosGlobales = new Set();
  for (const otro of [...(cal.miercoles ?? []), ...(cal.jueves ?? [])]) {
    if (otro.id === combate.id) continue;
    otro.participantes.forEach(p => usadosGlobales.add(p.id));
  }

  const protagonistas = protagonistasActuales.slice(0, cantidadProtagonistas).map(p => ({ id: p.id, rol: "protagonista" }));
  // Los oponentes se reconstruyen más abajo, por equipos, a partir de
  // `oponentesActuales` (no se recortan acá): un wrestler usado como
  // oponente nunca puede ser candidato a protagonista (no está en
  // Exposición), así que no hace falta reservarlo en `enCombate` todavía.
  const rivales = [];
  const enCombate = new Set(protagonistas.map(p => p.id));
  const apariciones = new Map();

  if (protagonistas.length < cantidadProtagonistas && ["2vs2", "3vs3", "2vs2vs2"].includes(nuevoTipo)) {
    // Tag/Stable real que contenga a los protagonistas que se conservan; si no
    // hay, equipo temporal (sin partir estructuras reales mientras se pueda).
    const equipo = completarEquipoProtagonistaCalendario(estado, exposicion, nuevoTipo, genero, protagonistas.map(p => p.id), cantidadProtagonistas, usadosGlobales, apariciones);
    if (!equipo) throw new Error("No hay suficientes protagonistas de Exposición del mismo género para ese tipo de combate.");
    equipo.filter(id => !enCombate.has(id)).forEach(id => {
      protagonistas.push({ id, rol: "protagonista" });
      enCombate.add(id);
    });
  }

  while (protagonistas.length < cantidadProtagonistas) {
    const candidato = elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, enCombate, apariciones);
    if (!candidato) throw new Error("No hay suficientes protagonistas de Exposición del mismo género para ese tipo de combate.");
    protagonistas.push({ id: candidato.id, rol: "protagonista" });
    enCombate.add(candidato.id);
  }

  // Lado oponentes: se reconstruye por EQUIPOS (no de a uno), intentando
  // mantener/respetar una estructura real (Tag/Stable) de los oponentes que
  // ya estaban en el combate cuando el nuevo tipo lo permite. Ej.: 2vs2 con
  // un Tag Team real → 3vs3 intenta extenderlo al Stable completo del Tag.
  const gruposOponentes = tamanosEquipoOponentesCalendario(nuevoTipo);
  const equiposOponentesResultado = [];

  if (gruposOponentes.length) {
    const idsOponentesActuales = oponentesActuales.map(p => p.id).filter(id => !enCombate.has(id));
    let indiceBase = 0;
    for (const tamanoEquipo of gruposOponentes) {
      const base = idsOponentesActuales.slice(indiceBase, indiceBase + tamanoEquipo);
      indiceBase += tamanoEquipo;
      const equipo = completarEquipoOponenteCalendario(estado, oponentes, tamanoEquipo, genero, base, usadosGlobales, apariciones, enCombate);
      if (!equipo) throw new Error("No hay suficientes oponentes del Roster que no estén en Exposición para ese tipo de combate.");
      equipo.forEach(id => { rivales.push({ id, rol: "oponente" }); enCombate.add(id); });
      equiposOponentesResultado.push(equipo);
    }
  } else {
    // Sin estructura de equipo (1vs1, Triple Threat, Fatal 4-Way): se
    // conservan los oponentes actuales (hasta la cantidad nueva) igual que
    // siempre, y se completa individualmente si faltan.
    oponentesActuales.slice(0, cantidadOponentes).forEach(p => {
      if (enCombate.has(p.id)) return;
      rivales.push({ id: p.id, rol: "oponente" });
      enCombate.add(p.id);
    });
    while (rivales.length < cantidadOponentes) {
      const op = elegirOponenteCalendario(oponentes, genero, usadosGlobales, enCombate, new Set(), apariciones);
      if (!op) throw new Error("No hay suficientes oponentes del Roster que no estén en Exposición para ese tipo de combate.");
      rivales.push({ id: op.id, rol: "oponente" });
      enCombate.add(op.id);
    }
  }

  combate.tipo = nuevoTipo;
  combate.participantes = [...protagonistas, ...rivales];
  combate.equipos = ["2vs2", "3vs3", "2vs2vs2"].includes(nuevoTipo)
    ? [protagonistas.map(p => p.id), ...equiposOponentesResultado]
    : null;
  combate.ganadorId = null;
}

// Selector 🎲 Aleatorio / 👨 Hombres / 👩 Mujeres por combate.
//  - "Aleatorio" (nuevoGenero null): solo limpia la marca; mantiene el
//    combate como está (el género ya fue decidido automáticamente en su
//    momento, con las reglas de siempre).
//  - "Hombre"/"Mujer": si el combate ya es de ese género, solo se guarda la
//    marca. Si no, se reconstruye el combate COMPLETO (protagonistas y
//    oponentes) para ese género, respetando prioridad, ancla, Tags/Stables y
//    las reglas de oponentes — el mismo motor que usa la generación normal.
function cambiarGeneroCombateCalendario(estado, combate, nuevoGenero, calendario) {
  if (!combate || combate.resultadoRegistrado) throw new Error("No se puede cambiar un combate con resultado registrado.");
  const generoValido = nuevoGenero === "Hombre" || nuevoGenero === "Mujer" ? nuevoGenero : null;

  if (!generoValido) {
    combate.generoForzado = null;
    return combate;
  }

  const generoActual = combate.participantes[0] ? obtenerLuchadorParaHistorial(estado, combate.participantes[0].id)?.genero : null;
  if (generoActual === generoValido) {
    combate.generoForzado = generoValido;
    return combate;
  }

  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);

  const cal = calendario || normalizarCalendario(estado);
  const usadosGlobales = new Set();
  for (const otro of [...(cal.miercoles ?? []), ...(cal.jueves ?? [])]) {
    if (otro.id === combate.id) continue;
    otro.participantes.forEach(p => usadosGlobales.add(p.id));
  }

  const resultado = construirParticipantesCalendario(exposicion, oponentes, combate.tipo, usadosGlobales, new Map(), estado, generoValido);
  if (!resultado) throw new Error(`No hay suficientes luchadores de género "${generoValido}" para armar este combate.`);

  combate.participantes = resultado.participantes;
  combate.equipos = resultado.equipos;
  combate.generoForzado = generoValido;
  combate.ganadorId = null;
  return combate;
}

// 🔄 Regenerar un combate individual. Reutiliza exactamente el mismo motor
// que ya usan la generación normal y "Cambiar tipo"/"Cambiar género"
// (construirParticipantesCalendario): respeta el tipo y el género ya
// elegidos para ESE combate, y por lo tanto prioridad, ancla, Tags/Stables
// de protagonistas y las reglas de oponentes (nada de esto se reimplementa
// acá). No toca ningún otro combate de la cartelera.
function regenerarCombateCalendario(estado, combate, calendario) {
  if (!combate) throw new Error("Combate no encontrado.");
  if (combate.resultadoRegistrado) throw new Error("No se puede regenerar un combate con resultado registrado.");
  if (combate.bloqueado) throw new Error("Este combate está bloqueado. Desbloqueálo para poder regenerarlo.");

  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);

  const cal = calendario || normalizarCalendario(estado);
  const usadosGlobales = new Set();
  for (const otro of [...(cal.miercoles ?? []), ...(cal.jueves ?? [])]) {
    if (otro.id === combate.id) continue;
    otro.participantes.forEach(p => usadosGlobales.add(p.id));
  }

  const resultado = construirParticipantesCalendario(exposicion, oponentes, combate.tipo, usadosGlobales, new Map(), estado, combate.generoForzado);
  if (!resultado) throw new Error("No hay suficientes luchadores válidos para regenerar este combate.");

  combate.participantes = resultado.participantes;
  combate.equipos = resultado.equipos;
  combate.ganadorId = null;
  return combate;
}

// 🔒/🔓 Bloquear o desbloquear un combate. No tiene reglas propias más allá
// de invertir la marca: son las funciones de regeneración las que respetan
// (o no) esa marca.
function alternarBloqueoCombateCalendario(combate) {
  if (!combate) throw new Error("Combate no encontrado.");
  combate.bloqueado = !combate.bloqueado;
  return combate;
}

// 🎲 Regenerar combates desbloqueados: recorre miércoles y jueves y
// regenera, de a uno (mismo motor que regenerarCombateCalendario), SOLO los
// combates que no estén bloqueados ni tengan resultado registrado. Los
// bloqueados quedan exactamente como estaban. Si un combate puntual no se
// puede regenerar (p. ej. no hay candidatos suficientes) se informa pero no
// se aborta el resto de la cartelera.
function regenerarCombatesDesbloqueadosCalendario(estado, calendario) {
  const cal = calendario || normalizarCalendario(estado);
  const combates = [...(cal.miercoles ?? []), ...(cal.jueves ?? [])];
  const resumen = { regenerados: 0, omitidos: 0, fallidos: [] };
  for (const combate of combates) {
    if (combate.bloqueado || combate.resultadoRegistrado) { resumen.omitidos++; continue; }
    try {
      regenerarCombateCalendario(estado, combate, cal);
      resumen.regenerados++;
    } catch (e) {
      resumen.fallidos.push({ id: combate.id, error: e.message });
    }
  }
  return resumen;
}

function registrarResultadoCalendario(estado, combate) {
  if (!combate || combate.resultadoRegistrado) throw new Error("Este combate ya fue registrado.");
  if (!combate.ganadorId || !combate.participantes.some(p => p.id === combate.ganadorId)) throw new Error("Elegí un ganador antes de registrar el resultado.");
  const calendario = normalizarCalendario(estado);
  const temporadaId = calendario.temporadaId || estado.config?.temporadaActualId;
  const temporada = obtenerTemporada(estado, temporadaId);
  if (!temporada) throw new Error("No existe la temporada del Calendario.");
  if (temporada.cerrada) throw new Error(`La temporada ${temporada.id} está cerrada.`);

  for (const participante of combate.participantes) {
    const luchadorId = participante.id;
    const registro = obtenerRegistro(temporada, luchadorId);
    const victoriasActuales = registro?.victoriasAcum ?? 0;
    const derrotasActuales = registro?.derrotasAcum ?? 0;
    actualizarAcumulados(estado, temporadaId, luchadorId, {
      victoriasAcum: victoriasActuales + (luchadorId === combate.ganadorId ? 1 : 0),
      derrotasAcum: derrotasActuales + (luchadorId === combate.ganadorId ? 0 : 1),
    });
  }
  combate.resultadoRegistrado = true;
  return combate;
}

function clasificarParticipacionCalendario(total) {
  if (total <= 10) return "Poca";
  if (total <= 30) return "Media";
  if (total <= 40) return "Alta";
  return "Mucha";
}

function clasificarTendenciaCalendario(r) {
  const balance = (r.victorias || 0) - (r.derrotas || 0);
  if (balance <= 0) return "🔴 Mala";
  if (balance === 1) return "🟠 Parejo";
  if (balance <= 10) return "🟡 Buena";
  if (balance < 30) return "🟢 Muy bueno";
  return "🔵 Excelente";
}
