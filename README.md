# WWE Universe Tracker v1.0.0

Aplicación web personal para gestionar un WWE 2K Universe Mode con HTML, CSS y JavaScript vanilla. No usa React, APIs, base de datos externa ni autenticación.

## Datos

Los datos iniciales reales están en `js/data/seedData.js` y se cargan una sola vez en un navegador nuevo. Después, el estado vive en `localStorage`. Usá **Exportar** para crear backups JSON.

La app conserva el roster existente, WM2, WM3, los 16 campeonatos, historial de títulos y la comparación 2K25/2K26. La migración interna de v1.0 convierte el antiguo `show` único del roster a `shows[]` sin perder la asignación existente.

## Funciones v1.0

- Roster con múltiples shows simultáneos, búsqueda, filtros combinables y ordenamiento.
- Selector WWE 2K25 / WWE 2K26 reutilizando la misma interfaz.
- Gestión de agregar, editar y eliminar luchadores; eliminar del roster no borra su historial.
- Temporadas dinámicas abiertas/cerradas, creación, reapertura, edición, reset y eliminación con advertencias de dependencias.
- Títulos del Universo editables y campeones actuales de vida real en una fuente independiente.
- Exposición manual por luchador y temporada, con estadísticas derivadas de Temporadas.
- Editor de Overall sobre el roster existente.
- Comparación 2K25 vs 2K26 dinámica y ordenable.
- Interfaz responsive para PC, tablet y teléfono.

## Cómo abrir

1. Descomprimí la carpeta.
2. Abrí `index.html` con doble clic.

Si más adelante querés compartir los mismos datos entre PC y teléfono en tiempo real, habrá que agregar sincronización/backend; v1.0 no la necesita.

## Futuro (fuera de v1.0)

Generador de carteleras de 9 combates, actualización automática combate por combate, fotos, imágenes de títulos y mejoras visuales.

## Módulo Calendario

El módulo Calendario genera dos carteleras de 9 combates (Miércoles y Jueves) usando únicamente luchadores seleccionados en Exposición. Las prioridades y estadísticas se calculan a partir de Exposición/Temporadas; los resultados registrados actualizan los acumulados de la temporada mediante las funciones existentes.

## Módulo Teams & Stables

Administra **Tag Teams** (2 luchadores) y **Stables/Grupos** (1 o más luchadores). Es la fuente de datos que el Calendario usará más adelante para proponer combates por equipos; el Calendario no guarda ni hardcodea equipos propios.

- Los datos viven en `estado.equipos` (`{ stables, tagTeams }`), dentro del mismo estado central que se guarda en `localStorage` y se exporta/importa con los backups. Lógica en `js/logic/equipos.js`, pantalla en `js/ui/equipos-ui.js`.
- Cada Stable y Tag Team tiene un `id` interno estable; el nombre se puede editar libremente.
- Un luchador pertenece a **un solo Stable**, pero puede estar además en uno o varios Tag Teams. Un Tag Team puede existir sin Stable y un Stable sin Tag Teams.
- Desde un Stable se puede **crear un Tag Team derivado**: el selector solo ofrece los miembros actuales del Stable. El derivado es una entidad independiente (guarda `stableOrigenId` para mostrar la relación).
- Eliminar un Stable elimina también sus Tag Teams derivados; los luchadores nunca se borran del Roster, y el Tag Team se puede volver a crear como independiente.
- Si un Stable queda sin miembros, se elimina automáticamente (con sus derivados). Al eliminar un luchador del Roster, sale de sus Stables y se eliminan los Tag Teams que quedarían con un solo luchador.
- Consultas para el Calendario: `listarTagTeams`, `listarStables`, `tagTeamsDeLuchador`, `stableDeLuchador`, `tagTeamsDerivados`, `resolverEquipo`.

## Buscador de luchadores (componente reutilizable)

`js/ui/buscador-luchador-ui.js` reemplaza los `<select>` con todo el roster (~165 luchadores) por un campo de búsqueda: se escribe parte del nombre (sin importar mayúsculas ni tildes), aparecen las coincidencias y se elige una (clic, o ↑ ↓ + Enter). El id elegido queda en un `<input type="hidden">`, así que el código que antes leía `select.value` sigue igual. Instrucciones de uso en el encabezado del archivo.

Se usa en: Títulos → Agregar luchador (con filtro por género), Exposición → Luchador, y Teams & Stables → Primer miembro, Agregar miembro y Luchador 1/2 de Tag Team (nuevo y edición de un Tag Team independiente). Se mantienen como `<select>` los datos con pocas opciones (Historial, Campeonato, Temporada) y los Tag Teams derivados de un Stable, que solo ofrecen sus miembros.
