function listarExposicion(estado) {
  return (estado.exposicion || []).map((e, indice) => ({ ...e, indice }));
}
function agregarExposicion(estado, luchadorId, temporadaId) {
  if (!luchadorId || !temporadaId) throw new Error("Elegí un luchador y una temporada.");
  if (!obtenerTemporada(estado, temporadaId)) throw new Error("La temporada no existe.");
  const existe = estado.exposicion.some(e => e.luchadorId === luchadorId && e.temporadaId === temporadaId);
  if (existe) throw new Error("Ese luchador ya está en Exposición para esa temporada.");
  estado.exposicion.push({ luchadorId, temporadaId });
}
function eliminarExposicion(estado, indice) { estado.exposicion.splice(indice, 1); }
function datosExposicion(estado, entrada) {
  const calc = calcularTemporadaLuchador(estado, entrada.temporadaId, entrada.luchadorId);
  const w = obtenerLuchadorParaHistorial(estado, entrada.luchadorId);
  return { ...entrada, nombre: w.nombre, show: w.shows, temporada: entrada.temporadaId, calc, balance: calc ? calc.deltas.victorias - calc.deltas.derrotas : null };
}
function resumenExposicion(estado, luchadorId) {
  const entradas = estado.exposicion.filter(e => e.luchadorId === luchadorId).map(e => datosExposicion(estado,e));
  const victorias = entradas.reduce((a,e)=>a+(e.calc?.deltas.victorias||0),0);
  const derrotas = entradas.reduce((a,e)=>a+(e.calc?.deltas.derrotas||0),0);
  return { entradas, victorias, derrotas, totalCombates: victorias+derrotas, balance: victorias-derrotas };
}
