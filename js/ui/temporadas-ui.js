let temporadaSeleccionada = null;
let ordenTemporada = { campo: "nombre", dir: "asc" };
let filtrosTemporada = { busqueda: "", show: "todos", genero: "todos" };

function renderTemporadas(estado, contenedor, guardarYRefrescar) {
  if (!temporadaSeleccionada || !obtenerTemporada(estado, temporadaSeleccionada)) temporadaSeleccionada = estado.config.temporadaActualId;
  const t = obtenerTemporada(estado, temporadaSeleccionada);
  contenedor.innerHTML = `<h2>📅 Temporadas</h2>
    <div class="controles">
      <label>Temporada<select id="temp-selector">${estado.temporadas.map(x=>`<option value="${esc(x.id)}" ${x.id===temporadaSeleccionada?'selected':''}>${esc(x.id)} ${x.cerrada?'🔒':'🟢'}</option>`).join('')}</select></label>
      <button class="accion" id="temp-nueva">➕ Nueva</button>
      ${t?`<button class="accion secundaria" id="temp-editar">✏️ Editar</button>${t.cerrada?'<button class="accion secundaria" id="temp-reabrir">🔓 Reabrir</button>':'<button class="accion secundaria" id="temp-cerrar">🔒 Cerrar</button>'}<button class="accion secundaria" id="temp-reset">♻️ Resetear</button><button class="accion peligro" id="temp-eliminar">🗑️ Eliminar</button>`:''}
    </div>
    ${t?`<div class="panel estado-temporada"><strong>${esc(t.id)}</strong> — ${t.cerrada?'🔒 Cerrada':'🟢 Abierta'} · ${t.registros.length} registros${t.anterior?` · anterior: ${esc(t.anterior)}`:''}<p class="texto-tenue">Cerrar bloquea los datos de la temporada. Reabrir permite editarlos nuevamente.</p></div>`:'<p class="texto-tenue">No hay temporadas.</p>'}
    ${t?`<div class="controles controles-principales"><input type="text" id="temp-busqueda" placeholder="Buscar luchador..." value="${esc(filtrosTemporada.busqueda)}" /><label>Género<select id="temp-filtro-genero"><option value="todos">Todos</option><option value="Mujer">Mujer</option><option value="Hombre">Hombre</option></select></label><label>Show / estado<select id="temp-filtro-show"><option value="todos">Todos</option><option value="RAW">RAW</option><option value="SmackDown">SmackDown</option><option value="NXT">NXT</option><option value="Retirado">Retirado</option></select></label></div>`:''}
    <div id="temp-tabla"></div>`;
  contenedor.querySelector('#temp-selector')?.addEventListener('change',e=>{temporadaSeleccionada=e.target.value;renderTemporadas(estado,contenedor,guardarYRefrescar);});
  contenedor.querySelector('#temp-filtro-genero')?.addEventListener('change',e=>{filtrosTemporada.genero=e.target.value;renderTablaTemporada(estado,contenedor,guardarYRefrescar,t);});
  contenedor.querySelector('#temp-filtro-show')?.addEventListener('change',e=>{filtrosTemporada.show=e.target.value;renderTablaTemporada(estado,contenedor,guardarYRefrescar,t);});
  contenedor.querySelector('#temp-busqueda')?.addEventListener('input',e=>{filtrosTemporada.busqueda=e.target.value;actualizarTablaTemporada(estado,contenedor,guardarYRefrescar,t);});
  if(t){contenedor.querySelector('#temp-filtro-genero').value=filtrosTemporada.genero;contenedor.querySelector('#temp-filtro-show').value=filtrosTemporada.show;}
  contenedor.querySelector('#temp-nueva')?.addEventListener('click',()=>mostrarNuevaTemporada(estado,contenedor,guardarYRefrescar));
  contenedor.querySelector('#temp-editar')?.addEventListener('click',()=>mostrarEditarTemporada(estado,contenedor,guardarYRefrescar,t.id));
  contenedor.querySelector('#temp-cerrar')?.addEventListener('click',()=>{if(confirm(`¿Cerrar ${t.id}? Sus acumulados quedarán bloqueados.`)){cerrarTemporada(estado,t.id);guardarYRefrescar();}});
  contenedor.querySelector('#temp-reabrir')?.addEventListener('click',()=>{if(confirm(`PARAAAA. ${t.id} está cerrada. ¿Seguro que querés volver a abrirla?`)){reabrirTemporada(estado,t.id);guardarYRefrescar();}});
  contenedor.querySelector('#temp-reset')?.addEventListener('click',()=>resetConAdvertencia(estado,contenedor,guardarYRefrescar,t));
  contenedor.querySelector('#temp-eliminar')?.addEventListener('click',()=>eliminarConAdvertencia(estado,guardarYRefrescar,t));
  renderTablaTemporada(estado,contenedor,guardarYRefrescar,t);
}

function resetConAdvertencia(estado,contenedor,guardarYRefrescar,t){
 const posteriores=temporadasPosteriores(estado,t.id);
 const extra=posteriores.length?`\n\n⚠️ OJO: ${posteriores.map(x=>x.id).join(', ')} dependen de esta temporada y sus cálculos pueden cambiar.`:'';
 if(confirm(`¿ESTÁS SEGURO, FLACO? Vas a resetear ${t.id}. Se borrarán sus registros y quedará abierta.${extra}`)){resetearTemporada(estado,t.id);guardarYRefrescar();}
}
function eliminarConAdvertencia(estado,guardarYRefrescar,t){
 const posteriores=temporadasPosteriores(estado,t.id);
 if(posteriores.length){alert(`No puedo eliminar ${t.id} sin modificar silenciosamente temporadas posteriores.\n\nDependientes: ${posteriores.map(x=>x.id).join(', ')}.\n\nPrimero eliminá o reconfigurá esas temporadas.`);return;}
 const anteriores=estado.temporadas.filter(x=>x.anterior===t.id); // normalmente ninguno por la comprobación anterior
 if(confirm(`¿ELIMINAR ${t.id}? Esta acción no se puede deshacer. Sus registros dejarán de existir en el estado de la app.`)){eliminarTemporada(estado,t.id);temporadaSeleccionada=estado.config.temporadaActualId;guardarYRefrescar();}
}
function renderTablaTemporada(estado,contenedor,guardarYRefrescar,t){
 const z=contenedor.querySelector('#temp-tabla'); if(!t){z.innerHTML='';return;}
 estadoGlobalTemporal = estado;
 const ids=new Set(t.registros.map(r=>r.luchadorId));
 let luchadores=estado.roster.filter(w=>!normalizarShows(w.shows??w.show).includes('Retirado')||ids.has(w.id));
 if(filtrosTemporada.show!=='todos') luchadores=luchadores.filter(w=>normalizarShows(w.shows??w.show).includes(filtrosTemporada.show));
 if(filtrosTemporada.genero!=='todos') luchadores=luchadores.filter(w=>w.genero===filtrosTemporada.genero);
 if(filtrosTemporada.busqueda.trim()) luchadores=luchadores.filter(w=>String(w.nombre??'').toLowerCase().includes(filtrosTemporada.busqueda.trim().toLowerCase()));
 luchadores.sort((a,b)=>compararTemporada(a,b,t,ordenTemporada));
 const th=(campo,label)=>`<th data-temp-sort="${campo}">${label}${ordenTemporada.campo===campo?(ordenTemporada.dir==='asc'?' ▲':' ▼'):''}</th>`;
 z.innerHTML=`<div class="tabla-scroll"><table><thead><tr>${th('nombre','Luchador')}${th('victoriasAcum','V. acum.')}${th('derrotasAcum','D. acum.')}${th('titPrincipalesRAWSD_Acum','T. ppal. RAW/SD')}${th('titSecundariosRAWSD_Acum','T. sec. RAW/SD')}${th('titMaxNXT_Acum','T. máx. NXT')}${th('titSecundariosNXT_Acum','T. sec. NXT')}${th('puntosTemporada','Puntos temp.')}${th('puntosAcumulados','Pts. acum.')}${th('overallInicial','Ov. inicial')}${th('overallSugerido','Ov. sugerido')}${th('overallFinal','Ov. final')}${th('interpretacion','Interpretación')}</tr></thead><tbody>${luchadores.map(w=>filaTemporada(estado,t,w)).join('')}</tbody></table></div>`;
 z.querySelectorAll('[data-temp-sort]').forEach(h=>h.onclick=()=>{const c=h.dataset.tempSort;if(ordenTemporada.campo===c)ordenTemporada.dir=ordenTemporada.dir==='asc'?'desc':'asc';else{ordenTemporada.campo=c;ordenTemporada.dir='asc';}renderTablaTemporada(estado,contenedor,guardarYRefrescar,t);});
 conectarEventosFilasTemporada(estado,contenedor,guardarYRefrescar,t);
}
function compararTemporada(a,b,t,o){const ra=obtenerRegistro(t,a.id)||{},rb=obtenerRegistro(t,b.id)||{};const ca=calcularTemporadaLuchador(estadoGlobalTemporal,t.id,a.id);const cb=calcularTemporadaLuchador(estadoGlobalTemporal,t.id,b.id);let va,vb;if(o.campo==='nombre'){va=a.nombre;vb=b.nombre;}else if(['puntosTemporada','puntosAcumulados','overallInicial','overallSugerido','overallFinal','interpretacion','titPrincipalesRAWSD_Acum','titSecundariosRAWSD_Acum','titMaxNXT_Acum','titSecundariosNXT_Acum'].includes(o.campo)){va=ca?.[o.campo]??(o.campo.endsWith('_Acum')?calcularTitulosAcumuladosDesdeHistorial(estadoGlobalTemporal,a.id,t.id)?.[o.campo.replace('_Acum','')]:undefined);vb=cb?.[o.campo]??(o.campo.endsWith('_Acum')?calcularTitulosAcumuladosDesdeHistorial(estadoGlobalTemporal,b.id,t.id)?.[o.campo.replace('_Acum','')]:undefined);}else{va=ra[o.campo];vb=rb[o.campo];}let c=typeof va==='string'?va.localeCompare(String(vb??''),'es',{sensitivity:'base'}):(va??-Infinity)-(vb??-Infinity);return o.dir==='asc'?c:-c;}
// Variable auxiliar para poder reutilizar la función de comparación sin acoplarla al UI.
let estadoGlobalTemporal = null;
function conectarEventosFilasTemporada(estado,contenedor,guardarYRefrescar,t){
 const z=contenedor.querySelector('#temp-tabla'); if(!z||!t||t.cerrada)return;
 z.querySelectorAll('[data-title-edit]').forEach(btn=>btn.addEventListener('click',()=>editarTituloCategoriaDesdeTemporada(estado,t,btn.dataset.titleId,btn.dataset.titleEdit,guardarYRefrescar)));
 z.querySelectorAll('input[data-campo]').forEach(input=>input.addEventListener('change',e=>{try{actualizarAcumulados(estado,t.id,e.target.dataset.id,{[e.target.dataset.campo]:e.target.value===''?null:Number(e.target.value)});guardarYRefrescar();}catch(err){alert(err.message);}}));
 z.querySelectorAll('input[data-overall-final]').forEach(input=>input.addEventListener('change',e=>{try{establecerOverallFinal(estado,t.id,e.target.dataset.overallFinal,e.target.value===''?null:Number(e.target.value));guardarYRefrescar();}catch(err){alert(err.message);}}));
}

function obtenerLuchadoresFiltradosTemporada(estado,t){
 const ids=new Set(t.registros.map(r=>r.luchadorId));
 let luchadores=estado.roster.filter(w=>!normalizarShows(w.shows??w.show).includes('Retirado')||ids.has(w.id));
 if(filtrosTemporada.show!=='todos') luchadores=luchadores.filter(w=>normalizarShows(w.shows??w.show).includes(filtrosTemporada.show));
 if(filtrosTemporada.genero!=='todos') luchadores=luchadores.filter(w=>w.genero===filtrosTemporada.genero);
 if(filtrosTemporada.busqueda.trim()) luchadores=luchadores.filter(w=>String(w.nombre??'').toLowerCase().includes(filtrosTemporada.busqueda.trim().toLowerCase()));
 luchadores.sort((a,b)=>compararTemporada(a,b,t,ordenTemporada));
 return luchadores;
}
function actualizarTablaTemporada(estado,contenedor,guardarYRefrescar,t){
 const z=contenedor.querySelector('#temp-tabla'); if(!z||!t)return;
 const filas=obtenerLuchadoresFiltradosTemporada(estado,t);
 const tbody=z.querySelector('tbody'); if(tbody) tbody.innerHTML=filas.map(w=>filaTemporada(estado,t,w)).join('');
 conectarEventosFilasTemporada(estado,contenedor,guardarYRefrescar,t);
}

function filaTemporada(estado,t,w){
 const r=obtenerRegistro(t,w.id)||{}, calc=calcularTemporadaLuchador(estado,t.id,w.id), disabled=t.cerrada?'disabled':'';
 const input=c=>`<input type="number" ${disabled} data-id="${w.id}" data-campo="${c}" value="${r[c]??''}" />`;
 const tit=typeof calcularTitulosAcumuladosDesdeHistorial==='function'?calcularTitulosAcumuladosDesdeHistorial(estado,w.id,t.id):null;
 return `<tr class="${claseFila(w.shows)}"><td>${esc(w.nombre)}</td><td>${input('victoriasAcum')}</td><td>${input('derrotasAcum')}</td><td><button class="dato-titulo" data-title-edit="titPrincipalesRAWSD" data-title-id="${w.id}" ${disabled}>${tit?.titPrincipalesRAWSD??'—'}</button></td><td><button class="dato-titulo" data-title-edit="titSecundariosRAWSD" data-title-id="${w.id}" ${disabled}>${tit?.titSecundariosRAWSD??'—'}</button></td><td><button class="dato-titulo" data-title-edit="titMaxNXT" data-title-id="${w.id}" ${disabled}>${tit?.titMaxNXT??'—'}</button></td><td><button class="dato-titulo" data-title-edit="titSecundariosNXT" data-title-id="${w.id}" ${disabled}>${tit?.titSecundariosNXT??'—'}</button></td><td>${calc?.puntosTemporada??'—'}</td><td>${calc?.puntosAcumulados??'—'}</td><td>${calc?.overallInicial??'—'}</td><td><strong>${calc?.overallSugerido??'—'}</strong></td><td><input type="number" ${disabled} data-overall-final="${w.id}" value="${r.overallFinal??''}" /></td><td>${calc?.interpretacion??'—'}</td></tr>`;
}

function mostrarNuevaTemporada(estado,contenedor,guardarYRefrescar){const sugerida=sugerirSiguienteId(estado);const id=prompt(`Nombre de la nueva temporada:`,sugerida);if(!id)return;const anterior=temporadaSeleccionada||estado.config.temporadaActualId;try{crearNuevaTemporada(estado,id.trim(),anterior);temporadaSeleccionada=id.trim();guardarYRefrescar();}catch(e){alert(e.message);}}
function mostrarEditarTemporada(estado,contenedor,guardarYRefrescar,id){const t=obtenerTemporada(estado,id);const nuevoId=prompt(`Nombre de ${id}:`,id);if(nuevoId===null)return;const anterior=prompt(`Temporada anterior de ${nuevoId}:`,t.anterior||'');if(anterior===null)return;const posteriores=temporadasPosteriores(estado,id);if(posteriores.length&&nuevoId.trim()!==id){alert(`Esta temporada tiene dependientes (${posteriores.map(x=>x.id).join(', ')}). El renombrado actualizará sus referencias.`);}try{editarTemporada(estado,id,{id:nuevoId.trim(),anterior:anterior.trim()||null});temporadaSeleccionada=nuevoId.trim();guardarYRefrescar();}catch(e){alert(e.message);}}
function sugerirSiguienteId(estado){const actual=estado.config.temporadaActualId;if(!actual)return'WM2';const n=parseInt(String(actual).replace(/\D/g,''),10);return Number.isNaN(n)?'WM_nueva':`WM${n+1}`;}

function editarTituloCategoriaDesdeTemporada(estado, temporada, luchadorId, categoria, guardarYRefrescar){
 const nombres={titPrincipalesRAWSD:'T. ppal. RAW/SD',titSecundariosRAWSD:'T. sec. RAW/SD',titMaxNXT:'T. máx. NXT',titSecundariosNXT:'T. sec. NXT'};
 const titulos=(estado.titulosHistorial||[]).filter(t=>categoriaCampeonato(t.campeonato)===categoria);
 if(!titulos.length){alert('No hay campeonatos configurados para esta categoría.');return;}
 const opciones=titulos.map((t,i)=>`${i+1}. ${t.campeonato}`).join('\n');
 const eleccion=prompt(`Editar ${nombres[categoria]} de ${nombreLuchadorPorId(estado,luchadorId)} en ${temporada.id}.\n\nElegí el campeonato que corresponde al cambio:\n${opciones}\n\nNúmero del campeonato:`);
 const idx=Number(eleccion)-1, titulo=titulos[idx]; if(!titulo)return;
 const anteriorId=temporada.anterior; const prev=calcularTitulosAcumuladosDesdeHistorial(estado,luchadorId,anteriorId||temporada.id); const actual=calcularTitulosAcumuladosDesdeHistorial(estado,luchadorId,temporada.id);
 const valor=prompt(`Cantidad ACUMULADA de ${nombres[categoria]} que querés para ${temporada.id}:`,String(actual[categoria]??0)); if(valor===null)return;
 const deseado=Number(valor); if(!Number.isFinite(deseado)||deseado<0){alert('Cantidad inválida.');return;}
 const deltaNecesario=deseado-(prev[categoria]||0);
 const fila=titulo.historial.find(f=>claveNombreTitulo(f.nombre)===claveNombreTitulo(nombreLuchadorPorId(estado,luchadorId)));
 if(!fila){alert('Ese luchador todavía no está en el historial de ese campeonato. Agregalo desde Títulos primero.');return;}
 const clave=Object.keys(fila).find(k=>k.toLowerCase()===temporada.id.toLowerCase())||temporada.id.toLowerCase();
 if(deltaNecesario<0){alert('Para reducir un acumulado, primero revisá los reinados de temporadas anteriores desde Títulos.');return;}
 fila[clave]=deltaNecesario;
 guardarYRefrescar();
}
