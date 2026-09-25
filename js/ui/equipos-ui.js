// =========================================================================
// equipos-ui.js — pantalla "Teams & Stables"
// -------------------------------------------------------------------------
// Dibuja Stables y Tag Teams y conecta los botones con las funciones de
// logic/equipos.js. No guarda datos propios: todo vive en estado.equipos.
// =========================================================================

// Formulario abierto en este momento (uno solo a la vez):
//   null
//   { tipo: "nuevo-stable" | "nuevo-tag" }
//   { tipo: "editar-stable" | "editar-tag" | "derivar", id }
let equiposFormulario = null;
let filtrosEquiposStables = { busqueda: "" };

function compararNombresEquipos(a, b) {
  return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
}

function opcionesLuchadoresEquipos(lista, seleccionado = "") {
  return `<option value="">Elegir luchador...</option>` + lista.slice()
    .sort(compararNombresEquipos)
    .map((w) => `<option value="${esc(w.id)}" ${w.id === seleccionado ? "selected" : ""}>${esc(w.nombre)}</option>`)
    .join("");
}

function htmlMiembroEquipo(estado, luchadorId, stableId = null) {
  const w = obtenerLuchadorParaHistorial(estado, luchadorId);
  const quitar = stableId
    ? `<button type="button" class="eq-quitar" title="Quitar del Stable" data-eq-accion="quitar-miembro" data-id="${esc(stableId)}" data-luchador="${esc(luchadorId)}">✕</button>`
    : "";
  return `<span class="eq-miembro">${esc(w.nombre)}${quitar}</span>`;
}

// Campos comunes de los formularios de Tag Team: nombre + 2 luchadores.
// Con `conBuscador` (lista = roster completo) se usa el buscador de luchadores;
// si la lista sale de un Stable (pocos miembros) se mantiene el <select>.
function htmlCamposTagTeam(estado, luchadoresDisponibles, tag = null, conBuscador = false) {
  const campoLuchador = (id, etiqueta, indice) => conBuscador
    ? htmlBuscadorLuchador({ id, etiqueta })
    : `<label>${etiqueta}<select id="${id}">${opcionesLuchadoresEquipos(luchadoresDisponibles, tag?.miembros[indice] ?? "")}</select></label>`;
  return `<div class="form-grid">
    <label>Nombre<input type="text" id="eq-f-nombre" value="${esc(tag?.nombre ?? "")}" /></label>
    ${campoLuchador("eq-f-a", "Luchador 1", 0)}
    ${campoLuchador("eq-f-b", "Luchador 2", 1)}
  </div>`;
}

function htmlBotonesFormularioEquipos(accion, id = "", textoGuardar = "Guardar") {
  return `<div class="eq-form-botones">
    <button type="button" class="accion" data-eq-accion="${accion}" data-id="${esc(id)}">${textoGuardar}</button>
    <button type="button" class="accion secundaria" data-eq-accion="cancelar">Cancelar</button>
  </div>`;
}

function htmlStableEquipos(estado, stable) {
  const derivados = tagTeamsDerivados(estado, stable.id).sort(compararNombresEquipos);
  const editando = equiposFormulario?.tipo === "editar-stable" && equiposFormulario.id === stable.id;
  const derivando = equiposFormulario?.tipo === "derivar" && equiposFormulario.id === stable.id;
  const sinAgregar = luchadoresSinStable(estado);
  const miembros = stable.miembros.map((id) => obtenerLuchadorParaHistorial(estado, id));

  // Estado normal: solo información (nombre + integrantes). Los campos de
  // edición (nombre editable, agregar/quitar miembro, derivar Tag Team) solo
  // aparecen cuando esta tarjeta puntual entró en modo edición.
  const titulo = editando
    ? `<label class="eq-nombre-edicion">Nombre del Stable<input type="text" id="eq-f-nombre" value="${esc(stable.nombre)}" /></label>`
    : `<h4>🏴 ${esc(stable.nombre)} <span class="texto-tenue">· ${stable.miembros.length} ${stable.miembros.length === 1 ? "miembro" : "miembros"}</span></h4>`;

  const acciones = editando
    ? `<div class="eq-acciones">
        <button type="button" class="accion" data-eq-accion="guardar-nombre-stable" data-id="${esc(stable.id)}">💾 Guardar</button>
        <button type="button" class="accion secundaria" data-eq-accion="cancelar">Cancelar</button>
      </div>`
    : `<div class="eq-acciones">
        <button type="button" class="accion secundaria" data-eq-accion="abrir" data-form="editar-stable" data-id="${esc(stable.id)}">✏️ Editar</button>
        <button type="button" class="accion secundaria" data-eq-accion="eliminar-stable" data-id="${esc(stable.id)}">🗑️ Eliminar</button>
      </div>`;

  const listaDerivados = derivados.length
    ? `<ul class="eq-derivados">${derivados.map((t) => `<li>↳ <strong>${esc(t.nombre)}</strong> <span class="texto-tenue">${t.miembros.map((id) => esc(nombreLuchadorPorId(estado, id))).join(" + ")}</span></li>`).join("")}</ul>`
    : `<p class="texto-tenue">Este Stable no tiene Tag Teams derivados.</p>`;

  const agregarMiembro = editando
    ? `<div class="form-linea eq-agregar">
      ${htmlBuscadorLuchador({ id: `eq-agregar-${stable.id}`, etiqueta: "Luchador a agregar", etiquetaVisible: false, deshabilitado: !sinAgregar.length })}
      <button type="button" class="accion secundaria" data-eq-accion="agregar-miembro" data-id="${esc(stable.id)}" ${sinAgregar.length ? "" : "disabled"}>➕ Agregar miembro</button>
    </div>`
    : "";

  const formDerivado = derivando
    ? `<div class="eq-form"><p class="texto-tenue">Solo se pueden elegir miembros actuales de ${esc(stable.nombre)}.</p>
        ${htmlCamposTagTeam(estado, miembros)}${htmlBotonesFormularioEquipos("crear-derivado", stable.id, "Crear Tag Team")}</div>`
    : "";
  const botonDerivar = editando
    ? `<button type="button" class="accion secundaria" data-eq-accion="abrir" data-form="derivar" data-id="${esc(stable.id)}" ${stable.miembros.length < MIEMBROS_TAG_TEAM ? 'disabled title="El Stable necesita al menos 2 miembros"' : ""}>➕ Crear Tag Team derivado</button>`
    : "";

  return `<div class="eq-card">
    <div class="eq-cabecera">${titulo}${acciones}</div>
    <div class="eq-miembros">${stable.miembros.map((id) => htmlMiembroEquipo(estado, id, editando ? stable.id : null)).join("")}</div>
    ${agregarMiembro}
    <div class="eq-seccion"><strong>Tag Teams derivados</strong>${listaDerivados}${editando ? `${botonDerivar}${formDerivado}` : ""}</div>
  </div>`;
}

function htmlTagTeamEquipos(estado, tag) {
  const editando = equiposFormulario?.tipo === "editar-tag" && equiposFormulario.id === tag.id;
  const stableOrigen = tag.stableOrigenId ? obtenerStable(estado, tag.stableOrigenId) : null;
  const origen = stableOrigen
    ? `<span class="chip eq-chip-derivado">↳ Derivado de ${esc(stableOrigen.nombre)}</span>`
    : `<span class="chip eq-chip-independiente">Independiente</span>`;

  // Un Tag Team derivado solo ofrece miembros actuales del Stable (más los que ya tiene).
  let disponibles = estado.roster;
  if (stableOrigen) {
    const ids = new Set([...stableOrigen.miembros, ...tag.miembros]);
    disponibles = [...ids].map((id) => obtenerLuchadorParaHistorial(estado, id));
  }

  const form = editando
    ? `<div class="eq-form">${htmlCamposTagTeam(estado, disponibles, tag, !stableOrigen)}${htmlBotonesFormularioEquipos("guardar-tag", tag.id)}</div>`
    : "";
  return `<div class="eq-card">
    <div class="eq-cabecera">
      <h4>🤝 ${esc(tag.nombre)} ${origen}</h4>
      <div class="eq-acciones">
        <button type="button" class="accion secundaria" data-eq-accion="abrir" data-form="editar-tag" data-id="${esc(tag.id)}">✏️ Editar</button>
        <button type="button" class="accion secundaria" data-eq-accion="eliminar-tag" data-id="${esc(tag.id)}">🗑️ Eliminar</button>
      </div>
    </div>
    <div class="eq-miembros">${tag.miembros.map((id) => htmlMiembroEquipo(estado, id)).join("")}</div>
    ${form}
  </div>`;
}

function stablesFiltradosBusqueda(estado, stables, busqueda) {
  const q = busqueda.trim().toLowerCase();
  if (!q) return stables;
  return stables.filter((s) => {
    if (s.nombre.toLowerCase().includes(q)) return true;
    return s.miembros.some((id) => {
      const w = obtenerLuchadorParaHistorial(estado, id);
      return w && w.nombre.toLowerCase().includes(q);
    });
  });
}

// Mismo criterio que stablesFiltradosBusqueda (nombre del equipo o de
// cualquier integrante), aplicado a Tag Teams. Un solo buscador (el de
// Stables/Grupos) filtra ambos listados con la misma búsqueda.
function tagsFiltradosBusqueda(estado, tags, busqueda) {
  const q = busqueda.trim().toLowerCase();
  if (!q) return tags;
  return tags.filter((t) => {
    if (t.nombre.toLowerCase().includes(q)) return true;
    return t.miembros.some((id) => {
      const w = obtenerLuchadorParaHistorial(estado, id);
      return w && w.nombre.toLowerCase().includes(q);
    });
  });
}

function htmlListaStables(estado, stables) {
  if (!stables.length) return `<p class="texto-tenue">Todavía no hay Stables.</p>`;
  const busqueda = filtrosEquiposStables.busqueda;
  const visibles = stablesFiltradosBusqueda(estado, stables, busqueda);
  if (visibles.length) return visibles.map((s) => htmlStableEquipos(estado, s)).join("");
  // Sin resultados: si tampoco hay Tags para la misma búsqueda, el mensaje
  // lo deja en claro para los dos grupos a la vez.
  const tagsVisibles = tagsFiltradosBusqueda(estado, equiposDe(estado).tagTeams, busqueda);
  return tagsVisibles.length
    ? `<p class="texto-tenue">No se encontraron Stables para "${esc(busqueda)}".</p>`
    : `<p class="texto-tenue">No se encontraron Stables ni Tags para "${esc(busqueda)}".</p>`;
}

// Simétrica a htmlListaStables, para Tag Teams. Usa la misma búsqueda
// compartida (filtrosEquiposStables.busqueda) para que un solo campo
// filtre ambos listados a la vez.
function htmlListaTags(estado, tags) {
  if (!tags.length) return `<p class="texto-tenue">Todavía no hay Tag Teams.</p>`;
  const busqueda = filtrosEquiposStables.busqueda;
  const visibles = tagsFiltradosBusqueda(estado, tags, busqueda);
  if (visibles.length) return visibles.map((t) => htmlTagTeamEquipos(estado, t)).join("");
  const stablesVisibles = stablesFiltradosBusqueda(estado, equiposDe(estado).stables, busqueda);
  return stablesVisibles.length
    ? `<p class="texto-tenue">No se encontraron Tags para "${esc(busqueda)}".</p>`
    : `<p class="texto-tenue">No se encontraron Stables ni Tags para "${esc(busqueda)}".</p>`;
}

// Actualiza las listas de Stables Y Tag Teams (usadas por el mismo buscador,
// "mientras se escribe") sin reconstruir toda la pantalla ni perder el foco
// del input.
function actualizarListaStables(estado, contenedor, guardarYRefrescar) {
  const eq = equiposDe(estado);
  const stables = eq.stables.slice().sort(compararNombresEquipos);
  const tagTeams = eq.tagTeams.slice().sort(compararNombresEquipos);
  const listaStables = contenedor.querySelector("#eq-stables-lista");
  if (listaStables) {
    listaStables.innerHTML = htmlListaStables(estado, stables);
    eq.stables.forEach((s) => activarBuscadorLuchador(contenedor, { id: `eq-agregar-${s.id}`, luchadores: () => luchadoresSinStable(estado) }));
  }
  const listaTags = contenedor.querySelector("#eq-tags-lista");
  if (listaTags) listaTags.innerHTML = htmlListaTags(estado, tagTeams);
}

function renderEquipos(estado, contenedor, guardarYRefrescar) {
  const eq = equiposDe(estado);

  // Si el formulario abierto apunta a algo que ya no existe, se descarta.
  if (equiposFormulario?.id) {
    const existe = equiposFormulario.tipo === "editar-tag" ? obtenerTagTeam(estado, equiposFormulario.id) : obtenerStable(estado, equiposFormulario.id);
    if (!existe) equiposFormulario = null;
  }

  const stables = eq.stables.slice().sort(compararNombresEquipos);
  const tagTeams = eq.tagTeams.slice().sort(compararNombresEquipos);
  const derivados = tagTeams.filter((t) => t.stableOrigenId).length;
  const enStables = eq.stables.reduce((acc, s) => acc + s.miembros.length, 0);

  const formNuevoStable = equiposFormulario?.tipo === "nuevo-stable"
    ? `<div class="eq-form"><div class="form-grid">
        <label>Nombre<input type="text" id="eq-f-nombre" /></label>
        ${htmlBuscadorLuchador({ id: "eq-f-a", etiqueta: "Primer miembro" })}
      </div>${htmlBotonesFormularioEquipos("crear-stable", "", "Crear Stable")}</div>`
    : "";
  const formNuevoTag = equiposFormulario?.tipo === "nuevo-tag"
    ? `<div class="eq-form">${htmlCamposTagTeam(estado, estado.roster, null, true)}${htmlBotonesFormularioEquipos("crear-tag", "", "Crear Tag Team")}</div>`
    : "";

  contenedor.innerHTML = `<h2>🤝 Teams & Stables</h2>
    <p class="texto-tenue">Tag Teams (2 luchadores) y Stables/Grupos. Un luchador puede estar en un solo Stable y en varios Tag Teams. Esta es la fuente de datos que usará el Calendario para proponer combates por equipos.</p>
    <div class="eq-resumen">
      <div><strong>${eq.stables.length}</strong><span>Stables</span></div>
      <div><strong>${eq.tagTeams.length}</strong><span>Tag Teams</span></div>
      <div><strong>${derivados}</strong><span>Tag Teams derivados</span></div>
      <div><strong>${enStables}</strong><span>Luchadores en Stables</span></div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h3>Stables / Grupos</h3>
        <div class="controles">
          <input type="text" id="eq-busqueda-stables" placeholder="Buscar Stable o Tag por nombre o integrante..." value="${esc(filtrosEquiposStables.busqueda)}" />
          <button type="button" class="accion" data-eq-accion="abrir" data-form="nuevo-stable">➕ Nuevo Stable</button>
        </div>
      </div>
      ${formNuevoStable}
      <div id="eq-stables-lista">${htmlListaStables(estado, stables)}</div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Tag Teams</h3><button type="button" class="accion" data-eq-accion="abrir" data-form="nuevo-tag">➕ Nuevo Tag Team</button></div>
      ${formNuevoTag}
      <div id="eq-tags-lista">${htmlListaTags(estado, tagTeams)}</div>
    </div>`;

  // Buscadores de luchadores (activarBuscadorLuchador devuelve null si ese buscador no está dibujado).
  const tagEnEdicion = equiposFormulario?.tipo === "editar-tag" ? obtenerTagTeam(estado, equiposFormulario.id) : null;
  activarBuscadorLuchador(contenedor, { id: "eq-f-a", luchadores: () => (equiposFormulario?.tipo === "nuevo-stable" ? luchadoresSinStable(estado) : estado.roster), valorInicial: tagEnEdicion?.miembros[0] ?? "" });
  activarBuscadorLuchador(contenedor, { id: "eq-f-b", luchadores: () => estado.roster, valorInicial: tagEnEdicion?.miembros[1] ?? "" });
  eq.stables.forEach((s) => activarBuscadorLuchador(contenedor, { id: `eq-agregar-${s.id}`, luchadores: () => luchadoresSinStable(estado) }));

  contenedor.querySelector("#eq-busqueda-stables").addEventListener("input", (evento) => {
    filtrosEquiposStables.busqueda = evento.target.value;
    actualizarListaStables(estado, contenedor, guardarYRefrescar);
  });

  const leer = (selector) => contenedor.querySelector(selector)?.value ?? "";
  const cerrarYGuardar = () => { equiposFormulario = null; guardarYRefrescar(); };
  const nombresLista = (lista) => lista.map((t) => `• ${t.nombre}`).join("\n");

  contenedor.onclick = (evento) => {
    const boton = evento.target.closest("[data-eq-accion]");
    if (!boton || !contenedor.contains(boton) || boton.disabled) return;
    const { eqAccion: accion, id, luchador, form } = boton.dataset;
    try {
      switch (accion) {
        case "abrir":
          equiposFormulario = { tipo: form, id: id || null };
          renderEquipos(estado, contenedor, guardarYRefrescar);
          break;
        case "cancelar":
          equiposFormulario = null;
          renderEquipos(estado, contenedor, guardarYRefrescar);
          break;
        case "crear-stable":
          crearStable(estado, { nombre: leer("#eq-f-nombre"), miembros: [leer("#eq-f-a")] });
          cerrarYGuardar();
          break;
        case "guardar-nombre-stable":
          renombrarStable(estado, id, leer("#eq-f-nombre"));
          cerrarYGuardar();
          break;
        case "agregar-miembro": {
          agregarMiembroStable(estado, id, leer(`#eq-agregar-${id}`));
          guardarYRefrescar();
          break;
        }
        case "quitar-miembro": {
          const stable = obtenerStable(estado, id);
          if (stable.miembros.length === 1) {
            const derivadosDelStable = tagTeamsDerivados(estado, id);
            const aviso = derivadosDelStable.length ? `\n\nTambién se eliminarán sus Tag Teams derivados:\n${nombresLista(derivadosDelStable)}` : "";
            if (!confirm(`${nombreLuchadorPorId(estado, luchador)} es el último miembro de ${stable.nombre}. Si lo quitás, el Stable se elimina.${aviso}\n\nLos luchadores no se eliminan del Roster.`)) return;
          }
          quitarMiembroStable(estado, id, luchador);
          guardarYRefrescar();
          break;
        }
        case "eliminar-stable": {
          const stable = obtenerStable(estado, id);
          const derivadosDelStable = tagTeamsDerivados(estado, id);
          const aviso = derivadosDelStable.length ? `\n\nTambién se eliminarán sus Tag Teams derivados:\n${nombresLista(derivadosDelStable)}` : "";
          if (!confirm(`¿Eliminar el Stable ${stable.nombre}?${aviso}\n\nLos luchadores NO se eliminan del Roster.`)) return;
          eliminarStable(estado, id);
          cerrarYGuardar();
          break;
        }
        case "crear-derivado":
          crearTagTeamDerivado(estado, id, { nombre: leer("#eq-f-nombre"), miembros: [leer("#eq-f-a"), leer("#eq-f-b")] });
          cerrarYGuardar();
          break;
        case "crear-tag":
          crearTagTeam(estado, { nombre: leer("#eq-f-nombre"), miembros: [leer("#eq-f-a"), leer("#eq-f-b")] });
          cerrarYGuardar();
          break;
        case "guardar-tag":
          editarTagTeam(estado, id, { nombre: leer("#eq-f-nombre"), miembros: [leer("#eq-f-a"), leer("#eq-f-b")] });
          cerrarYGuardar();
          break;
        case "eliminar-tag": {
          const tag = obtenerTagTeam(estado, id);
          if (!confirm(`¿Eliminar el Tag Team ${tag.nombre}?\n\nLos luchadores NO se eliminan del Roster.`)) return;
          eliminarTagTeam(estado, id);
          guardarYRefrescar();
          break;
        }
      }
    } catch (error) { alert(error.message); }
  };

  // Enter en el campo de nombre confirma el formulario abierto.
  contenedor.onkeydown = (evento) => {
    if (evento.key !== "Enter" || evento.target.id !== "eq-f-nombre") return;
    evento.preventDefault();
    contenedor.querySelector(".eq-form-botones .accion:not(.secundaria)")?.click();
  };
}
