// Reglas del módulo Calendario.
// El Calendario propone combates: Exposición aporta los protagonistas y el
// Roster general aporta preferentemente los oponentes de Overall <=75.

const TIPOS_COMBATE_CALENDARIO = {
  "1vs1": { label: "1 vs 1", participantes: 2 },
  "2vs2": { label: "2 vs 2", participantes: 4 },
  "triple": { label: "Triple Threat Match", participantes: 3 },
  "fatal4": { label: "Fatal 4-Way", participantes: 4 },
  "sixTag": { label: "Six Tag Team Match", participantes: 6 },
};

function normalizarCalendario(estado) {
  estado.calendario = estado.calendario && typeof estado.calendario === "object" ? estado.calendario : {};
  estado.calendario.temporadaId ??= estado.config?.temporadaActualId ?? null;
  estado.calendario.miercoles = Array.isArray(estado.calendario.miercoles) ? estado.calendario.miercoles : [];
  estado.calendario.jueves = Array.isArray(estado.calendario.jueves) ? estado.calendario.jueves : [];
  estado.calendario.miercoles.forEach(normalizarCombateCalendario);
  estado.calendario.jueves.forEach(normalizarCombateCalendario);
  return estado.calendario;
}

function normalizarCombateCalendario(combate) {
  combate.id ??= `combate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  combate.tipo ??= "1vs1";
  const anteriores = Array.isArray(combate.participantes) ? combate.participantes : [];
  combate.participantes = anteriores.map((p, indice) => {
    if (typeof p === "string") return { id: p, rol: indice === 0 ? "protagonista" : "oponente" };
    return { id: p.id, rol: p.rol === "protagonista" ? "protagonista" : "oponente" };
  }).filter(p => p.id);
  combate.ganadorId ??= null;
  combate.resultadoRegistrado = !!combate.resultadoRegistrado;
  return combate;
}

function datosParticipantesCalendario(estado) {
  const mapa = new Map();
  for (const entrada of listarExposicion(estado)) {
    const d = datosExposicion(estado, entrada);
    if (!d || mapa.has(d.luchadorId)) continue;
    const w = obtenerLuchadorParaHistorial(estado, d.luchadorId);
    const resumen = resumenExposicion(estado, d.luchadorId);
    const total = resumen.totalCombates;
    const participacion = clasificarParticipacionCalendario(total);
    const balance = resumen.balance;
    const prioridad = balance < 0 ? 1 : participacion === "Poca" ? 2 : participacion === "Media" ? 3 : 4;
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
      prioridad,
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
      esExposicion: idsExposicion.has(w.id),
      apariciones: 0,
    }));
}

function aleatorio(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

function elegirConPrioridad(lista, usados = new Set(), opciones = {}) {
  const { excluirIds = new Set(), preferirBajoOverall = false } = opciones;
  let candidatos = lista.filter(w => !usados.has(w.id) && !excluirIds.has(w.id));
  if (!candidatos.length) return null;

  const minimoPrioridad = Math.min(...candidatos.map(w => w.prioridad));
  let grupo = candidatos.filter(w => w.prioridad === minimoPrioridad);
  if (preferirBajoOverall) {
    const bajos = grupo.filter(w => w.overall <= 75);
    if (bajos.length) grupo = bajos;
  }
  const minApariciones = Math.min(...grupo.map(w => w.apariciones));
  grupo = grupo.filter(w => w.apariciones === minApariciones);
  return aleatorio(grupo);
}

function elegirProtagonistaCalendario(exposicion, genero, usadosGlobales = new Set(), excluirIds = new Set()) {
  const base = exposicion.filter(w => w.genero === genero && !excluirIds.has(w.id));
  if (!base.length) return null;

  // Primero intentamos un luchador que todavía no apareció en la cartelera.
  // Si no queda ninguno, se permite repetir para poder completar el combate.
  const noUsados = base.filter(w => !usadosGlobales.has(w.id));
  const candidatos = noUsados.length ? noUsados : base;
  return elegirConPrioridad(candidatos, new Set(), { excluirIds });
}

function elegirGeneroParaCombateCalendario(exposicion, oponentes, usadosGlobales, tipo) {
  const cantidadOponentes = TIPOS_COMBATE_CALENDARIO[tipo].participantes - 1;
  const opciones = ["Hombre", "Mujer"].filter(g => {
    const prot = exposicion.some(w => w.genero === g && !usadosGlobales.has(w.id));
    const disponibles = oponentes.filter(w => w.genero === g).length;
    return prot && disponibles >= Math.min(cantidadOponentes, Math.max(1, oponentes.filter(x => x.genero === g).length));
  });
  if (opciones.length === 1) return opciones[0];
  if (opciones.length === 2) {
    const mejorH = Math.min(...exposicion.filter(w => w.genero === "Hombre").map(w => w.prioridad));
    const mejorM = Math.min(...exposicion.filter(w => w.genero === "Mujer").map(w => w.prioridad));
    if (mejorH < mejorM) return "Hombre";
    if (mejorM < mejorH) return "Mujer";
    return Math.random() < 0.5 ? "Hombre" : "Mujer";
  }
  return null;
}

function elegirOponenteCalendario(oponentes, genero, usadosGlobales = new Set(), usadosLocal = new Set(), excluirIds = new Set()) {
  const base = oponentes.filter(w => w.genero === genero && !usadosLocal.has(w.id) && !excluirIds.has(w.id));
  if (!base.length) return null;

  // Igual que con los protagonistas: primero intentamos uno que todavía no
  // haya aparecido en Miércoles/Jueves. Si no queda ninguno, permitimos repetir.
  const noUsados = base.filter(w => !usadosGlobales.has(w.id));
  const candidatos = noUsados.length ? noUsados : base;

  // Dentro del grupo disponible, se mantiene la preferencia por Overall <=75.
  const bajos = candidatos.filter(w => w.overall <= 75);
  const grupo = bajos.length ? bajos : candidatos;
  const minApariciones = Math.min(...grupo.map(w => w.apariciones));
  return aleatorio(grupo.filter(w => w.apariciones === minApariciones));
}

function tiposViablesCalendario(exposicion, oponentes, tipo, generoPreferido = null) {
  const nOponentes = TIPOS_COMBATE_CALENDARIO[tipo].participantes - 1;
  return ["Hombre", "Mujer"].filter(g => {
    if (generoPreferido && g !== generoPreferido) return false;
    return exposicion.some(w => w.genero === g) && oponentes.filter(w => w.genero === g).length >= Math.min(nOponentes, oponentes.filter(w => w.genero === g).length);
  });
}

function construirParticipantesCalendario(exposicion, oponentes, tipo, usadosGlobales = new Set(), aparicionesGlobales = new Map()) {
  const cantidad = TIPOS_COMBATE_CALENDARIO[tipo]?.participantes ?? 2;
  if (cantidad < 2) return null;

  const esEquipos = tipo === "2vs2" || tipo === "sixTag";
  const cantidadProtagonistas = esEquipos ? cantidad / 2 : 1;
  const cantidadOponentes = cantidad - cantidadProtagonistas;

  // Elegimos género entre los que puedan completar el combate. La presencia
  // de luchadores ya usados NO invalida un género: si hace falta, se repetirá.
  const generosDisponibles = ["Hombre", "Mujer"].filter(g => {
    const prot = exposicion.filter(w => w.genero === g).length >= cantidadProtagonistas;
    const opp = oponentes.filter(w => w.genero === g).length >= cantidadOponentes;
    return prot && opp;
  });
  if (!generosDisponibles.length) return null;

  const mejorPorGenero = generosDisponibles.map(g => {
    const c = exposicion.filter(w => w.genero === g);
    const noUsados = c.filter(w => !usadosGlobales.has(w.id));
    const oponentesNuevos = oponentes.filter(w => w.genero === g && !usadosGlobales.has(w.id)).length;
    // Repeticiones que obligaría este género para completar el combate: cuántos
    // protagonistas u oponentes faltan de los que todavía no aparecieron.
    const repeticiones = Math.max(0, cantidadProtagonistas - noUsados.length)
      + Math.max(0, cantidadOponentes - oponentesNuevos);
    // La prioridad se mide entre los protagonistas que todavía no aparecieron;
    // solo si no queda ninguno se mide sobre todos (habrá que repetir).
    const base = noUsados.length ? noUsados : c;
    return {
      genero: g,
      prioridad: Math.min(...base.map(w => w.prioridad)),
      hayNuevos: noUsados.length > 0,
      repeticiones,
    };
  });

  // 1) Se evita repetir: gana el género que pueda completar el combate con la
  //    menor cantidad de repeticiones (normalmente 0). Así, si las oponentes de un
  //    género se agotan, el combate pasa al otro género en vez de repetir.
  // 2) Entre esos, se prefiere un género con protagonistas sin usar.
  // 3) Después manda la mejor prioridad (P1 → P2 → P3 → P4); empate al azar.
  const menorRepeticion = Math.min(...mejorPorGenero.map(x => x.repeticiones));
  const sinRepetir = mejorPorGenero.filter(x => x.repeticiones === menorRepeticion);
  const conNuevos = sinRepetir.filter(x => x.hayNuevos);
  const candidatosGenero = conNuevos.length ? conNuevos : sinRepetir;
  const mejorPrioridad = Math.min(...candidatosGenero.map(x => x.prioridad));
  const empate = candidatosGenero.filter(x => x.prioridad === mejorPrioridad);
  const genero = aleatorio(empate).genero;

  const participantes = [];
  const usadosLocal = new Set();

  for (let i = 0; i < cantidadProtagonistas; i++) {
    const protagonista = elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, usadosLocal);
    if (!protagonista) return null;
    participantes.push({ id: protagonista.id, rol: "protagonista" });
    usadosLocal.add(protagonista.id);
  }

  for (let i = 0; i < cantidadOponentes; i++) {
    const oponente = elegirOponenteCalendario(oponentes, genero, usadosGlobales, usadosLocal);
    if (!oponente) return null;
    participantes.push({ id: oponente.id, rol: "oponente" });
    usadosLocal.add(oponente.id);
  }

  participantes.forEach(p => {
    const actual = aparicionesGlobales.get(p.id) || 0;
    aparicionesGlobales.set(p.id, actual + 1);
  });
  return participantes;
}

function generarCarteleraCalendario(estado, cantidad = 9, aparicionesGlobales = new Map()) {
  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);
  if (!exposicion.length) throw new Error("No hay luchadores seleccionados en Exposición para generar el Calendario.");
  if (!oponentes.length) throw new Error("No hay luchadores disponibles en el Roster para utilizar como oponentes.");

  const tipos = Object.keys(TIPOS_COMBATE_CALENDARIO);
  // El Map compartido entre Miércoles y Jueves funciona como registro global
  // de apariciones. Así, Jueves también evita repetir lo usado el Miércoles.
  const usadosGlobales = new Set(aparicionesGlobales.keys());
  const combates = [];

  for (let i = 0; i < cantidad; i++) {
    const tiposOrdenados = tipos.slice().sort(() => Math.random() - 0.5);
    let tipo = tiposOrdenados.find(t => {
      const n = TIPOS_COMBATE_CALENDARIO[t].participantes;
      return ["Hombre", "Mujer"].some(g => exposicion.some(w => w.genero === g) && oponentes.filter(w => w.genero === g).length >= n - 1);
    });
    tipo ||= "1vs1";

    // La selección intenta evitar usados, pero cada participante tiene un
    // fallback independiente: si no quedan candidatos nuevos, se repite.
    const participantes = construirParticipantesCalendario(exposicion, oponentes, tipo, usadosGlobales, aparicionesGlobales);
    if (!participantes) throw new Error("No hay suficientes luchadores del mismo género para completar las carteleras.");

    participantes.forEach(p => usadosGlobales.add(p.id));
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
    return exposicion.sort((a, b) => a.prioridad - b.prioridad || a.nombre.localeCompare(b.nombre, "es"));
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
  if (combate.ganadorId === anteriorId) combate.ganadorId = null;
}

function cambiarTipoCombateCalendario(estado, combate, nuevoTipo, calendario) {
  if (!TIPOS_COMBATE_CALENDARIO[nuevoTipo]) throw new Error("Tipo de combate no válido.");
  if (combate.resultadoRegistrado) throw new Error("No se puede cambiar un combate con resultado registrado.");

  const nuevoTotal = TIPOS_COMBATE_CALENDARIO[nuevoTipo].participantes;
  const esEquipos = nuevoTipo === "2vs2" || nuevoTipo === "sixTag";
  const cantidadProtagonistas = esEquipos ? nuevoTotal / 2 : 1;
  const cantidadOponentes = nuevoTotal - cantidadProtagonistas;
  const exposicion = datosParticipantesCalendario(estado);
  const idsExposicion = new Set(exposicion.map(w => w.id));
  const oponentes = datosRosterOponentesCalendario(estado, idsExposicion);

  // Cambiar el tipo ADAPTA el combate: se conservan los participantes actuales
  // (en su orden) y solo se agregan o quitan los necesarios para el nuevo formato.
  const protagonistasActuales = combate.participantes.filter(p => p.rol === "protagonista");
  const oponentesActuales = combate.participantes.filter(p => p.rol !== "protagonista");

  const referencia = protagonistasActuales[0] ?? combate.participantes[0];
  const genero = referencia ? obtenerLuchadorParaHistorial(estado, referencia.id)?.genero : null;
  if (!referencia || !genero) throw new Error("Este combate no tiene un protagonista válido.");

  // Luchadores que ya aparecen en el resto del calendario: los nuevos los evitan
  // mientras existan alternativas (igual que el generador automático).
  const cal = calendario || normalizarCalendario(estado);
  const usadosGlobales = new Set();
  for (const otro of [...(cal.miercoles ?? []), ...(cal.jueves ?? [])]) {
    if (otro.id === combate.id) continue;
    otro.participantes.forEach(p => usadosGlobales.add(p.id));
  }

  // Si sobran participantes se descartan los últimos de cada rol.
  const protagonistas = protagonistasActuales.slice(0, cantidadProtagonistas).map(p => ({ id: p.id, rol: "protagonista" }));
  const rivales = oponentesActuales.slice(0, cantidadOponentes).map(p => ({ id: p.id, rol: "oponente" }));
  const enCombate = new Set([...protagonistas, ...rivales].map(p => p.id));

  // Protagonistas nuevos (Equipo A): SOLO de Exposición, por prioridad.
  while (protagonistas.length < cantidadProtagonistas) {
    const candidato = elegirProtagonistaCalendario(exposicion, genero, usadosGlobales, enCombate);
    if (!candidato) throw new Error("No hay suficientes protagonistas de Exposición del mismo género para ese tipo de combate.");
    protagonistas.push({ id: candidato.id, rol: "protagonista" });
    enCombate.add(candidato.id);
  }

  // Oponentes nuevos (Equipo B / rivales): Roster general fuera de Exposición.
  while (rivales.length < cantidadOponentes) {
    const op = elegirOponenteCalendario(oponentes, genero, usadosGlobales, enCombate);
    if (!op) throw new Error("No hay suficientes oponentes del Roster que no estén en Exposición para ese tipo de combate.");
    rivales.push({ id: op.id, rol: "oponente" });
    enCombate.add(op.id);
  }

  // El combate solo se modifica si todo el armado anterior salió bien.
  combate.tipo = nuevoTipo;
  combate.participantes = [...protagonistas, ...rivales];
  combate.ganadorId = null;
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
