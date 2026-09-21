const CLAVE_LOCALSTORAGE = "wweUniverseTracker.estado";
const VERSION_ESTADO = 2;

function slugify(texto) {
  return texto.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/['".]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function construirEstadoInicial() {
  const roster = SEED.roster.map((w) => ({
    id: slugify(w.nombre), nombre: w.nombre, genero: w.genero,
    shows: Array.isArray(w.shows) ? w.shows : [w.show || "NXT"],
    overallBase: w.overallBase, overallActual: w.overallActual,
    edadBase: w.edadBase, edadActual: w.edadActual,
  }));
  const idPorNombre = new Map(roster.map((w) => [w.nombre, w.id]));
  const temporadas = SEED.temporadas.map((t) => ({
    id: t.id, anterior: t.anterior, cerrada: !!t.cerrada,
    registros: t.registros.map((r) => ({
      luchadorId: r.luchadorId || idPorNombre.get(r.nombre) || null,
      nombreOriginal: r.nombreOriginal || r.nombre || null,
      victoriasAcum: r.victoriasAcum, derrotasAcum: r.derrotasAcum,
      titPrincipalesRAWSD_Acum: r.titPrincipalesRAWSD_Acum,
      titSecundariosRAWSD_Acum: r.titSecundariosRAWSD_Acum,
      titMaxNXT_Acum: r.titMaxNXT_Acum,
      titSecundariosNXT_Acum: r.titSecundariosNXT_Acum,
      overallFinal: r.overallFinal,
    })),
  }));
  return normalizarEstado({
    version: VERSION_ESTADO, roster, temporadas,
    titulosHistorial: SEED.titulosHistorial || [],
    campeonesActuales: (SEED.campeonesActuales || []).map((c) => ({ ...c, diasReinado: c.diasReinado ?? null })),
    comparacion2k26: SEED.comparacion2k26 || [],
    exposicion: [],
    config: { anioUniverso: 0, temporadaActualId: temporadas.at(-1)?.id || null },
  });
}

function normalizarEstado(estado) {
  estado = estado || {};
  estado.version = VERSION_ESTADO;
  estado.roster = Array.isArray(estado.roster) ? estado.roster : [];
  estado.roster.forEach((w) => { w.shows = Array.isArray(w.shows) ? w.shows : (w.show ? [w.show] : ["NXT"]); delete w.show; });
  estado.temporadas = Array.isArray(estado.temporadas) ? estado.temporadas : [];
  estado.temporadas.forEach((t) => {
    t.registros = Array.isArray(t.registros) ? t.registros : [];
    t.registros.forEach((r) => { if (!r.luchadorId && r.nombreOriginal) { const w = estado.roster.find((x) => x.nombre === r.nombreOriginal); if (w) r.luchadorId = w.id; } });
  });
  estado.titulosHistorial = Array.isArray(estado.titulosHistorial) ? estado.titulosHistorial : [];
  estado.campeonesActuales = Array.isArray(estado.campeonesActuales) ? estado.campeonesActuales : [];
  estado.campeonesActuales.forEach((c) => { if (c.diasReinado === undefined) c.diasReinado = null; });
  estado.comparacion2k26 = Array.isArray(estado.comparacion2k26) ? estado.comparacion2k26 : [];
  estado.exposicion = Array.isArray(estado.exposicion) ? estado.exposicion : [];
  if (typeof normalizarCalendario === "function") normalizarCalendario(estado);
  if (typeof normalizarEquipos === "function") normalizarEquipos(estado);
  estado.config = { anioUniverso: 0, temporadaActualId: estado.temporadas.at(-1)?.id || null, ...(estado.config || {}) };
  estado.temporadas.forEach(t => t.registros.forEach(r => { if (r.overallTemporalJuego === undefined) r.overallTemporalJuego = null; }));
  return estado;
}

function cargarEstado() {
  const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE);
  if (guardado) {
    try { return normalizarEstado(JSON.parse(guardado)); }
    catch (error) { console.error("No se pudo leer el estado guardado:", error); }
  }
  const inicial = construirEstadoInicial(); guardarEstado(inicial); return inicial;
}

function guardarEstado(estado) { localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(estado)); }

function exportarEstado(estado) {
  const blob = new Blob([JSON.stringify(estado, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const enlace = document.createElement("a");
  enlace.href = url; enlace.download = `wwe-universe-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(enlace); enlace.click(); enlace.remove(); URL.revokeObjectURL(url);
}

function importarEstado(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => { try { resolve(normalizarEstado(JSON.parse(lector.result))); } catch { reject(new Error("El archivo no es un backup válido de esta app.")); } };
    lector.onerror = () => reject(new Error("No se pudo leer el archivo.")); lector.readAsText(archivo);
  });
}
