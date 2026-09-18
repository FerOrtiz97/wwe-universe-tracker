let filtrosRoster = { juego: "WWE 2K25", busqueda: "", show: "todos", genero: "todos", ordenarPor: "nombre", orden: "asc" };

function renderRoster(estado, contenedor, guardarYRefrescar) {
  const filas = obtenerRosterJuego(estado, filtrosRoster.juego);
  const filtrados = filtrarRosterJuego(filas, filtrosRoster);
  contenedor.innerHTML = `
    <h2>🧑‍🤝‍🧑 Roster</h2>
    <div class="controles controles-principales">
      <label>Juego<select id="roster-juego"><option>WWE 2K25</option><option>WWE 2K26</option></select></label>
      <input type="text" id="roster-busqueda" placeholder="Buscar por nombre..." value="${esc(filtrosRoster.busqueda)}" />
      <label>Género<select id="roster-filtro-genero"><option value="todos">Todos</option><option value="Mujer">Mujer</option><option value="Hombre">Hombre</option></select></label>
      <label>Show / estado<select id="roster-filtro-show">${["todos","RAW","SmackDown","NXT","Retirado"].map(s=>`<option value="${s}">${s === "todos" ? "Todos" : s}</option>`).join("")}</select></label>
      <button class="accion" id="roster-btn-nuevo">➕ Agregar luchador</button>
    </div>
    <p class="texto-tenue">El selector cambia únicamente el roster del juego. No cambia tus decisiones del Universo.</p>
    <div id="roster-form"></div>
    <div class="tabla-scroll"><table><thead><tr>
      ${columnaOrdenable("nombre","Nombre")}
      ${columnaOrdenable("genero","Género")}
      <th data-campo="shows">Show / Estado</th>
      ${columnaOrdenable("overallBase","Overall Base")}
      ${columnaOrdenable("overallActual","Overall Actual")}
      ${columnaOrdenable("edadBase","Edad Base")} ${columnaOrdenable("edadActual","Edad Actual")}
      <th>Acciones</th>
    </tr></thead><tbody>${filtrados.map(filaLuchador).join("")}</tbody></table></div>
  `;
  contenedor.querySelector("#roster-juego").value = filtrosRoster.juego;
  contenedor.querySelector("#roster-filtro-genero").value = filtrosRoster.genero;
  contenedor.querySelector("#roster-filtro-show").value = filtrosRoster.show;
  contenedor.querySelector("#roster-juego").addEventListener("change", e => { filtrosRoster.juego=e.target.value; renderRoster(estado,contenedor,guardarYRefrescar); });
  contenedor.querySelector("#roster-busqueda").addEventListener("input", e => { filtrosRoster.busqueda=e.target.value; actualizarTablaRoster(estado, contenedor, guardarYRefrescar); });
  contenedor.querySelector("#roster-filtro-genero").addEventListener("change", e => { filtrosRoster.genero=e.target.value; renderRoster(estado,contenedor,guardarYRefrescar); });
  contenedor.querySelector("#roster-filtro-show").addEventListener("change", e => { filtrosRoster.show=e.target.value; renderRoster(estado,contenedor,guardarYRefrescar); });
  contenedor.querySelectorAll("th[data-campo]").forEach(th => th.addEventListener("click",()=>{ const c=th.dataset.campo; if(filtrosRoster.ordenarPor===c) filtrosRoster.orden=filtrosRoster.orden==="asc"?"desc":"asc"; else { filtrosRoster.ordenarPor=c; filtrosRoster.orden="asc"; } renderRoster(estado,contenedor,guardarYRefrescar); }));
  contenedor.querySelector("#roster-btn-nuevo").addEventListener("click",()=>mostrarFormularioNuevo(estado,contenedor,guardarYRefrescar));
  contenedor.querySelectorAll("button[data-editar]").forEach(b=>b.addEventListener("click",()=>mostrarFormularioEdicion(estado,contenedor,guardarYRefrescar,b.dataset.editar)));
  contenedor.querySelectorAll("button[data-eliminar]").forEach(b=>b.addEventListener("click",()=>{
    const w=estado.roster.find(x=>x.id===b.dataset.eliminar); if(!w)return;
    if(confirm(`¿ELIMINAR A ${w.nombre} DEL ROSTER?\n\nSu historial de temporadas NO se borrará.`)){ eliminarLuchador(estado,w.id); guardarYRefrescar(); }
  }));
}

function valorOrdenRoster(w,c){ if(c==="shows") return normalizarShows(w.shows??w.show).join(", "); return w[c]; }

function actualizarTablaRoster(estado, contenedor, guardarYRefrescar) {
  const filas = filtrarRosterJuego(obtenerRosterJuego(estado, filtrosRoster.juego), filtrosRoster);
  const tbody = contenedor.querySelector(".tabla-scroll tbody");
  if (tbody) tbody.innerHTML = filas.map(filaLuchador).join("");
  contenedor.querySelectorAll("button[data-editar]").forEach(b=>b.onclick=()=>mostrarFormularioEdicion(estado,contenedor,guardarYRefrescar,b.dataset.editar));
  contenedor.querySelectorAll("button[data-eliminar]").forEach(b=>b.onclick=()=>{
    const w=estado.roster.find(x=>x.id===b.dataset.eliminar); if(!w)return;
    if(confirm(`¿ELIMINAR A ${w.nombre} DEL ROSTER?\n\nSu historial de temporadas NO se borrará.`)){ eliminarLuchador(estado,w.id); guardarYRefrescar(); }
  });
}

function obtenerRosterJuego(estado,juego){
  if(juego==="WWE 2K26") return (estado.comparacion2k26||[]).map((d,i)=>({
    id:`2k26-${slugify(d.nombre)}-${i}`, nombre:d.nombre, genero:d.genero, shows:d.show2k26?[d.show2k26]:[], overallBase:d.overall2k26, overallActual:d.overall2k26, edadBase:d.edadBase, edadActual:d.edadBase, esJuego:true
  }));
  return estado.roster.map(w=>({...w,esJuego:false}));
}
function filtrarRosterJuego(lista,f){
  let r=lista.slice();
  if(f.show!=="todos") r=r.filter(w=>normalizarShows(w.shows??w.show).includes(f.show));
  if(f.genero!=="todos") r=r.filter(w=>w.genero===f.genero);
  if(f.busqueda.trim()) r=r.filter(w=>w.nombre.toLowerCase().includes(f.busqueda.trim().toLowerCase()));
  r.sort((a,b)=>{let va=valorOrdenRoster(a,f.ordenarPor),vb=valorOrdenRoster(b,f.ordenarPor),c=typeof va==="string"?va.localeCompare(String(vb??""),"es",{sensitivity:"base"}):(va??-Infinity)-(vb??-Infinity);return f.orden==="asc"?c:-c;});
  return r;
}
function columnaOrdenable(c,e){const active=filtrosRoster.ordenarPor===c;return `<th data-campo="${c}">${e}${active?(filtrosRoster.orden==="asc"?" ▲":" ▼"):""}</th>`;}
function claseFila(shows){const s=Array.isArray(shows)?shows[0]:shows;return {RAW:"fila-raw",SmackDown:"fila-smackdown",NXT:"fila-nxt",Retirado:"fila-retirado"}[s]||"";}
function chipShow(show){return `<span class="chip ${show==='RAW'?'raw':show==='SmackDown'?'smackdown':show==='NXT'?'nxt':'retirado'}">${show}</span>`;}
function chipsShows(shows){return normalizarShows(shows).map(chipShow).join(" ");}
function filaLuchador(w){
  const esJuego=w.esJuego;
  return `<tr class="${claseFila(w.shows)}"><td>${esc(w.nombre)}</td><td>${w.genero==="Mujer"?"♀️":"♂️"}</td><td>${chipsShows(w.shows)}</td><td>${w.overallBase??"—"}</td><td><strong>${w.overallActual??"—"}</strong></td><td>${w.edadBase??"—"}</td><td>${w.edadActual??"—"}</td><td>${esJuego?"<span class='texto-tenue'>Referencia</span>":`<button class="accion secundaria" data-editar="${w.id}" title="Editar">✏️</button> <button class="accion secundaria" data-eliminar="${w.id}" title="Eliminar">🗑️</button>`}</td></tr>`;
}
function mostrarFormularioNuevo(estado,contenedor,guardarYRefrescar){
 const z=contenedor.querySelector("#roster-form"); z.innerHTML=formularioRoster(null); conectarFormularioRoster(z,estado,guardarYRefrescar,null);
}
function mostrarFormularioEdicion(estado,contenedor,guardarYRefrescar,id){
 const w=estado.roster.find(x=>x.id===id); if(!w)return;
 const boton=contenedor.querySelector(`button[data-editar="${CSS.escape(id)}"]`); const fila=boton?.closest("tr"); if(!fila)return;
 contenedor.querySelector(".roster-form-fila")?.remove();
 const filaForm=document.createElement("tr"); filaForm.className="roster-form-fila";
 const celda=document.createElement("td"); celda.colSpan=8; celda.innerHTML=formularioRoster(w);
 filaForm.appendChild(celda); fila.after(filaForm);
 conectarFormularioRoster(celda,estado,guardarYRefrescar,id);
}
function formularioRoster(w){const shows=normalizarShows(w?.shows??w?.show);return `<div class="panel"><h3>${w?`Editar a ${esc(w.nombre)}`:"Nuevo luchador"}</h3><div class="form-grid"><label>Nombre<input id="rf-nombre" value="${esc(w?.nombre??"")}" /></label><label>Género<select id="rf-genero"><option ${w?.genero!=="Mujer"?'selected':''}>Hombre</option><option ${w?.genero==="Mujer"?'selected':''}>Mujer</option></select></label><label>Overall Base<input type="number" id="rf-ob" min="1" max="99" value="${w?.overallBase??""}" /></label><label>Overall Actual<input type="number" id="rf-oa" min="1" max="99" value="${w?.overallActual??""}" /></label><label>Edad Base<input type="number" id="rf-eb" min="1" max="100" value="${w?.edadBase??""}" /></label><label>Edad Actual<input type="number" id="rf-ea" min="1" max="100" value="${w?.edadActual??""}" /></label></div><div class="check-group"><strong>Shows / estado</strong>${["RAW","SmackDown","NXT","Retirado"].map(s=>`<label class="check"><input type="checkbox" value="${s}" ${shows.includes(s)?"checked":""}> ${s}</label>`).join("")}</div><button class="accion" id="rf-guardar">Guardar</button> <button class="accion secundaria" id="rf-cancelar">Cancelar</button></div>`;}
function conectarFormularioRoster(z,estado,guardarYRefrescar,id){
  z.querySelector("#rf-cancelar").onclick=()=>z.innerHTML="";
  z.querySelector("#rf-guardar").onclick=()=>{
    try{
      const posicionScroll = window.scrollY;
      const datos={nombre:z.querySelector("#rf-nombre").value.trim(),genero:z.querySelector("#rf-genero").value,overallBase:Number(z.querySelector("#rf-ob").value)||null,overallActual:Number(z.querySelector("#rf-oa").value)||null,edadBase:Number(z.querySelector("#rf-eb").value)||null,edadActual:Number(z.querySelector("#rf-ea").value)||null,shows:[...z.querySelectorAll(".check-group input:checked")].map(x=>x.value)};
      if(!datos.shows.length)throw new Error("Elegí al menos un show/estado.");
      if(id)editarLuchador(estado,id,datos);else agregarLuchador(estado,datos);
      guardarYRefrescar();
      requestAnimationFrame(()=>window.scrollTo({top:posicionScroll,behavior:"auto"}));
    }catch(e){alert(e.message);}
  };
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

