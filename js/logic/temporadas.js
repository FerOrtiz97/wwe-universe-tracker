const PUNTOS_TITULO = { principalRAWSD: 15, maxNXT: 10, secundarioRAWSD: 8, secundarioNXT: 5 };
const OVERALL_MIN = 60, OVERALL_MAX = 99, CAMBIO_MAXIMO_POR_TEMPORADA = 10;

function obtenerTemporada(estado, id) { return estado.temporadas.find((t) => t.id === id); }
function obtenerRegistro(temporada, luchadorId) { return temporada?.registros.find((r) => r.luchadorId === luchadorId); }
function num(valor) { return valor ?? 0; }

function calcularDeltas(actual, anterior) {
  if (!actual) return null;
  anterior ||= { victoriasAcum: 0, derrotasAcum: 0, titPrincipalesRAWSD_Acum: 0, titSecundariosRAWSD_Acum: 0, titMaxNXT_Acum: 0, titSecundariosNXT_Acum: 0 };
  return {
    victorias: num(actual.victoriasAcum) - num(anterior.victoriasAcum),
    derrotas: num(actual.derrotasAcum) - num(anterior.derrotasAcum),
    titPrincipalesRAWSD: num(actual.titPrincipalesRAWSD_Acum) - num(anterior.titPrincipalesRAWSD_Acum),
    titSecundariosRAWSD: num(actual.titSecundariosRAWSD_Acum) - num(anterior.titSecundariosRAWSD_Acum),
    titMaxNXT: num(actual.titMaxNXT_Acum) - num(anterior.titMaxNXT_Acum),
    titSecundariosNXT: num(actual.titSecundariosNXT_Acum) - num(anterior.titSecundariosNXT_Acum),
  };
}

function calcularPuntos(d) {
  if (!d) return null;
  return (d.victorias - d.derrotas) + d.titPrincipalesRAWSD * 15 + d.titMaxNXT * 10 + d.titSecundariosRAWSD * 8 + d.titSecundariosNXT * 5;
}
function interpretarTemporada(p) {
  if (p == null) return null;
  if (p >= 60) return "🔥 Dominante";
  if (p >= 30) return "🟢 Excelente";
  if (p >= 10) return "🟢 Buena";
  if (p >= 0) return "⚪ Estable";
  if (p >= -9) return "🟡 Floja";
  if (p >= -29) return "🟠 Mala";
  return "🔴 Desastrosa";
}
function calcularObjetivoPorRango(p) {
  if (p >= 150) return 96 + Math.min(3, (p - 150) / 25);
  if (p >= 60) return 90 + ((p - 60) / 89) * 5;
  if (p >= 30) return 85 + ((p - 30) / 29) * 4;
  if (p >= 0) return 80 + (p / 29) * 4;
  if (p >= -29) return 75 + ((p + 29) / 28) * 4;
  if (p >= -59) return 70 + ((p + 59) / 29) * 4;
  return Math.max(60, 69 + (p + 60) / 10);
}
function calcularOverallSugerido(inicial, puntos) {
  if (inicial == null || puntos == null) return null;
  let delta = calcularObjetivoPorRango(puntos) - inicial;
  if (puntos > 0 && delta < 0) delta = Math.max(0, puntos / 10);
  if (puntos < 0 && delta > 0) delta = Math.min(0, puntos / 10);
  delta = Math.max(-10, Math.min(10, delta));
  return Math.round(Math.max(OVERALL_MIN, Math.min(OVERALL_MAX, inicial + delta)));
}

function obtenerLuchadorTemporada(estado, id) {
  return estado.roster.find((w) => w.id === id) || obtenerLuchadorParaHistorial(estado, id);
}
function calcularOverallInicial(estado, anteriorId, luchador) {
  if (anteriorId) {
    const r = obtenerRegistro(obtenerTemporada(estado, anteriorId), luchador.id);
    if (r?.overallFinal != null) return r.overallFinal;
  }
  return luchador.overallBase ?? luchador.overallActual ?? null;
}
function obtenerPuntosAcumulados(estado, temporadaId, luchadorId) {
  const resultado = calcularTemporadaLuchador(estado, temporadaId, luchadorId);
  return resultado?.puntosAcumulados ?? 0;
}
function titulosFuenteACalculada(estado, luchadorId, temporadaId) {
  const t = calcularTitulosAcumuladosDesdeHistorial(estado, luchadorId, temporadaId);
  return { titPrincipalesRAWSD_Acum:t.titPrincipalesRAWSD, titSecundariosRAWSD_Acum:t.titSecundariosRAWSD, titMaxNXT_Acum:t.titMaxNXT, titSecundariosNXT_Acum:t.titSecundariosNXT };
}
function calcularTemporadaLuchador(estado, temporadaId, luchadorId) {
  const temporada = obtenerTemporada(estado, temporadaId), luchador = obtenerLuchadorTemporada(estado, luchadorId);
  if (!temporada || !luchador) return null;
  const registro = obtenerRegistro(temporada, luchadorId);
  if (!registro) return null;
  const anterior = temporada.anterior ? obtenerRegistro(obtenerTemporada(estado, temporada.anterior), luchadorId) : null;
  const titulosFuente = typeof calcularTitulosAcumuladosDesdeHistorial === "function" ? calcularTitulosAcumuladosDesdeHistorial(estado, luchadorId, temporadaId) : null;
  const registroCalculado = titulosFuente ? { ...registro, titPrincipalesRAWSD_Acum: titulosFuente.titPrincipalesRAWSD, titSecundariosRAWSD_Acum: titulosFuente.titSecundariosRAWSD, titMaxNXT_Acum: titulosFuente.titMaxNXT, titSecundariosNXT_Acum: titulosFuente.titSecundariosNXT } : registro;
  const anteriorCalculado = anterior && titulosFuente ? { ...anterior, ...titulosFuenteACalculada(estado, luchadorId, temporada.anterior) } : anterior;
  const deltas = calcularDeltas(registroCalculado, anteriorCalculado), puntosTemporada = calcularPuntos(deltas);
  const puntosAcumulados = puntosTemporada + (temporada.anterior ? obtenerPuntosAcumulados(estado, temporada.anterior, luchadorId) : 0);
  const overallInicial = calcularOverallInicial(estado, temporada.anterior, luchador);
  return { temporadaId, luchadorId, deltas, puntosTemporada, puntosAcumulados, overallInicial, overallSugerido: calcularOverallSugerido(overallInicial, puntosTemporada), overallFinal: registro.overallFinal ?? null, interpretacion: interpretarTemporada(puntosTemporada) };
}
function historialLuchador(estado, id) { return estado.temporadas.map((t) => calcularTemporadaLuchador(estado, t.id, id)).filter(Boolean); }

function crearRegistroVacio(luchadorId, nombreOriginal = null) {
  return { luchadorId, nombreOriginal, victoriasAcum: null, derrotasAcum: null, titPrincipalesRAWSD_Acum: null, titSecundariosRAWSD_Acum: null, titMaxNXT_Acum: null, titSecundariosNXT_Acum: null, overallFinal: null, overallTemporalJuego: null };
}
function actualizarAcumulados(estado, temporadaId, luchadorId, campos) {
  const t = obtenerTemporada(estado, temporadaId); if (!t) throw new Error(`No existe la temporada ${temporadaId}`);
  if (t.cerrada) throw new Error(`La temporada ${temporadaId} está cerrada y no se puede editar.`);
  let r = obtenerRegistro(t, luchadorId); if (!r) { r = crearRegistroVacio(luchadorId, nombreLuchadorPorId(estado, luchadorId)); t.registros.push(r); }
  Object.assign(r, campos);
}
function establecerOverallFinal(estado, temporadaId, luchadorId, valor) {
  const t = obtenerTemporada(estado, temporadaId); if (!t) throw new Error(`No existe la temporada ${temporadaId}`);
  if (t.cerrada) throw new Error(`La temporada ${temporadaId} está cerrada y no se puede editar.`);
  let r = obtenerRegistro(t, luchadorId); if (!r) { r = crearRegistroVacio(luchadorId, nombreLuchadorPorId(estado, luchadorId)); t.registros.push(r); }
  r.overallFinal = valor;
}

function crearNuevaTemporada(estado, nuevoId, anteriorId) {
  nuevoId = String(nuevoId || "").trim(); if (!nuevoId) throw new Error("El nombre de la temporada es obligatorio.");
  if (obtenerTemporada(estado, nuevoId)) throw new Error(`Ya existe una temporada con id ${nuevoId}.`);
  if (anteriorId && !obtenerTemporada(estado, anteriorId)) throw new Error(`La temporada anterior (${anteriorId}) no existe.`);
  const nueva = { id: nuevoId, anterior: anteriorId || null, cerrada: false, registros: [] };
  estado.temporadas.push(nueva);
  if (typeof asegurarColumnaTemporadaEnTitulos === "function") asegurarColumnaTemporadaEnTitulos(estado, nuevoId);
  estado.config.temporadaActualId = nuevoId; return nueva;
}
function cerrarTemporada(estado, id) { const t = obtenerTemporada(estado, id); if (!t) throw new Error(`No existe la temporada ${id}`); if (!t.cerrada) { t.cerrada = true; estado.roster.forEach(w => { if (w.edadBase != null) w.edadActual = Number(w.edadBase) + estado.temporadas.filter(x => x.cerrada).length; }); estado.roster.forEach(w => { const r=obtenerRegistro(t,w.id); if(r?.overallFinal!=null) w.overallActual=r.overallFinal; }); estado.config.anioUniverso = estado.temporadas.filter(x => x.cerrada).length; } }
function reabrirTemporada(estado, id) { const t = obtenerTemporada(estado, id); if (!t) throw new Error(`No existe la temporada ${id}`); if (t.cerrada) { t.cerrada = false; estado.roster.forEach(w => { if (w.edadBase != null) w.edadActual = Number(w.edadBase) + estado.temporadas.filter(x => x.cerrada).length; }); estado.config.anioUniverso = estado.temporadas.filter(x => x.cerrada).length; } }
function temporadasPosteriores(estado, id) { return estado.temporadas.filter((t) => t.anterior === id || dependeDeTemporada(estado, t.id, id)); }
function dependeDeTemporada(estado, candidatoId, ancestroId, vistos = new Set()) {
  if (candidatoId === ancestroId) return false;
  if (vistos.has(candidatoId)) return false;
  vistos.add(candidatoId);
  const t = obtenerTemporada(estado, candidatoId); if (!t?.anterior) return false;
  return t.anterior === ancestroId || dependeDeTemporada(estado, t.anterior, ancestroId, vistos);
}
function resetearTemporada(estado, id) {
  const t = obtenerTemporada(estado, id); if (!t) throw new Error(`No existe la temporada ${id}`);
  t.registros = []; t.cerrada = false; estado.config.temporadaActualId = id;
}
function eliminarTemporada(estado, id) {
  const indice = estado.temporadas.findIndex((t) => t.id === id); if (indice < 0) throw new Error(`No existe la temporada ${id}`);
  const posteriores = temporadasPosteriores(estado, id); if (posteriores.length) throw new Error("No se puede eliminar mientras existan temporadas posteriores dependientes.");
  estado.temporadas.splice(indice, 1);
  estado.config.temporadaActualId = estado.temporadas.at(-1)?.id || null;
}
function editarTemporada(estado, id, cambios) {
  const t = obtenerTemporada(estado, id); if (!t) throw new Error(`No existe la temporada ${id}`);
  if (cambios.id && cambios.id !== id && obtenerTemporada(estado, cambios.id)) throw new Error(`Ya existe la temporada ${cambios.id}.`);
  if (cambios.id && cambios.id !== id) {
    const nuevoId = cambios.id;
    estado.temporadas.forEach((x) => { if (x.anterior === id) x.anterior = nuevoId; });
    if (estado.config.temporadaActualId === id) estado.config.temporadaActualId = nuevoId;
    t.id = nuevoId;
    estado.temporadas.forEach((x) => { if (x.registros) x.registros.forEach(() => {}); });
  }
  if (cambios.anterior !== undefined) {
    if (cambios.anterior && cambios.anterior === t.id) throw new Error("Una temporada no puede depender de sí misma.");
    if (cambios.anterior && !obtenerTemporada(estado, cambios.anterior)) throw new Error("La temporada anterior no existe.");
    if (cambios.anterior && dependeDeTemporada(estado, cambios.anterior, t.id)) throw new Error("Ese vínculo generaría una dependencia circular.");
    t.anterior = cambios.anterior || null;
  }
  return t;
}
