let calendarioCambioActivo = null;

function usosParticipanteCalendario(estado, luchadorId, combateActualId, indiceActual) {
  const calendario = normalizarCalendario(estado);
  const usos = [];
  for (const dia of ["miercoles", "jueves"]) {
    calendario[dia].forEach((combate, indiceCombate) => {
      combate.participantes.forEach((p, indiceParticipante) => {
        if (p.id !== luchadorId) return;
        if (combate.id === combateActualId && indiceParticipante === indiceActual) return;
        const equipo = (combate.tipo === "2vs2" || combate.tipo === "3vs3" || combate.tipo === "2vs2vs2")
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
        <button type="button" class="accion cal-cambiar" data-cal-cambiar="${combate.id}|${indice}" ${combate.resultadoRegistrado || combate.bloqueado ? "disabled" : ""}>Cambiar</button>
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
    const bloqueado = combate.bloqueado;
    // El bloqueo impide regenerar/cambiar la composición (tipo, género,
    // reemplazo puntual), pero no impide registrar un resultado.
    const composicionBloqueada = registrado || bloqueado;
    const selectGanador = `<select data-cal-ganador="${combate.id}" ${registrado ? "disabled" : ""}>
      <option value="">Elegir ganador...</option>
      ${participantesCombate.map(({p,w}) => `<option value="${w.id}" ${ganador === w.id ? "selected" : ""}>${esc(w.nombre)}</option>`).join("")}
    </select>`;

    let participantesHtml = "";
    const esCombatePorEquipos = ["2vs2", "3vs3", "2vs2vs2"].includes(combate.tipo);
    if (esCombatePorEquipos) {
      const cantidadEquipos = combate.tipo === "2vs2vs2" ? 3 : 2;
      const equipos = Array.isArray(combate.equipos) && combate.equipos.length === cantidadEquipos
        ? combate.equipos
        : Array.from({ length: cantidadEquipos }, (_, indice) => {
            const porEquipo = participantesCombate.length / cantidadEquipos;
            return participantesCombate.slice(indice * porEquipo, (indice + 1) * porEquipo).map(({p}) => p.id);
          });
      const indicesPorId = new Map(participantesCombate.map(({p,i}) => [p.id, i]));
      participantesHtml = `<div class="cal-equipos">${equipos.map((equipo, indiceEquipo) => {
        const integrantes = equipo.map(id => indicesPorId.get(id)).filter(i => i !== undefined).map(i => {
          const item = participantesCombate[i];
          return renderParticipante(combate, item.p, item.i);
        }).join(" / ");
        return `<div class="cal-equipo"><strong>Equipo ${String.fromCharCode(65 + indiceEquipo)}:</strong> ${integrantes}</div>`;
      }).join("<div class=\"cal-vs\"><b>vs</b></div>")}</div>`;
    } else {
      participantesHtml = `<div class="cal-participantes">${participantesCombate.map(({p,i}) => renderParticipante(combate,p,i)).join(" <b>vs</b> ")}</div>`;
    }

    const generoActual = combate.generoForzado || "";
    const opcionesGenero = [
      { valor: "", label: "🎲 Aleatorio" },
      { valor: "Hombre", label: "👨 Hombres" },
      { valor: "Mujer", label: "👩 Mujeres" },
    ].map(o => `<option value="${o.valor}" ${generoActual === o.valor ? "selected" : ""}>${o.label}</option>`).join("");

    return `<article class="cal-combate ${registrado ? "cal-registrado" : ""} ${bloqueado ? "cal-bloqueado" : ""}">
      <div class="cal-combate-cabecera">
        <strong>Combate ${indice + 1}</strong>
        <span>${registrado ? "✅ Resultado registrado" : bloqueado ? "🔒 Bloqueado" : "Pendiente"}</span>
      </div>
      <div class="cal-combate-controles">
        <label>Tipo<select data-cal-tipo="${dia}|${combate.id}" ${composicionBloqueada ? "disabled" : ""}>${opcionesTipo.replace(`value="${combate.tipo}"`, `value="${combate.tipo}" selected`)}</select></label>
        <label>Género<select data-cal-genero="${dia}|${combate.id}" ${composicionBloqueada ? "disabled" : ""}>${opcionesGenero}</select></label>
      </div>
      <div class="cal-combate-acciones">
        <button type="button" class="accion secundaria" data-cal-regenerar="${dia}|${combate.id}" ${composicionBloqueada ? "disabled" : ""}>🔄 Regenerar</button>
        <button type="button" class="accion secundaria" data-cal-bloquear="${dia}|${combate.id}" ${registrado ? "disabled" : ""}>${bloqueado ? "🔓 Desbloquear" : "🔒 Bloquear"}</button>
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
      <button class="accion secundaria" id="cal-regenerar-desbloqueados">🎲 Regenerar combates desbloqueados</button>
      <span class="texto-tenue cal-ayuda">Generar de nuevo reemplaza las dos carteleras actuales que todavía no tengan resultados registrados ni estén bloqueadas. "Regenerar combates desbloqueados" solo vuelve a armar los combates que no estén 🔒 ni tengan resultado registrado.</span>
    </div>
    <div class="panel cal-probabilidades">
      <div class="panel-header"><h3>⚖️ Probabilidades de tipos de combate</h3><span class="texto-tenue">Sorteo ponderado por combate · máximo 3 por show</span></div>
      <div class="cal-prob-grid">
        ${Object.entries(TIPOS_COMBATE_CALENDARIO).map(([tipo, info]) => `
          <label class="cal-prob-item">
            <span>${esc(info.label)}</span>
            <span class="cal-prob-input"><input type="number" min="0" step="1" inputmode="numeric" data-cal-probabilidad="${tipo}" value="${calendario.probabilidadesTipos[tipo]}"><b>%</b></span>
          </label>
        `).join("")}
      </div>
      <div class="cal-prob-footer">
        <strong>Total: <span id="cal-prob-total">0%</span></strong>
        <button class="accion" id="cal-guardar-probabilidades" disabled>💾 Guardar probabilidades</button>
      </div>
      <p class="texto-tenue cal-ayuda">Los porcentajes son probabilidades, no cantidades obligatorias. Cada combate hace su propio sorteo.</p>
    </div>
    <div class="panel"><div class="panel-header"><h3>Protagonistas de Exposición</h3><span class="texto-tenue">Los oponentes salen del Roster general</span></div>
      <div class="tabla-scroll"><table><thead><tr><th>Luchador</th><th>Show actual</th><th>Género</th><th>Overall</th><th>Balance</th><th>Participación</th><th>V/D</th><th>Total combates</th><th>Racha/Tendencia</th><th>Prioridad</th></tr></thead><tbody>
      ${participantes.slice().sort((a,b)=>a.prioridad-b.prioridad || a.nombre.localeCompare(b.nombre,"es")).map(w=>`<tr><td>${esc(w.nombre)}</td><td>${chipsShows(w.shows)}</td><td>${esc(w.genero)}</td><td>${w.overall || "—"}</td><td>${w.balance}</td><td>${w.participacion}</td><td>${w.victorias} / ${w.derrotas}</td><td>${w.totalCombates}</td><td>${w.tendencia}</td><td>${etiquetaPrioridad(w.prioridad)}</td></tr>`).join("")}
      </tbody></table></div>
    </div>
    ${renderDia("miercoles", "📺 Miércoles", calendario.miercoles)}
    ${renderDia("jueves", "📺 Jueves", calendario.jueves)}
  `;

  const actualizarProbabilidadesUI = () => {
    const inputs = [...contenedor.querySelectorAll("[data-cal-probabilidad]")];
    const valores = inputs.map(input => Number(input.value));
    const total = valores.reduce((suma, valor) => suma + (Number.isFinite(valor) ? valor : 0), 0);
    const totalEl = contenedor.querySelector("#cal-prob-total");
    const guardarBtn = contenedor.querySelector("#cal-guardar-probabilidades");
    totalEl.textContent = `${total}%`;
    totalEl.classList.toggle("cal-prob-total-ok", Math.abs(total - 100) < 1e-9);
    totalEl.classList.toggle("cal-prob-total-error", Math.abs(total - 100) >= 1e-9);
    guardarBtn.disabled = Math.abs(total - 100) >= 1e-9 || inputs.some(input => {
      const valor = Number(input.value);
      return !Number.isFinite(valor) || valor < 0;
    });
  };

  contenedor.querySelectorAll("[data-cal-probabilidad]").forEach(input => {
    input.oninput = actualizarProbabilidadesUI;
  });

  contenedor.querySelector("#cal-guardar-probabilidades").onclick = () => {
    const inputs = [...contenedor.querySelectorAll("[data-cal-probabilidad]")];
    const valores = {};
    for (const input of inputs) {
      const valor = Number(input.value);
      if (!Number.isFinite(valor) || valor < 0) {
        alert("Las probabilidades deben ser números iguales o mayores que 0.");
        return;
      }
      valores[input.dataset.calProbabilidad] = valor;
    }
    const total = Object.values(valores).reduce((suma, valor) => suma + valor, 0);
    if (Math.abs(total - 100) >= 1e-9) {
      alert("Las probabilidades solo se pueden guardar cuando el total sea exactamente 100%.");
      return;
    }
    calendario.probabilidadesTipos = { ...PROBABILIDADES_TIPOS_COMBATE_CALENDARIO, ...valores };
    guardarYRefrescar();
  };

  actualizarProbabilidadesUI();

  contenedor.querySelector("#cal-generar").onclick = () => {
    const hayResultados = [...calendario.miercoles, ...calendario.jueves].some(c => c.resultadoRegistrado);
    if (hayResultados && !confirm("Ya hay resultados registrados. Generar de nuevo conservará esos resultados y los combates bloqueados, y reemplazará solo el resto. ¿Continuar?")) return;
    try {
      const nuevo = generarCalendarioCompleto(estado);
      // Se conserva por POSICIÓN (no por índice dentro de un filtro): un
      // combate registrado o bloqueado debe seguir siendo exactamente el
      // mismo "Combate N", no desplazarse a otro lugar de la cartelera.
      const conservarPorPosicion = (viejos, nuevos) => nuevos.map((c, i) => {
        const anterior = viejos[i];
        return anterior && (anterior.resultadoRegistrado || anterior.bloqueado) ? anterior : c;
      });
      calendario.temporadaId = nuevo.temporadaId;
      calendario.miercoles = conservarPorPosicion(calendario.miercoles, nuevo.miercoles);
      calendario.jueves = conservarPorPosicion(calendario.jueves, nuevo.jueves);
      calendarioCambioActivo = null;
      guardarYRefrescar();
    } catch (e) { alert(e.message); }
  };

  contenedor.querySelector("#cal-regenerar-desbloqueados").onclick = () => {
    try {
      const resumen = regenerarCombatesDesbloqueadosCalendario(estado, calendario);
      calendarioCambioActivo = null;
      guardarYRefrescar();
      if (resumen.fallidos.length) {
        alert(`Se regeneraron ${resumen.regenerados} combate(s). No se pudieron regenerar ${resumen.fallidos.length}: no había suficientes luchadores válidos disponibles para esos casos.`);
      }
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

  contenedor.querySelectorAll("[data-cal-genero]").forEach(select => {
    select.onchange = () => {
      const [dia, id] = select.dataset.calGenero.split("|");
      const combate = calendario[dia].find(c => c.id === id);
      if (!combate) return;
      try {
        cambiarGeneroCombateCalendario(estado, combate, select.value || null, calendario);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) {
        alert(e.message);
        renderCalendario(estado, contenedor, guardarYRefrescar);
      }
    };
  });

  contenedor.querySelectorAll("[data-cal-regenerar]").forEach(button => {
    button.onclick = () => {
      const [dia, id] = button.dataset.calRegenerar.split("|");
      const combate = calendario[dia].find(c => c.id === id);
      if (!combate) return;
      try {
        regenerarCombateCalendario(estado, combate, calendario);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) { alert(e.message); }
    };
  });

  contenedor.querySelectorAll("[data-cal-bloquear]").forEach(button => {
    button.onclick = () => {
      const [dia, id] = button.dataset.calBloquear.split("|");
      const combate = calendario[dia].find(c => c.id === id);
      if (!combate) return;
      try {
        alternarBloqueoCombateCalendario(combate);
        calendarioCambioActivo = null;
        guardarYRefrescar();
      } catch (e) { alert(e.message); }
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
