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
