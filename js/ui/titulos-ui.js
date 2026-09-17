let campeonatoSeleccionado = null;

function renderTitulos(estado, contenedor, guardarYRefrescar) {
  asegurarColumnasTemporadasTitulosUI(estado);
  const titulos = listarCampeonatos(estado);
  if (!titulos.includes(campeonatoSeleccionado)) campeonatoSeleccionado = titulos[0] || null;
  contenedor.innerHTML = `
    <h2>🏆 Títulos</h2>
    <div class="panel">
      <div class="panel-header"><h3>Campeonatos de mi Universo</h3></div>
      <p class="texto-tenue">El historial de títulos es la fuente de los conteos de campeonatos usados por Temporadas.</p>
      <div id="lista-titulos"></div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Campeones actuales — vida real</h3></div>
      <p class="texto-tenue">Referencia independiente. Esta información es de solo lectura y no modifica ningún dato de tu Universo.</p>
      <div id="campeones-reales"></div>
    </div>`;
  renderListaTitulos(estado, contenedor, guardarYRefrescar);
  renderCampeonesReales(estado, contenedor);
}

function obtenerColumnasTemporadaTitulos(estado, t) {
  const columnas = new Set((estado.temporadas || []).map(x => String(x.id).toLowerCase()));
  for (const fila of t?.historial || []) Object.keys(fila).filter(k => /^wm/i.test(k)).forEach(k => columnas.add(k.toLowerCase()));
  return [...columnas].sort((a,b) => {
    const na=parseInt(a.replace(/\D/g,''),10), nb=parseInt(b.replace(/\D/g,''),10);
    if(!Number.isNaN(na)&&!Number.isNaN(nb)) return na-nb;
    return a.localeCompare(b,'es');
  });
}

function asegurarColumnasTemporadasTitulosUI(estado) {
  for (const t of estado.titulosHistorial || []) {
    for (const temporada of estado.temporadas || []) {
      const clave=String(temporada.id).toLowerCase();
      for (const fila of t.historial || []) if (!Object.keys(fila).some(k=>k.toLowerCase()===clave)) fila[clave]=null;
    }
  }
}

function renderListaTitulos(estado, contenedor, guardarYRefrescar) {
  const z=contenedor.querySelector('#lista-titulos');
  if(!estado.titulosHistorial.length){z.innerHTML='<p class="texto-tenue">No hay campeonatos.</p>';return;}
  const t=estado.titulosHistorial.find(x=>x.campeonato===campeonatoSeleccionado);
  const cols=obtenerColumnasTemporadaTitulos(estado,t);
  z.innerHTML=`<div class="controles">
    <label>Campeonato<select id="titulo-selector">${listarCampeonatos(estado).map(c=>`<option value="${esc(c)}" ${c===campeonatoSeleccionado?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
    <button class="accion" id="titulo-add-luchador">➕ Agregar luchador</button>
    <button class="accion" id="titulo-save-all">💾 Guardar todo</button>
  </div><div id="titulo-historial"></div>`;
  z.querySelector('#titulo-selector').onchange=e=>{campeonatoSeleccionado=e.target.value;renderListaTitulos(estado,contenedor,guardarYRefrescar);};
  if(!t)return;
  const historial=t.historial||[];
  const th=(campo,label)=>`<th data-titulo-sort="${campo}">${label}</th>`;
  z.querySelector('#titulo-historial').innerHTML=`<div class="panel-header"><strong>${esc(t.campeonato)}</strong><span><button class="accion secundaria" id="editar-titulo">✏️ Renombrar</button> <button class="accion secundaria" id="eliminar-titulo">🗑️ Eliminar</button></span></div>
  <div class="tabla-scroll"><table><thead><tr>${th('nombre','Luchador')}${th('titulosJuego','Títulos del juego')}${cols.map(c=>th(c,c.toUpperCase())).join('')}${th('totalUniverso','Total Universo')}<th>Acción</th></tr></thead><tbody>
  ${historial.map((f,i)=>`<tr data-title-row="${i}"><td><input type="text" data-hn="${i}" value="${esc(f.nombre)}"></td><td><input type="number" min="0" data-ht="${i}" value="${f.titulosJuego??''}"></td>${cols.map(c=>{const k=Object.keys(f).find(x=>x.toLowerCase()===c);return `<td><input type="number" min="0" data-hc="${i}" data-col="${k||c}" value="${f[k||c]??''}"></td>`}).join('')}<td class="total-universo"><strong>${calcularTotalFilaTitulo(f,cols)}</strong></td><td><button class="accion secundaria" data-hdel="${i}" title="Eliminar registro">🗑️</button></td></tr>`).join('')}</tbody></table></div>`;

  z.querySelector('#editar-titulo').onclick=()=>mostrarFormTitulo(estado,contenedor,guardarYRefrescar,t.campeonato);
  z.querySelector('#eliminar-titulo').onclick=()=>{if(confirm(`¿Eliminar el campeonato "${t.campeonato}"? También se quitará su registro de campeones actuales, pero no se tocarán otros títulos.`)){eliminarTitulo(estado,t.campeonato);campeonatoSeleccionado=null;guardarYRefrescar();}};
  z.querySelector('#titulo-add-luchador').onclick=()=>mostrarFormAgregarLuchadorTitulo(estado,contenedor,guardarYRefrescar);
  z.querySelector('#titulo-save-all').onclick=()=>{
    try {
      z.querySelectorAll('tbody tr').forEach(tr=>{
        const i=Number(tr.dataset.titleRow), fila=t.historial[i]; if(!fila)return;
        fila.nombre=tr.querySelector(`[data-hn="${i}"]`).value.trim();
        fila.titulosJuego=tr.querySelector(`[data-ht="${i}"]`).value===''?null:Number(tr.querySelector(`[data-ht="${i}"]`).value);
        tr.querySelectorAll('[data-hc]').forEach(inp=>fila[inp.dataset.col]=inp.value===''?null:Number(inp.value));
      });
      guardarYRefrescar();
    } catch(e){alert(e.message);}
  };
  z.querySelectorAll('[data-hdel]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.hdel);if(confirm('¿Eliminar este registro del historial del campeonato?')){t.historial.splice(i,1);guardarYRefrescar();}});
  z.querySelectorAll('[data-hc]').forEach(inp=>inp.addEventListener('input',()=>{const tr=inp.closest('tr'),total=tr.querySelector('.total-universo strong');if(total)total.textContent=calcularTotalInputsFila(tr); }));
  z.querySelectorAll('[data-titulo-sort]').forEach(h=>h.onclick=()=>{const campo=h.dataset.tituloSort;const rows=[...z.querySelectorAll('tbody tr')];rows.sort((a,b)=>{let va=campo==='nombre'?a.querySelector('[data-hn]')?.value:(campo==='titulosJuego'?a.querySelector('[data-ht]')?.value:campo==='totalUniverso'?a.querySelector('.total-universo')?.textContent:a.querySelector(`[data-col="${campo}"]`)?.value);let vb=campo==='nombre'?b.querySelector('[data-hn]')?.value:(campo==='titulosJuego'?b.querySelector('[data-ht]')?.value:campo==='totalUniverso'?b.querySelector('.total-universo')?.textContent:b.querySelector(`[data-col="${campo}"]`)?.value);const na=Number(va),nb=Number(vb);return (Number.isFinite(na)&&Number.isFinite(nb)?na-nb:String(va??'').localeCompare(String(vb??''),'es',{sensitivity:'base'}));});const body=z.querySelector('tbody');rows.forEach(r=>body.appendChild(r));});
}

function calcularTotalFilaTitulo(fila,cols){return cols.reduce((a,c)=>{const k=Object.keys(fila).find(x=>x.toLowerCase()===c);return a+Number(fila[k]||0);},0);}
function calcularTotalInputsFila(tr){return [...tr.querySelectorAll('[data-hc]')].reduce((a,i)=>a+Number(i.value||0),0);}
function sugerirSiguienteTemporadaTitulo(estado){const ids=(estado.temporadas||[]).map(t=>parseInt(String(t.id).replace(/\D/g,''),10)).filter(Number.isFinite);return `WM${(ids.length?Math.max(...ids):1)+1}`;}

function mostrarFormAgregarLuchadorTitulo(estado,contenedor,guardarYRefrescar){
  const z=contenedor.querySelector('#lista-titulos');
  const t=estado.titulosHistorial.find(x=>x.campeonato===campeonatoSeleccionado); if(!t)return;
  const cols=obtenerColumnasTemporadaTitulos(estado,t);
  const usados=new Set((t.historial||[]).map(f=>claveNombreTitulo(f.nombre)));
  const opciones=estado.roster.filter(w=>!usados.has(claveNombreTitulo(w.nombre))).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  z.innerHTML=`<div class="panel"><h3>Agregar luchador al historial de ${esc(t.campeonato)}</h3><label>Luchador<select id="th-luchador"><option value="">Elegir...</option>${opciones.map(w=>`<option value="${esc(w.id)}">${esc(w.nombre)}</option>`).join('')}</select></label><br><button class="accion" id="th-ok">Agregar</button> <button class="accion secundaria" id="th-cancel">Cancelar</button></div>`;
  z.querySelector('#th-cancel').onclick=()=>renderListaTitulos(estado,contenedor,guardarYRefrescar);
  z.querySelector('#th-ok').onclick=()=>{const id=z.querySelector('#th-luchador').value,w=estado.roster.find(x=>x.id===id);if(!w)return alert('Elegí un luchador.');t.historial.push({nombre:w.nombre,titulosJuego:null,...Object.fromEntries(cols.map(c=>[c,null]))});guardarYRefrescar();};
}

function mostrarFormTitulo(estado,contenedor,guardarYRefrescar,original=null){
 const z=contenedor.querySelector('#lista-titulos');z.innerHTML=`<div class="panel"><h3>${original?'Editar campeonato':'Nuevo campeonato'}</h3><label>Nombre<input id="titulo-nombre" value="${esc(original||'')}" /></label><br><button class="accion" id="titulo-ok">Guardar</button> <button class="accion secundaria" id="titulo-cancel">Cancelar</button></div>`;
 z.querySelector('#titulo-cancel').onclick=()=>renderTitulos(estado,contenedor,guardarYRefrescar);
 z.querySelector('#titulo-ok').onclick=()=>{try{const n=z.querySelector('#titulo-nombre').value.trim();if(original)editarTitulo(estado,original,n);else agregarTitulo(estado,{campeonato:n});campeonatoSeleccionado=n;guardarYRefrescar();}catch(e){alert(e.message);}};
}

function renderCampeonesReales(estado,contenedor){
 const z=contenedor.querySelector('#campeones-reales');
 z.innerHTML=`<div class="tabla-scroll"><table><thead><tr><th>Show</th><th>Campeonato</th><th>Campeón actual</th></tr></thead><tbody>${estado.campeonesActuales.map(c=>`<tr><td>${esc(c.show)}</td><td>${esc(c.campeonato)}</td><td>${esc(c.campeonActual)}</td></tr>`).join('')}</tbody></table></div>`;
}
