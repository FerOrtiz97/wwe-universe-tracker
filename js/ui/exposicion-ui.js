let ordenExposicion = { tabla: 'nombre', dir: 'asc' };
let ordenExposicionAcum = { campo: 'nombre', dir: 'asc' };
let filtrosExposicion = { genero: 'todos', show: 'todos', busqueda: '' };
let exposicionCambiosPendientes = false;
let guardarRapidoExposicion = null;
let guardadoRapidoExposicionInicializado = false;

function inicializarGuardadoRapidoExposicion() {
  if (guardadoRapidoExposicionInicializado) return;
  guardadoRapidoExposicionInicializado = true;
  document.addEventListener('click', (evento) => {
    if (!exposicionCambiosPendientes || typeof guardarRapidoExposicion !== 'function') return;
    if (!document.querySelector('#vista-exposicion.is-active')) return;
    if (evento.target.closest('#vista-exposicion input, #vista-exposicion select, #vista-exposicion button')) return;
    guardarRapidoExposicion();
  });
}

function renderExposicion(estado, contenedor, guardarYRefrescar) {
  inicializarGuardadoRapidoExposicion();
  const datosTodos = listarExposicion(estado).map(e=>datosExposicion(estado,e));
  const datos = datosTodos.filter(d=>cumpleFiltrosExposicion(estado,d));
  const ids = [...new Set(datos.map(d=>d.luchadorId))];
  const ordenados = ordenarExposicion(datos, ordenExposicion);
  const acumulados = ids.map(id=>{
    const r=resumenExposicion(estado,id);
    const w=obtenerLuchadorParaHistorial(estado,id);
    return {...r,id,nombre:w.nombre,show:normalizarShows(w.shows??w.show).join(', '),genero:w.genero,participacion:clasificarParticipacion(r.totalCombates),tendencia:clasificarTendencia(r)};
  }).filter(r=>cumpleFiltrosExposicion(estado,r)).sort((a,b)=>compararValores(valorOrdenAcum(a,ordenExposicionAcum.campo),valorOrdenAcum(b,ordenExposicionAcum.campo),ordenExposicionAcum.dir));
  const th=(campo,label)=>`<th data-exp-sort="${campo}">${label}${ordenExposicion.tabla===campo?(ordenExposicion.dir==='asc'?' ▲':' ▼'):''}</th>`;
  const tha=(campo,label)=>`<th data-exp-acum-sort="${campo}">${label}${ordenExposicionAcum.campo===campo?(ordenExposicionAcum.dir==='asc'?' ▲':' ▼'):''}</th>`;
  const filtroGenero=filtrosExposicion.genero;
  const filtroShow=filtrosExposicion.show;
  const busqueda=filtrosExposicion.busqueda;
  contenedor.innerHTML = `<h2>👀 Exposición</h2><p class="texto-tenue">Lista manual. Las estadísticas siguen teniendo una única fuente: Temporadas. Desde acá también podés editar V/D de cada temporada.</p>
    <div class="panel"><div class="panel-header"><h3>Agregar luchador</h3></div><div class="form-grid"><label>Luchador<select id="exp-luchador"><option value="">Elegir...</option>${estado.roster.slice().sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(w=>`<option value="${w.id}">${esc(w.nombre)}</option>`).join('')}</select></label><label>Temporada<select id="exp-temp"><option value="">Elegir...</option>${estado.temporadas.map(t=>`<option value="${t.id}">${esc(t.id)}</option>`).join('')}</select></label></div><button class="accion" id="exp-agregar">➕ Agregar</button></div>
    <div class="panel"><div class="panel-header"><h3>Seguimiento por temporada</h3><button class="accion" id="exp-guardar-todo">💾 Guardar todo</button></div>
      <div class="controles exp-filtros"><input type="text" id="exp-busqueda" placeholder="Buscar luchador..." value="${esc(busqueda)}"><label>Género<select id="exp-filtro-genero"><option value="todos" ${filtroGenero==='todos'?'selected':''}>Todos</option><option value="Hombre" ${filtroGenero==='Hombre'?'selected':''}>Hombres</option><option value="Mujer" ${filtroGenero==='Mujer'?'selected':''}>Mujeres</option></select></label><label>Show<select id="exp-filtro-show"><option value="todos" ${filtroShow==='todos'?'selected':''}>Todos</option><option value="RAW" ${filtroShow==='RAW'?'selected':''}>RAW</option><option value="SmackDown" ${filtroShow==='SmackDown'?'selected':''}>SmackDown</option><option value="NXT" ${filtroShow==='NXT'?'selected':''}>NXT</option></select></label></div>
      <div class="tabla-scroll"><table><thead><tr>${th('nombre','Luchador')}${th('show','Show actual')}${th('temporada','Temporada')}${th('victorias','V')}${th('derrotas','D')}${th('totalCombates','Total combates')}${th('balance','Balance')}${th('participacion','Participación')}${th('tendencia','Racha / tendencia')}${th('puntos','Puntos')}<th>Acciones</th></tr></thead><tbody>${ordenados.map(d=>`<tr data-exp-nombre="${esc(d.nombre)}"><td>${esc(d.nombre)}</td><td>${chipsShows(d.show)}</td><td>${esc(d.temporada)}</td><td><input type="number" min="0" data-exp-v="${d.indice}" value="${d.calc?.deltas.victorias??0}"></td><td><input type="number" min="0" data-exp-d="${d.indice}" value="${d.calc?.deltas.derrotas??0}"></td><td>${d.calc?d.calc.deltas.victorias+d.calc.deltas.derrotas:'—'}</td><td>${d.balance??'—'}</td><td>${clasificarParticipacion(d.calc?(d.calc.deltas.victorias+d.calc.deltas.derrotas):0)}</td><td>${clasificarTendencia({entradas:[d],victorias:d.calc?.deltas.victorias||0,derrotas:d.calc?.deltas.derrotas||0})}</td><td>${d.calc?.puntosTemporada??'—'}</td><td><button class="accion secundaria" data-exp-del="${d.indice}">🗑️</button></td></tr>`).join('')}</tbody></table></div></div>
    <div class="panel"><h3>Acumulado histórico de Exposición</h3><div class="tabla-scroll"><table><thead><tr>${tha('nombre','Luchador')}${tha('show','Show actual')}${tha('temporadas','Temporadas seguidas')}${tha('victorias','Victorias')}${tha('derrotas','Derrotas')}${tha('totalCombates','Total combates')}${tha('balance','Balance V-D')}${tha('participacion','Participación')}${tha('tendencia','Racha / tendencia')}</tr></thead><tbody>${acumulados.map(r=>`<tr data-exp-nombre="${esc(r.nombre)}"><td>${esc(r.nombre)}</td><td>${chipsShows(r.show)}</td><td>${r.entradas.map(x=>esc(x.temporada)).join(', ')}</td><td>${r.victorias}</td><td>${r.derrotas}</td><td>${r.totalCombates}</td><td>${r.balance}</td><td>${r.participacion}</td><td>${r.tendencia}</td></tr>`).join('')}</tbody></table></div><p class="texto-tenue">La racha exacta combate por combate todavía no existe en los datos. El indicador muestra la tendencia disponible.</p></div>`;

  const guardarCambiosExposicion = () => {
    try {
      ordenados.forEach(d=>{
        const t=obtenerTemporada(estado,d.temporadaId);
        if(!t||t.cerrada) throw new Error(`La temporada ${d.temporadaId} está cerrada.`);
        const inputV=contenedor.querySelector(`[data-exp-v="${d.indice}"]`);
        const inputD=contenedor.querySelector(`[data-exp-d="${d.indice}"]`);
        if(!inputV||!inputD)return;
        const v=Number(inputV.value),der=Number(inputD.value);
        if(!Number.isInteger(v)||v<0||!Number.isInteger(der)||der<0)throw new Error('Victorias y derrotas deben ser enteros no negativos.');
        const prevR=t.anterior?obtenerRegistro(obtenerTemporada(estado,t.anterior),d.luchadorId):null;
        actualizarAcumulados(estado,t.id,d.luchadorId,{victoriasAcum:(prevR?.victoriasAcum??0)+v,derrotasAcum:(prevR?.derrotasAcum??0)+der});
      });
      exposicionCambiosPendientes=false;
      guardarRapidoExposicion=null;
      guardarYRefrescar();
    } catch(e){alert(e.message);}
  };
  guardarRapidoExposicion=guardarCambiosExposicion;

  contenedor.querySelector('#exp-agregar').onclick=()=>{try{if(exposicionCambiosPendientes) guardarCambiosExposicion(); if(!document.querySelector('#vista-exposicion.is-active'))return; agregarExposicion(estado,contenedor.querySelector('#exp-luchador').value,contenedor.querySelector('#exp-temp').value);guardarYRefrescar();}catch(e){alert(e.message);}};
  contenedor.querySelector('#exp-guardar-todo').onclick=guardarCambiosExposicion;
  const aplicarBusquedaExposicion = () => {
    const termino = filtrosExposicion.busqueda.trim().toLocaleLowerCase();
    contenedor.querySelectorAll('tr[data-exp-nombre]').forEach(fila => {
      const nombre = String(fila.dataset.expNombre || '').toLocaleLowerCase();
      fila.hidden = !!termino && !nombre.includes(termino);
    });
  };
  contenedor.querySelector('#exp-busqueda').oninput=e=>{filtrosExposicion.busqueda=e.target.value;aplicarBusquedaExposicion();};
  aplicarBusquedaExposicion();
  contenedor.querySelector('#exp-filtro-genero').onchange=e=>{const valor=e.target.value;if(exposicionCambiosPendientes) guardarCambiosExposicion();if(!document.querySelector('#vista-exposicion.is-active'))return;filtrosExposicion.genero=valor;renderExposicion(estado,contenedor,guardarYRefrescar);};
  contenedor.querySelector('#exp-filtro-show').onchange=e=>{const valor=e.target.value;if(exposicionCambiosPendientes) guardarCambiosExposicion();if(!document.querySelector('#vista-exposicion.is-active'))return;filtrosExposicion.show=valor;renderExposicion(estado,contenedor,guardarYRefrescar);};
  contenedor.querySelectorAll('input[data-exp-v],input[data-exp-d]').forEach(input=>{
    input.addEventListener('input',()=>{exposicionCambiosPendientes=true;});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();guardarCambiosExposicion();}});
  });
  contenedor.querySelectorAll('[data-exp-del]').forEach(b=>b.onclick=()=>{if(confirm('¿Quitar este registro de Exposición? No se borrarán las estadísticas de la temporada.')){if(exposicionCambiosPendientes) guardarCambiosExposicion();if(!document.querySelector('#vista-exposicion.is-active'))return;eliminarExposicion(estado,Number(b.dataset.expDel));guardarYRefrescar();}});
  contenedor.querySelectorAll('[data-exp-sort]').forEach(h=>h.onclick=()=>{const c=h.dataset.expSort;ordenExposicion.dir=ordenExposicion.tabla===c?(ordenExposicion.dir==='asc'?'desc':'asc'):'asc';ordenExposicion.tabla=c;renderExposicion(estado,contenedor,guardarYRefrescar);});
  contenedor.querySelectorAll('[data-exp-acum-sort]').forEach(h=>h.onclick=()=>{const c=h.dataset.expAcumSort;ordenExposicionAcum.dir=ordenExposicionAcum.campo===c?(ordenExposicionAcum.dir==='asc'?'desc':'asc'):'asc';ordenExposicionAcum.campo=c;renderExposicion(estado,contenedor,guardarYRefrescar);});
}
function cumpleFiltrosExposicion(estado,d){
  const w=obtenerLuchadorParaHistorial(estado,d.luchadorId??d.id);
  if(!w)return false;
  if(filtrosExposicion.genero!=='todos'&&w.genero!==filtrosExposicion.genero)return false;
  if(filtrosExposicion.show!=='todos'&&!normalizarShows(w.shows??w.show).includes(filtrosExposicion.show))return false;
  if(filtrosExposicion.busqueda.trim()&&!String(w.nombre??'').toLocaleLowerCase().includes(filtrosExposicion.busqueda.trim().toLocaleLowerCase()))return false;
  return true;
}
function ordenarExposicion(lista,o){return lista.slice().sort((a,b)=>compararValores(valorOrdenExposicion(a,o.tabla),valorOrdenExposicion(b,o.tabla),o.dir));}
function valorOrdenExposicion(d,c){if(c==='nombre'||c==='show'||c==='temporada')return c==='show'?normalizarShows(d.show).join(', '):d[c];if(c==='victorias')return d.calc?.deltas.victorias??-Infinity;if(c==='derrotas')return d.calc?.deltas.derrotas??-Infinity;if(c==='totalCombates')return d.calc?(d.calc.deltas.victorias+d.calc.deltas.derrotas):-Infinity;if(c==='balance')return d.balance??-Infinity;if(c==='participacion')return {Poca:1,Media:2,Alta:3,Mucha:4}[clasificarParticipacion(d.calc?(d.calc.deltas.victorias+d.calc.deltas.derrotas):0)];if(c==='tendencia')return clasificarTendencia({entradas:[d],victorias:d.calc?.deltas.victorias||0,derrotas:d.calc?.deltas.derrotas||0});if(c==='puntos')return d.calc?.puntosTemporada??-Infinity;return ''}
function valorOrdenAcum(r,c){if(c==='show')return r.show;if(c==='temporadas')return r.entradas.map(x=>x.temporada).join(', ');return r[c];}
function compararValores(a,b,dir='asc'){let c=typeof a==='string'?String(a??'').localeCompare(String(b??''),'es',{sensitivity:'base'}):(Number(a??-Infinity)-Number(b??-Infinity));return dir==='asc'?c:-c;}
function clasificarParticipacion(total){if(total<=10)return 'Poca';if(total<=30)return 'Media';if(total<=40)return 'Alta';return 'Mucha';}
function clasificarTendencia(r){const balance=(r.victorias||0)-(r.derrotas||0);if(balance<=0)return '🔴 Mala';if(balance===1)return '🟠 Parejo';if(balance<=10)return '🟡 Buena';if(balance<30)return '🟢 Muy bueno';return '🔵 Excelente';}
