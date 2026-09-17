// =========================================================================
// main.js
// -------------------------------------------------------------------------
// Este es el primer archivo que "hace algo" cuando abrís la página (los
// anteriores solo definían funciones, pero no las ejecutaban todavía).
//
// Acá:
//   1) cargamos el estado (desde localStorage, o desde el Excel si es la
//      primera vez);
//   2) dibujamos la vista inicial (Dashboard);
//   3) conectamos los botones de navegación y de exportar/importar.
// =========================================================================

// `estado` es UNA sola variable que vive durante toda la sesión de la
// página. Todas las funciones de este archivo la leen y la modifican
// directamente (en JavaScript, los objetos se pasan "por referencia": si
// una función de logic/ le cambia un campo, el cambio ya está reflejado
// en esta misma variable, no hace falta que la función "devuelva" un
// estado nuevo).
let estado = cargarEstado();

// Diccionario: nombre de vista -> función que la dibuja. Lo usamos para no
// tener que escribir un if/else gigante cada vez que cambiás de pestaña.
const RENDERIZADORES = {
  dashboard: (contenedor) => renderDashboard(estado, contenedor),
  roster: (contenedor) => renderRoster(estado, contenedor, guardarYRefrescar),
  temporadas: (contenedor) => renderTemporadas(estado, contenedor, guardarYRefrescar),
  historial: (contenedor) => renderHistorial(estado, contenedor),
  titulos: (contenedor) => renderTitulos(estado, contenedor, guardarYRefrescar),
  comparacion: (contenedor) => renderComparacion(estado, contenedor),
  exposicion: (contenedor) => renderExposicion(estado, contenedor, guardarYRefrescar),
  "editor-overall": (contenedor) => renderEditorOverall(estado, contenedor, guardarYRefrescar),
};

let vistaActual = "dashboard";

/**
 * mostrarVista: oculta todas las <section class="vista"> y muestra solo
 * la que corresponde, además de resaltar el botón de navegación activo.
 */
function mostrarVista(nombreVista) {
  vistaActual = nombreVista;

  document.querySelectorAll(".vista").forEach((seccion) => {
    seccion.classList.toggle("is-active", seccion.id === `vista-${nombreVista}`);
  });
  document.querySelectorAll(".tab-btn").forEach((boton) => {
    boton.classList.toggle("is-active", boton.dataset.vista === nombreVista);
  });

  const contenedor = document.querySelector(`#vista-${nombreVista}`);
  RENDERIZADORES[nombreVista](contenedor);
}

/**
 * guardarYRefrescar: la función "puente" entre la lógica y la pantalla.
 * Los módulos de ui/ la reciben como parámetro y la llaman después de
 * cualquier cambio (agregar un luchador, cargar un dato de temporada,
 * etc.). Ella se encarga de:
 *   1) guardar el estado actualizado en localStorage,
 *   2) volver a dibujar la vista actual para que se vea el cambio,
 *   3) mostrar un pequeño aviso ("Guardado ✓") en pantalla.
 */
function guardarYRefrescar() {
  guardarEstado(estado);
  RENDERIZADORES[vistaActual](document.querySelector(`#vista-${vistaActual}`));
  mostrarToast("Guardado ✓");
}

let temporizadorToast = null;
function mostrarToast(mensaje) {
  const toast = document.querySelector("#toast");
  toast.textContent = mensaje;
  toast.hidden = false;
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => (toast.hidden = true), 1500);
}

// --- Conectar la navegación ---
document.querySelectorAll(".tab-btn").forEach((boton) => {
  boton.addEventListener("click", () => mostrarVista(boton.dataset.vista));
});

// --- Conectar exportar/importar ---
document.querySelector("#btn-exportar").addEventListener("click", () => {
  exportarEstado(estado);
});

document.querySelector("#input-importar").addEventListener("change", async (evento) => {
  const archivo = evento.target.files[0];
  if (!archivo) return;
  try {
    const datosImportados = await importarEstado(archivo);
    if (!confirm("Esto va a reemplazar TODOS los datos actuales por los del archivo importado. ¿Continuar?")) {
      return;
    }
    estado = datosImportados;
    guardarEstado(estado);
    mostrarVista(vistaActual);
    mostrarToast("Datos importados ✓");
  } catch (error) {
    alert(error.message);
  }
  evento.target.value = ""; // permite volver a elegir el mismo archivo después
});

// --- Primer dibujado ---
mostrarVista("dashboard");
