// =========================================================================
// dashboard-ui.js
// -------------------------------------------------------------------------
// Cada archivo de js/ui/ tiene una función renderX(estado, contenedor) que:
//   1) calcula qué necesita mostrar (llamando a funciones de js/logic/),
//   2) construye un string de HTML con esos datos,
//   3) lo escribe dentro de `contenedor.innerHTML`.
//
// Usamos "template strings" (los textos entre comillas invertidas `...`,
// que permiten poner ${variables} adentro) porque es la forma más simple
// de generar HTML dinámico sin aprender una librería nueva.
// =========================================================================

function renderDashboard(estado, contenedor) {
  const resumen = resumenRoster(estado);
  const porShowGenero = resumenPorShowYGenero(estado);
  const temporadaActual = estado.config.temporadaActualId;

  contenedor.innerHTML = `
    <h2>📊 Dashboard</h2>

    <div class="tarjetas">
      <div class="tarjeta">
        <div class="etiqueta">👥 Total de luchadores</div>
        <div class="valor">${resumen.total}</div>
      </div>
      <div class="tarjeta raw">
        <div class="etiqueta">🔴 RAW</div>
        <div class="valor">${resumen.porShow.RAW}</div>
      </div>
      <div class="tarjeta smackdown">
        <div class="etiqueta">🔵 SmackDown</div>
        <div class="valor">${resumen.porShow.SmackDown}</div>
      </div>
      <div class="tarjeta nxt">
        <div class="etiqueta">🟡 NXT</div>
        <div class="valor">${resumen.porShow.NXT}</div>
      </div>
      <div class="tarjeta retirado">
        <div class="etiqueta">🏆 Retirados</div>
        <div class="valor">${resumen.porShow.Retirado}</div>
      </div>
      <div class="tarjeta">
        <div class="etiqueta">⭐ Overall promedio</div>
        <div class="valor">${formatearNumero(resumen.overallPromedio)}</div>
      </div>
      <div class="tarjeta">
        <div class="etiqueta">🎂 Edad promedio</div>
        <div class="valor">${formatearNumero(resumen.edadPromedio)}</div>
      </div>
      <div class="tarjeta">
        <div class="etiqueta">📅 Temporada actual</div>
        <div class="valor">${temporadaActual || "—"}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h3>Distribución por género y show</h3>
        <div class="grafico-barras">
          ${porShowGenero.map(filaGeneroShow).join("")}
        </div>
      </div>

      <div class="panel">
        <h3>Distribución de Overall</h3>
        <div class="grafico-barras">
          ${graficoDistribucionOverall(estado)}
        </div>
      </div>
    </div>

    <div class="panel">
      <h3>Distribución de género — total del roster</h3>
      <div class="grafico-barras">
        <div class="barra-fila">
          <span>♀️ Mujeres</span>
          <div class="barra-pista">
            <div class="barra-relleno" style="width:${resumen.porcentajeMujeres || 0}%; background:#e879a6;"></div>
          </div>
          <span>${resumen.porcentajeMujeres ?? "—"}%</span>
        </div>
        <div class="barra-fila">
          <span>♂️ Hombres</span>
          <div class="barra-pista">
            <div class="barra-relleno" style="width:${resumen.porcentajeHombres || 0}%; background:#5b9bd5;"></div>
          </div>
          <span>${resumen.porcentajeHombres ?? "—"}%</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * formatearNumero: redondea a 1 decimal y muestra "—" si el valor es
 * null (por ejemplo, si todavía no hay ningún luchador cargado).
 */
function formatearNumero(valor) {
  if (valor === null || valor === undefined) return "—";
  return Math.round(valor * 10) / 10;
}

/**
 * filaGeneroShow: una fila del gráfico de barras "género por show". Cada
 * barra se divide en dos colores (mujeres/hombres) usando un gradiente
 * lineal de CSS calculado con el porcentaje real.
 */
function filaGeneroShow(fila) {
  const pctMujeres = fila.porcentajeMujeres ?? 0;
  return `
    <div class="barra-fila">
      <span>${etiquetaShow(fila.show)}</span>
      <div class="barra-pista">
        <div class="barra-relleno" style="width:100%; background: linear-gradient(
          to right, #e879a6 0%, #e879a6 ${pctMujeres}%, #5b9bd5 ${pctMujeres}%, #5b9bd5 100%);"></div>
      </div>
      <span>${fila.total}</span>
    </div>
  `;
}

function etiquetaShow(show) {
  const iconos = { RAW: "🔴 RAW", SmackDown: "🔵 SmackDown", NXT: "🟡 NXT", Retirado: "🏆 Retirados" };
  return iconos[show] || show;
}

/**
 * graficoDistribucionOverall: agrupa a los luchadores en franjas de 5
 * puntos de Overall (60-64, 65-69, ...) y dibuja una barra por franja.
 * Es un histograma simple, hecho a mano con Math.floor().
 */
function graficoDistribucionOverall(estado) {
  const franjas = {};
  for (const w of estado.roster) {
    if (w.overallActual === null || w.overallActual === undefined) continue;
    const inicio = Math.floor(w.overallActual / 5) * 5;
    const clave = `${inicio}-${inicio + 4}`;
    franjas[clave] = (franjas[clave] || 0) + 1;
  }
  const claves = Object.keys(franjas).sort((a, b) => parseInt(a) - parseInt(b));
  const maximo = Math.max(...Object.values(franjas), 1);

  return claves
    .map((clave) => {
      const cantidad = franjas[clave];
      const ancho = Math.round((cantidad / maximo) * 100);
      return `
        <div class="barra-fila">
          <span>${clave}</span>
          <div class="barra-pista">
            <div class="barra-relleno" style="width:${ancho}%; background: var(--color-acento);"></div>
          </div>
          <span>${cantidad}</span>
        </div>
      `;
    })
    .join("");
}
