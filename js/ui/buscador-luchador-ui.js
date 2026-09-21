// =========================================================================
// buscador-luchador-ui.js
// -------------------------------------------------------------------------
// Componente reutilizable: buscador de luchadores.
//
// Reemplaza a un <select> con todo el roster (~165 luchadores) por un campo
// de texto: se escribe parte del nombre, aparecen las coincidencias y se
// elige una. La búsqueda ignora mayúsculas y tildes ("balor" encuentra a
// "Finn Bálor") y acepta varias palabras en cualquier orden ("ripley rhea").
//
// USO (dos pasos, igual que el resto de la app: primero HTML, después eventos)
//
//   1) En la plantilla HTML, donde antes iba el <select>:
//        ${htmlBuscadorLuchador({ id: 'mi-luchador', etiqueta: 'Luchador' })}
//      Opciones: etiquetaVisible:false (etiqueta solo para lectores de pantalla,
//      útil en filas con un botón al lado) y deshabilitado:true.
//
//   2) Después de asignar el innerHTML:
//        const buscador = activarBuscadorLuchador(contenedor, {
//          id: 'mi-luchador',
//          luchadores: estado.roster,          // array, o función que devuelve un array
//          alSeleccionar: (luchador) => {...}, // opcional; recibe null si se deselecciona
//          valorInicial: 'id-del-luchador',    // opcional; arranca ya seleccionado (edición)
//        });
//
//   El id del luchador elegido queda en un <input type="hidden" id="mi-luchador">,
//   de modo que el código que antes leía `select.value` sigue funcionando igual:
//        contenedor.querySelector('#mi-luchador').value   // '' si no hay selección
//
//   El objeto devuelto permite: valor(), luchador(), limpiar(), refrescar().
//   Si `luchadores` es una función (por ejemplo, para aplicar un filtro por
//   género), llamá a refrescar() cuando cambie el filtro.
//
// Los resultados son <button> a propósito: así los manejadores globales que
// ignoran los clics sobre controles (ej. el guardado rápido de Exposición)
// no interpretan la elección como un "clic afuera".
// =========================================================================

const BUSCADOR_LUCHADOR_LIMITE = 30;

/** Minúsculas y sin tildes, para comparar nombres de forma tolerante. */
function normalizarTextoBusqueda(texto) {
  return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/**
 * Filtra y ordena luchadores según lo escrito. Función pura (no toca el DOM).
 * Un luchador coincide si CADA palabra escrita aparece en su nombre. Orden:
 * primero los que empiezan con lo escrito, luego los que tienen una palabra
 * que empieza así, luego el resto; dentro de cada grupo, alfabético.
 */
function buscarLuchadoresPorNombre(luchadores, consulta) {
  const texto = normalizarTextoBusqueda(consulta);
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (!palabras.length) return [];
  const puntuar = (nombre) => {
    if (nombre.startsWith(texto)) return 0;
    const partes = nombre.split(/\s+/);
    if (palabras.every((p) => partes.some((parte) => parte.startsWith(p)))) return 1;
    return 2;
  };
  return luchadores
    .map((w) => ({ w, nombre: normalizarTextoBusqueda(w.nombre) }))
    .filter(({ nombre }) => palabras.every((p) => nombre.includes(p)))
    .map(({ w, nombre }) => ({ w, puntos: puntuar(nombre) }))
    .sort((a, b) => a.puntos - b.puntos || a.w.nombre.localeCompare(b.w.nombre, "es", { sensitivity: "base" }))
    .map(({ w }) => w);
}

/** HTML del buscador. `id` es el id del <input hidden> que guarda el id del luchador. */
function htmlBuscadorLuchador({ id, etiqueta = "Luchador", placeholder = "🔎 Buscar luchador...", etiquetaVisible = true, deshabilitado = false }) {
  return `<div class="buscador-luchador" data-buscador-luchador="${esc(id)}">
    <label for="${esc(id)}-buscar"${etiquetaVisible ? "" : ' class="bl-etiqueta-oculta"'}>${esc(etiqueta)}</label>
    <div class="bl-campo">
      <input type="text" id="${esc(id)}-buscar" class="bl-entrada" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${esc(id)}-lista" autocomplete="off" spellcheck="false" placeholder="${esc(placeholder)}"${deshabilitado ? " disabled" : ""}>
      <span class="bl-check" aria-hidden="true">✓</span>
      <input type="hidden" id="${esc(id)}" value="">
      <div class="bl-resultados" id="${esc(id)}-lista" role="listbox" hidden></div>
    </div>
  </div>`;
}

/** Conecta los eventos del buscador dibujado con htmlBuscadorLuchador(). */
function activarBuscadorLuchador(raiz, { id, luchadores, alSeleccionar = null, valorInicial = "", limite = BUSCADOR_LUCHADOR_LIMITE }) {
  const caja = raiz.querySelector(`[data-buscador-luchador="${id}"]`);
  if (!caja) return null;
  const entrada = caja.querySelector(".bl-entrada");
  const oculto = caja.querySelector('input[type="hidden"]');
  const lista = caja.querySelector(".bl-resultados");

  const obtener = () => (typeof luchadores === "function" ? luchadores() : luchadores) || [];
  let resultados = [];
  let activo = -1;

  const abierto = () => !lista.hidden;
  const cerrar = () => {
    lista.hidden = true;
    entrada.setAttribute("aria-expanded", "false");
    entrada.removeAttribute("aria-activedescendant");
    activo = -1;
  };
  const marcarActivo = (indice) => {
    const opciones = [...lista.querySelectorAll(".bl-opcion")];
    if (!opciones.length) { activo = -1; return; }
    activo = Math.max(0, Math.min(indice, opciones.length - 1));
    opciones.forEach((o, i) => {
      o.classList.toggle("is-activa", i === activo);
      o.setAttribute("aria-selected", i === activo ? "true" : "false");
    });
    entrada.setAttribute("aria-activedescendant", opciones[activo].id);
    opciones[activo].scrollIntoView({ block: "nearest" });
  };

  const dibujar = () => {
    const disponibles = obtener();
    const consulta = entrada.value;
    let html;
    if (!disponibles.length) {
      resultados = [];
      html = `<p class="bl-mensaje texto-tenue">No hay luchadores disponibles para elegir.</p>`;
    } else if (!consulta.trim()) {
      resultados = [];
      html = `<p class="bl-mensaje texto-tenue">Escribí parte del nombre para buscar (${disponibles.length} disponibles).</p>`;
    } else {
      const encontrados = buscarLuchadoresPorNombre(disponibles, consulta);
      resultados = encontrados.slice(0, limite);
      if (!encontrados.length) {
        html = `<p class="bl-mensaje texto-tenue">Sin coincidencias para «${esc(consulta.trim())}».</p>`;
      } else {
        html = resultados.map((w, i) => `<button type="button" class="bl-opcion" role="option" aria-selected="false" id="${esc(id)}-op-${i}" data-indice="${i}">${esc(w.nombre)}</button>`).join("");
        if (encontrados.length > resultados.length) {
          html += `<p class="bl-mensaje texto-tenue">Mostrando ${resultados.length} de ${encontrados.length}. Seguí escribiendo para acotar.</p>`;
        }
      }
    }
    lista.innerHTML = html;
    lista.hidden = false;
    entrada.setAttribute("aria-expanded", "true");
    activo = -1;
  };

  const seleccionar = (w) => {
    oculto.value = w.id;
    entrada.value = w.nombre;
    caja.classList.add("is-seleccionado");
    cerrar();
    if (alSeleccionar) alSeleccionar(w);
  };

  const deseleccionar = () => {
    if (!oculto.value) return;
    oculto.value = "";
    caja.classList.remove("is-seleccionado");
    if (alSeleccionar) alSeleccionar(null);
  };

  if (valorInicial) {
    const inicial = obtener().find((w) => w.id === valorInicial);
    if (inicial) {
      oculto.value = inicial.id;
      entrada.value = inicial.nombre;
      caja.classList.add("is-seleccionado");
    }
  }

  entrada.addEventListener("input", () => { deseleccionar(); dibujar(); });
  entrada.addEventListener("focus", () => { if (oculto.value) entrada.select(); else dibujar(); });
  entrada.addEventListener("blur", cerrar);
  entrada.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!abierto()) dibujar();
      marcarActivo(activo + 1);
    } else if (e.key === "ArrowUp") {
      if (!abierto()) return;
      e.preventDefault();
      marcarActivo(activo - 1);
    } else if (e.key === "Enter") {
      if (!abierto() || !resultados.length) return;
      e.preventDefault();
      seleccionar(resultados[activo >= 0 ? activo : 0]);
    } else if (e.key === "Escape") {
      if (abierto()) { e.preventDefault(); cerrar(); }
    }
  });

  // mousedown + preventDefault: el campo no pierde el foco (y no se cierra la
  // lista) antes de que el clic llegue a la opción. También sirve en pantallas táctiles.
  lista.addEventListener("mousedown", (e) => e.preventDefault());
  lista.addEventListener("click", (e) => {
    e.stopPropagation(); // un clic dentro de los resultados nunca cuenta como "clic afuera"
    const opcion = e.target.closest(".bl-opcion");
    if (opcion) seleccionar(resultados[Number(opcion.dataset.indice)]);
  });

  return {
    /** id del luchador elegido ('' si no hay). */
    valor: () => oculto.value,
    /** objeto luchador elegido, o null. */
    luchador: () => obtener().find((w) => w.id === oculto.value) || null,
    /** Vacía el campo y la selección. */
    limpiar: () => { deseleccionar(); entrada.value = ""; cerrar(); },
    /** Volver a evaluar `luchadores` (p. ej. al cambiar un filtro por género). */
    refrescar: () => {
      if (oculto.value && !obtener().some((w) => w.id === oculto.value)) { deseleccionar(); entrada.value = ""; }
      if (abierto()) dibujar();
    },
  };
}
