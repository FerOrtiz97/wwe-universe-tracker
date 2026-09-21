let calendarioCambioActivo = null;

function usosParticipanteCalendario(estado, luchadorId, combateActualId, indiceActual) {
  const calendario = normalizarCalendario(estado);
  const usos = [];
  for (const dia of ["miercoles", "jueves"]) {
    calendario[dia].forEach((combate, indiceCombate) => {
      combate.participantes.forEach((p, indiceParticipante) => {
        if (p.id !== luchadorId) return;
        if (combate.id === combateActualId && indiceParticipante === indiceActual) return;
        const equipo = (combate.tipo === "2vs2" || combate.tipo === "sixTag")
          ? ` (${indiceParticipante < combate.participantes.length / 2 ? "Equipo A" : "Equipo B"})`
          : "";
        usos.push(`${dia === "miercoles" ? "Miércoles" : "Jueves"} — Combate ${indiceCombate + 1}${equipo}`);
      });
    });
  }
  return usos;
}

function renderCalendario(estado, contenedor, guardarYRefrescar) {
  const calendario = normalizarCalendario(estado);
  const participantes = datosParticipantesCalendario(estado);
  const temporada = obtenerTemporada(estado, calendario.temporadaId);
  const nombreTemporada = temporada?.id || "Sin temporada";

  const opcionesTipo = Object.entries(TIPOS_COMBATE_CALENDARIO)
    .map(([id, tipo]) => `<option value="${id}">${tipo.label}</option>`).join("");

  const renderParticipante = (combate, participante, indice) => {
    const w = obtenerLuchadorParaHistorial(estado, participante.id);
    const cambioAbierto = calendarioCambioActivo?.combateId === combate.id && calendarioCambioActivo?.indice === indice;
    if (!cambioAbierto) {
      // Duplicados: nunca se bloquean, solo se avisa dónde más aparece el luchador.
      const usos = combate.resultadoRegistrado ? [] : usosParticipanteCalendario(estado, participante.id, combate.id, indice);
      const aviso = usos.length ? `<small class="cal-aviso">⚠️ ${esc(w.nombre)} ya aparece en ${esc(usos.join(", "))}.</small>` : "";
      return `<span class="cal-participante ${usos.length ? "cal-repetido" : ""}">
        <span>${esc(w.nombre)}</span>
        <button type="button" class="accion cal-cambiar" data-cal-cambiar="${combate.id}|${indice}" ${combate.resultadoRegistrado ? "disabled" : ""}>Cambiar</button>
        ${aviso}
      </span>`;
    }

    const candidatos = candidatosCambioCalendario(estado, combate, indice);
    const opciones = candidatos.map(c => {
      const detalle = participante.rol === "protagonista"
        ? `P${c.prioridad} · ${c.balance >= 0 ? "+" : ""}${c.balance} · ${c.participacion}`
        : `Overall ${c.overall}`;
      return `<option value="${c.id}">${esc(c.nombre)} — ${esc(detalle)}</option>`;
    }).join("");
    return `<span class="cal-participante cal-cambio">
      <select data-cal-candidato="${combate.id}|${indice}">
        <option value="">Elegir reemplazo...</option>${opciones}
      </select>
      <button type="button" class="accion" data-cal-aplicar-cambio="${combate.id}|${indice}">Aplicar</button>
      <button type="button" class="accion" data-cal-cancelar-cambio="${combate.id}|${indice}">Cancelar</button>
    </span>`;
  };

  const renderCombate = (combate, indice, dia) => {
    const info = TIPOS_COMBATE_CALENDARIO[combate.tipo] || TIPOS_COMBATE_CALENDARIO["1vs1"];
    const participantesCombate = combate.participantes.map((p, i) => ({ p, i, w: obtenerLuchadorParaHistorial(estado, p.id) }));
    const ganador = combate.ganadorId;
    const registrado = combate.resultadoRegistrado;
    const selectGanador = `<select data-cal-ganador="${combate.id}" ${registrado ? "disabled" : ""}>
      <option value="">Elegir ganador...</option>
      ${participantesCombate.map(({p,w}) => `<option value="${w.id}" ${ganador === w.id ? "selected" : ""}>${esc(w.nombre)}</option>`).join("")}
    </select>`;

    let participantesHtml = "";
    if (combate.tipo === "2vs2" || combate.tipo === "sixTag") {
      const mitad = Math.ceil(participantesCombate.length / 2);
      const a = participantesCombate.slice(0, mitad).map(({p,i}) => renderParticipante(combate, p, i)).join(" / ");
      const b = participantesCombate.slice(mitad).map(({p,i}) => renderParticipante(combate, p, i)).join(" / ");
      participantesHtml = `<div class="cal-equipos"><strong>Equipo A:</strong> ${a}<br><strong>Equipo B:</strong> ${b}</div>`;
    } else {
      participantesHtml = `<div class="cal-participantes">${participantesCombate.map(({p,i}) => renderParticipante(combate,p,i)).join(" <b>vs</b> ")}</div>`;
    }

    return `<article class="cal-combate ${registrado ? "cal-registrado" : ""}">
      <div class="cal-combate-cabecera"><strong>Combate ${indice + 1}</strong><span>${registrado ? "✅ Resultado registrado" : "Pendiente"}</span></div>
      <div class="cal-combate-controles">
        <label>Tipo<select data-cal-tipo="${dia}|${combate.id}" ${registrado ? "disabled" : ""}>${opcionesTipo.replace(`value="${combate.tipo}"`, `value="${combate.tipo}" selected`)}</select></label>
      </div>
      ${participantesHtml}
      <div class="cal-ganador"><label>Ganador ${selectGanador}</label>${registrado ? "" : `<button class="accion" data-cal-registrar="${dia}|${combate.id}">🏆 Registrar resultado</button>`}</div>
    </article>`;
  };

  const renderDia = (dia, titulo, combates) => `<div class="panel cal-dia"><div class="panel-header"><h3>${titulo}</h3><span class="texto-tenue">9 combates</span></div>${combates.map((c, i) => renderCombate(c, i, dia)).join("")}</div>`;

  contenedor.innerHTML = `<h2>📅 Calendario</h2>
    <p class="texto-tenue">El Calendario propone: Exposición aporta los protagonistas y el Roster general aporta preferentemente los oponentes de Overall ≤75. Vos decidís si el combate tiene sentido.</p>
    <div class="panel">
      <div class="panel-header"><h3>Generador</h3><span>Temporada: <strong>${esc(nombreTemporada)}</strong></span></div>
      <div class="cal-resumen">
        <div><strong>${participantes.length}</strong><span>protagonistas de Exposición</span></div>
        <div><strong>${participantes.filter(w => w.prioridad === 1).length}</strong><span>🔴 balance negativo</span></div>
        <div><strong>${participantes.filter(w => w.prioridad === 2).length}</strong><span>🟠 participación poca</span></div>
        <div><strong>${participantes.filter(w => w.prioridad === 3).length}</strong><span>🟡 participación media</span></div>
      </div>
      <button class="accion" id="cal-generar">🎲 Generar 18 combates</button>
      <span class="texto-tenue cal-ayuda">Generar de nuevo reemplaza las dos carteleras actuales que todavía no tengan resultados registrados.</span>
    </div>
    <div class="panel"><div class="panel-header"><h3>Protagonistas de Exposición</h3><span class="texto-tenue">Los oponentes salen del Roster general</span></div>
      <div class="tabla-scroll"><table><thead><tr><th>Luchador</th><th>Show actual</th><th>Género</th><th>Overall</th><th>Balance</th><th>Participación</th><th>V/D</th><th>Total combates</th><th>Racha/Tendencia</th><th>Prioridad</th></tr></thead><tbody>
      ${participantes.slice().sort((a,b)=>a.prioridad-b.prioridad || a.nombre.localeCompare(b.nombre,"es")).map(w=>`<tr><td>${esc(w.nombre)}</td><td>${chipsShows(w.shows)}</td><td>${esc(w.genero)}</td><td>${w.overall || "—"}</td><td>${w.balance}</td><td>${w.participacion}</td><td>${w.victorias} / ${w.derrotas}</td><td>${w.totalCombates}</td><td>${w.tendencia}</td><td>${etiquetaPrioridad(w.prioridad)}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
    ${renderDia("miercoles", "📺 Miércoles", calendario.miercoles)}
    ${renderDia("jueves", "📺 Jueves", calendario.jueves)}
  `;

  contenedor.querySelector("#cal-generar").onclick = () => {
    const hayResultados = [...calendario.miercoles, ...calendario.jueves].some(c => c.resultadoRegistrado);
    if (hayResultados && !confirm("Ya hay resultados registrados. Generar de nuevo conservará esos resultados y reemplazará solo los combates pendientes. ¿Continuar?")) return;
    try {
      const nuevo = generarCalendarioCompleto(estado);
      const anterioresM = calendario.miercoles.filter(c => c.resultadoRegistrado);
      const anterioresJ = calendario.jueves.filter(c => c.resultadoRegistrado);
      calendario.temporadaId = nuevo.temporadaId;
      calendario.miercoles = nuevo.miercoles.map((c, i) => anterioresM[i] || c);
      calendario.jueves = nuevo.jueves.map((c, i) => anterioresJ[i] || c);
      calendarioCambioActivo = null;
      guardarYRefrescar();
    } catch (e) { alert(e.message); }
  };

  contenedor.querySelectorAll("[data-cal-tipo]").forEach(select => {
    select.onchange = () => {
      const [dia, id] = select.dataset.calTipo.split("|");
      const combate = calendario[dia].find(c => c.id === id);
      if (!combate) return;
      try {
        cambiarTipoCombateCalendario(estado, combate, select.value, calendario);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) {
        alert(e.message);
        renderCalendario(estado, contenedor, guardarYRefrescar);
      }
    };
  });

  contenedor.querySelectorAll("[data-cal-cambiar]").forEach(button => {
    button.onclick = () => {
      const [combateId, indice] = button.dataset.calCambiar.split("|");
      calendarioCambioActivo = { combateId, indice: Number(indice) };
      renderCalendario(estado, contenedor, guardarYRefrescar);
    };
  });

  contenedor.querySelectorAll("[data-cal-cancelar-cambio]").forEach(button => {
    button.onclick = () => {
      calendarioCambioActivo = null;
      renderCalendario(estado, contenedor, guardarYRefrescar);
    };
  });

  contenedor.querySelectorAll("[data-cal-aplicar-cambio]").forEach(button => {
    button.onclick = () => {
      const [combateId, indiceTexto] = button.dataset.calAplicarCambio.split("|");
      const indice = Number(indiceTexto);
      const select = contenedor.querySelector(`[data-cal-candidato="${CSS.escape(combateId)}|${indice}"]`);
      if (!select?.value) return alert("Elegí un reemplazo.");
      const combate = encontrarCombateCalendario(calendario, combateId);
      const nuevoId = select.value;
      try {
        cambiarParticipanteCalendario(estado, combate, indice, nuevoId);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) { alert(e.message); }
    };
  });

  contenedor.querySelectorAll("[data-cal-ganador]").forEach(select => {
    select.onchange = () => {
      const combate = encontrarCombateCalendario(calendario, select.dataset.calGanador);
      if (!combate) return;
      combate.ganadorId = select.value || null;
    };
  });

  contenedor.querySelectorAll("[data-cal-registrar]").forEach(button => {
    button.onclick = () => {
      const [dia, id] = button.dataset.calRegistrar.split("|");
      const combate = calendario[dia].find(c => c.id === id);
      try {
        registrarResultadoCalendario(estado, combate);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) { alert(e.message); }
    };
  });
}

function etiquetaPrioridad(prioridad) {
  return prioridad === 1 ? "🔴 Prioridad 1" : prioridad === 2 ? "🟠 Prioridad 2" : prioridad === 3 ? "🟡 Prioridad 3" : "⚪ Prioridad 4";
}

function encontrarCombateCalendario(calendario, id) {
  return [...calendario.miercoles, ...calendario.jueves].find(c => c.id === id);
}
