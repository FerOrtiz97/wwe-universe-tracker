// Reglas y consultas de títulos. El historial de títulos del Universo es
// la fuente de verdad para los conteos de campeonatos por temporada.

function listarCampeonatos(estado) { return estado.titulosHistorial.map((c) => c.campeonato); }

function historialDeCampeonato(estado, nombre) {
  const campeonato = estado.titulosHistorial.find((c) => c.campeonato === nombre);
  if (!campeonato) return null;
  const historial = (campeonato.historial || []).map((fila) => {
    const columnas = Object.keys(fila).filter((k) => /^wm/i.test(k));
    return { ...fila, totalUniverso: columnas.reduce((a, k) => a + Number(fila[k] || 0), 0) };
  });
  return { campeonato: campeonato.campeonato, historial };
}

function campeonesActuales(estado, show = null) {
  if (!show) return estado.campeonesActuales;
  return estado.campeonesActuales.filter((c) => c.show === show || String(c.show).includes(show));
}

function registrarNuevoCampeon(estado, nombreCampeonato, nuevoCampeon, diasReinado = null) {
  const entrada = estado.campeonesActuales.find((c) => c.campeonato === nombreCampeonato);
  if (!entrada) throw new Error(`No se encontró el campeonato "${nombreCampeonato}"`);
  entrada.campeonActual = nuevoCampeon; entrada.diasReinado = diasReinado;
}

function agregarTitulo(estado, datos) {
  const nombre = String(datos.campeonato || "").trim();
  if (!nombre) throw new Error("El nombre del campeonato es obligatorio.");
  if (estado.titulosHistorial.some((t) => t.campeonato === nombre)) throw new Error("Ya existe un campeonato con ese nombre.");
  const titulo = { campeonato: nombre, historial: [] };
  estado.titulosHistorial.push(titulo);
  return titulo;
}

function editarTitulo(estado, original, nombreNuevo) {
  const titulo = estado.titulosHistorial.find((t) => t.campeonato === original);
  if (!titulo) throw new Error("No se encontró el campeonato.");
  const nombre = String(nombreNuevo || "").trim();
  if (!nombre) throw new Error("El nombre es obligatorio.");
  if (nombre !== original && estado.titulosHistorial.some((t) => t.campeonato === nombre)) throw new Error("Ya existe un campeonato con ese nombre.");
  titulo.campeonato = nombre;
  estado.campeonesActuales.filter((c) => c.campeonato === original).forEach((c) => { c.campeonato = nombre; });
  return titulo;
}

function eliminarTitulo(estado, nombre) {
  const i = estado.titulosHistorial.findIndex((t) => t.campeonato === nombre);
  if (i < 0) throw new Error("No se encontró el campeonato.");
  estado.titulosHistorial.splice(i, 1);
  estado.campeonesActuales = estado.campeonesActuales.filter((c) => c.campeonato !== nombre);
}

function agregarCampeonActual(estado, datos) {
  const nombre = String(datos.campeonato || "").trim();
  if (!nombre) throw new Error("El campeonato es obligatorio.");
  estado.campeonesActuales.push({ show: datos.show || "🔴 RAW", campeonato: nombre, campeonActual: datos.campeonActual || "", diasReinado: datos.diasReinado ?? null });
}
function editarCampeonActual(estado, indice, cambios) {
  const c = estado.campeonesActuales[indice]; if (!c) throw new Error("No se encontró el registro."); Object.assign(c, cambios); return c;
}
function eliminarCampeonActual(estado, indice) { if (!estado.campeonesActuales[indice]) throw new Error("No se encontró el registro."); estado.campeonesActuales.splice(indice, 1); }

function claveNombreTitulo(nombre) {
  return String(nombre || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\bdlc\b/g, "").replace(/[^a-z0-9]+/g, "").trim();
}

function categoriaCampeonato(campeonato) {
  const n = claveNombreTitulo(campeonato);
  if (n.includes("norteamerica") && n.includes("femenino")) return "titSecundariosNXT";
  if (n.includes("norteamerica")) return "titSecundariosNXT";
  if (n.includes("campeonatodenxt") && !n.includes("norteamerica") && !n.includes("femenino")) return "titMaxNXT";
  if (n.includes("campeonatofemeninodenxt") && !n.includes("norteamerica")) return "titMaxNXT";
  if (n.includes("parejasdenxt")) return "titSecundariosNXT";
  if (n.includes("intercontinental") || n.includes("estadosunidos") || n.includes("womensunitedstates")) return "titSecundariosRAWSD";
  if (n.includes("parejas") || n.includes("tagteam")) return "titSecundariosRAWSD";
  if (n.includes("mundialfemenino") || n.includes("campeonatofemeninodelawwe") || n.includes("undisputed") || n.includes("mundialdelospesos")) return "titPrincipalesRAWSD";
  if (n.includes("campeonatofemeninodenxt")) return "titMaxNXT";
  return null;
}

function temporadaCadena(estado, temporadaId) {
  const salida = [];
  let actual = obtenerTemporada(estado, temporadaId);
  const vistos = new Set();
  while (actual && !vistos.has(actual.id)) {
    salida.unshift(actual.id); vistos.add(actual.id);
    actual = actual.anterior ? obtenerTemporada(estado, actual.anterior) : null;
  }
  return salida;
}

function obtenerValorColumnaTemporada(fila, temporadaId) {
  const clave = String(temporadaId).toLowerCase();
  const encontrada = Object.keys(fila || {}).find(k => k.toLowerCase() === clave);
  return encontrada ? Number(fila[encontrada] || 0) : 0;
}

function calcularTitulosAcumuladosDesdeHistorial(estado, luchadorId, temporadaId) {
  const luchador = obtenerLuchadorParaHistorial(estado, luchadorId);
  const nombre = claveNombreTitulo(luchador?.nombre);
  const resultado = { titPrincipalesRAWSD: 0, titSecundariosRAWSD: 0, titMaxNXT: 0, titSecundariosNXT: 0 };
  if (!nombre) return resultado;
  for (const campeonato of estado.titulosHistorial || []) {
    const categoria = categoriaCampeonato(campeonato.campeonato);
    if (!categoria) continue;
    for (const temporadaIdCadena of temporadaCadena(estado, temporadaId)) {
      for (const fila of campeonato.historial || []) {
        if (claveNombreTitulo(fila.nombre) === nombre) resultado[categoria] += obtenerValorColumnaTemporada(fila, temporadaIdCadena);
      }
    }
  }
  return resultado;
}

function asegurarColumnaTemporadaEnTitulos(estado, temporadaId) {
  const clave = String(temporadaId).toLowerCase();
  for (const titulo of estado.titulosHistorial || []) {
    for (const fila of titulo.historial || []) {
      const existente = Object.keys(fila).find(k => k.toLowerCase() === clave);
      if (!existente) fila[String(temporadaId).toLowerCase()] = null;
    }
  }
}
