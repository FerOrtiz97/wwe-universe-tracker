let luchadorHistorialSeleccionado = null;
function idsConHistorial(estado){
 const ids=new Set(estado.roster.map(w=>w.id));
 estado.temporadas.forEach(t=>t.registros.forEach(r=>{if(r.luchadorId)ids.add(r.luchadorId);}));
 return [...ids];
}
function renderHistorial(estado,contenedor){
 const ids=idsConHistorial(estado);if(!ids.includes(luchadorHistorialSeleccionado))luchadorHistorialSeleccionado=ids[0]||null;
 contenedor.innerHTML=`<h2>📈 Historial por luchador</h2><div class="controles"><select id="historial-selector">${ids.map(id=>{const w=obtenerLuchadorParaHistorial(estado,id);return `<option value="${id}" ${id===luchadorHistorialSeleccionado?'selected':''}>${esc(w.nombre)}${w.eliminado?' (eliminado del roster)':''}</option>`}).join('')}</select></div><div id="historial-contenido"></div>`;
 contenedor.querySelector('#historial-selector')?.addEventListener('change',e=>{luchadorHistorialSeleccionado=e.target.value;renderHistorial(estado,contenedor);});
 const z=contenedor.querySelector('#historial-contenido'),w=obtenerLuchadorParaHistorial(estado,luchadorHistorialSeleccionado),evolucion=historialLuchador(estado,luchadorHistorialSeleccionado);
 if(!w){z.innerHTML='<p class="texto-tenue">No hay luchadores con historial.</p>';return;}
 if(!evolucion.length){z.innerHTML=`<p class="texto-tenue">${esc(w.nombre)} todavía no tiene temporadas registradas.</p>`;return;}
 z.innerHTML=`<div class="panel"><h3>${esc(w.nombre)} ${w.eliminado?'':' '+chipsShows(w.shows)}</h3><p class="texto-tenue">Overall Base: <strong>${w.overallBase??'—'}</strong> · Overall Actual: <strong>${w.overallActual??'—'}</strong></p></div><div class="tabla-scroll"><table><thead><tr><th>Temporada</th><th>Overall inicial</th><th>Overall final</th><th>Puntos temporada</th><th>Puntos acumulados</th><th>Interpretación</th></tr></thead><tbody>${evolucion.map(r=>`<tr><td><strong>${esc(r.temporadaId)}</strong></td><td>${r.overallInicial??'—'}</td><td>${r.overallFinal??`<span class="texto-tenue">sugerido: ${r.overallSugerido??'—'}</span>`}</td><td>${r.puntosTemporada??'—'}</td><td>${r.puntosAcumulados??'—'}</td><td>${r.interpretacion??'—'}</td></tr>`).join('')}</tbody></table></div>`;
}
