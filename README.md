# WWE Universe Tracker v1.0.0

Aplicación web personal para gestionar un **WWE 2K Universe Mode** con HTML, CSS y JavaScript vanilla.

No usa React, APIs, base de datos externa ni autenticación.

La aplicación está pensada para uso personal en PC, tablet y teléfono.

---

## Tecnologías

* HTML
* CSS
* JavaScript vanilla
* `localStorage`
* JSON para exportación/importación de backups

Arquitectura modular:

```text
data/
logic/
ui/
```

---

# Datos

Los datos iniciales reales están en:

```text
js/data/seedData.js
```

Se cargan una sola vez en un navegador nuevo.

Después de esa carga inicial, el estado de la aplicación vive en `localStorage`.

La aplicación no vuelve a leer `seedData.js` en cada carga.

Para realizar backups se utiliza la función **Exportar**, que genera un archivo JSON.

También existe la posibilidad de importar un backup para recuperar el estado del Universo.

La aplicación conserva:

* Roster
* Shows
* WM2
* WM3
* Campeonatos
* Historial de títulos
* Temporadas
* Exposición
* Comparación WWE 2K25 / WWE 2K26
* Teams & Stables
* Configuración y datos del Calendario

La migración interna de v1.0 convierte el antiguo show único del roster a `shows[]` sin perder la asignación existente.

---

# Funciones

## Roster

* Roster completo de luchadores.
* Múltiples shows simultáneos por luchador.
* RAW, SmackDown, NXT y Retired.
* Búsqueda.
* Filtros combinables.
* Ordenamiento.
* Edición inline del luchador.
* Agregar y eliminar luchadores.
* Overall base y actual.
* Edad base y actual.
* Eliminación del roster sincronizada con Teams & Stables.

Eliminar un luchador del Roster no elimina su historial de títulos.

---

## Temporadas

* Temporadas dinámicas.
* Creación.
* Edición.
* Apertura y cierre.
* Reapertura.
* Reset.
* Eliminación.
* Advertencias cuando existen dependencias.

---

## Títulos

* Gestión de los campeonatos del Universo.
* Campeones actuales.
* Historial de campeonatos.
* Registro de luchadores por campeonato.
* Datos de campeonatos independientes del resto del Universo.

La selección de campeonatos utiliza un selector porque existe una cantidad reducida de opciones.

La selección de luchadores utiliza el buscador reutilizable.

---

## Historial

* Historial de campeonatos.
* Registro de cambios de campeón.
* Selector de datos con pocas opciones.
* Se mantiene el selector tradicional para este módulo.

---

## Exposición

Permite administrar manualmente la exposición de los luchadores por temporada.

Columnas principales:

```text
Luchador
Show actual
Temporada
V
D
Total de combates
Balance
Participación
Racha/Tendencia
Prioridad
```

Las estadísticas derivadas utilizan los datos existentes de Temporadas.

### Prioridad del Calendario

El generador utiliza la siguiente prioridad:

1. Balance negativo.
2. Participación Poca.
3. Prioridad 3.
4. Prioridad 4.

La prioridad es un orden de preferencia y no una restricción absoluta.

El generador debe evitar repetir luchadores cuando existan alternativas válidas.

---

## Overall

Editor de Overall sobre el roster existente.

No crea una fuente de datos separada.

---

## Comparación WWE 2K25 / WWE 2K26

Comparación dinámica y ordenable de los datos de ambas versiones.

Utiliza la misma interfaz y los mismos datos del Universo.

---

# Calendario

El módulo Calendario genera actualmente dos carteleras:

* Miércoles
* Jueves

Cada cartelera contiene 9 combates.

El Calendario utiliza los luchadores seleccionados en **Exposición** como protagonistas y el roster general para los oponentes.

Las prioridades y estadísticas se calculan utilizando los datos existentes de Exposición y Temporadas.

Al registrar un resultado, se actualizan los acumulados de la temporada mediante las funciones existentes.

## Reglas actuales del generador

* Los protagonistas pertenecen a Exposición.
* Los oponentes se buscan en el roster general.
* Los oponentes deben ser del mismo género.
* Se priorizan oponentes con Overall ≤75.
* Un luchador seleccionado en Exposición no debe utilizarse como oponente.
* Se evitan duplicados cuando existen alternativas válidas.
* La prioridad de Exposición se respeta siempre que sea posible.
* El usuario puede modificar manualmente las propuestas.
* El Calendario propone, el usuario decide.
* El botón `Cambiar` permite reemplazar participantes individualmente.
* Los cambios manuales pueden generar advertencias por duplicados, pero no bloquean al usuario.
* Cambiar el tipo de combate debe conservar los participantes existentes siempre que sea posible y agregar/quitar únicamente los necesarios.

## Próxima integración del Calendario

El generador será actualizado para utilizar **Teams & Stables** como fuente de contexto para los combates por equipos.

Los tipos definitivos serán:

1. **1 vs 1**
2. **Tag Team (2 vs 2)**
3. **Triple Threat**
4. **Fatal 4-Way**
5. **6 Tag Match (3 vs 3)**
6. **Triple Tag Match (2 vs 2 vs 2)**

La configuración de probabilidades estará dentro del módulo Calendario.

Cada tipo tendrá un porcentaje configurable y el total deberá ser exactamente 100%.

Ejemplo:

```text
1 vs 1                  [  ]
Tag Team (2 vs 2)       [  ]
Triple Threat           [  ]
Fatal 4-Way             [  ]
6 Tag Match (3 vs 3)    [  ]
Triple Tag Match        [  ]

Total: 100%
```

Las probabilidades serán ponderadas; no significa que cada cartelera tenga que respetar exactamente esos porcentajes.

---

# Teams & Stables

Módulo para administrar la estructura actual de equipos y grupos del Universo.

Los datos viven en:

```text
estado.equipos
```

con la estructura:

```text
{
    stables: [],
    tagTeams: []
}
```

Se almacenan dentro del mismo estado central de la aplicación, junto con el resto de los datos.

También se incluyen en Exportar/Importar.

### Stables / Grupos

Un Stable puede tener uno o más miembros.

Un luchador puede pertenecer a un solo Stable al mismo tiempo.

Si un Stable queda sin miembros, se elimina automáticamente junto con sus Tag Teams derivados.

### Tag Teams

Un Tag Team tiene exactamente 2 luchadores.

Un luchador puede pertenecer a varios Tag Teams.

Un Tag Team puede existir independientemente de cualquier Stable.

### Tag Teams derivados

Desde un Stable se puede crear un Tag Team derivado.

Ejemplo:

```text
The Bloodline
├── Roman Reigns
├── Jey Uso
├── Jimmy Uso
└── Jacob Fatu

Tag Team derivado:
The Usos
Jey Uso + Jimmy Uso
```

El Tag Team derivado solo puede utilizar miembros del Stable de origen.

Cada Stable y Tag Team tiene un ID interno estable e independiente del nombre.

Los nombres son completamente editables.

Si se elimina un Stable:

* Se elimina el Stable.
* Se eliminan sus Tag Teams derivados.
* Los luchadores permanecen en el Roster.
* Un Tag Team eliminado puede volver a crearse posteriormente como Tag Team independiente.

Los Tag Teams independientes no se eliminan al modificar o eliminar otros Stables.

### Integración con el Calendario

El Calendario utiliza los Tags y Stables existentes como contexto para generar combates por equipos.

Cuando corresponde, el generador puede utilizar estructuras reales de Tags y Stables para completar los equipos.

La prioridad de Exposición determina el protagonista o ancla del combate, mientras que el Tag o Stable determina los acompañantes cuando existe una estructura válida.

Los equipos temporales utilizados por el generador no se guardan como nuevos equipos en `estado.equipos`.

### Buscador

El módulo dispone de un único buscador para **Stables y Tags**.

Permite buscar en tiempo real por:

* Nombre del Stable.
* Nombre del Tag Team.
* Nombre de cualquiera de sus integrantes.

Ejemplos:

```text
Tatum
→ Allies of Convenience
```

```text
Gargano
→ #DIY
```

Si la búsqueda no encuentra resultados, se muestra un mensaje indicando que no se encontraron Stables ni Tags.

### Archivos principales

```text
js/logic/equipos.js
js/ui/equipos-ui.js
```

Consultas utilizadas por el resto de la aplicación:

```text
listarTagTeams
listarStables
tagTeamsDeLuchador
stableDeLuchador
tagTeamsDerivados
resolverEquipo
```

---

# Buscador de luchadores

Existe un componente reutilizable para reemplazar los selectores enormes con los aproximadamente 165 luchadores del roster.

Archivo:

```text
js/ui/buscador-luchador-ui.js
```

Características:

* Búsqueda por parte del nombre.
* Ignora mayúsculas/minúsculas.
* Ignora tildes.
* Selección mediante clic.
* Navegación con ↑ / ↓.
* Confirmación con Enter.
* El luchador seleccionado queda visible con ✓.
* El ID seleccionado se mantiene en un `input hidden`.
* Mantiene compatibilidad con la lógica existente que utilizaba `select.value`.

Ejemplo:

```text
balor
→ Finn Bálor
```

```text
ripl
→ Rhea Ripley
```

### Actualmente se utiliza en:

* Títulos → Agregar luchador.
* Exposición → Luchador.
* Teams & Stables → Primer miembro.
* Teams & Stables → Agregar miembro.
* Teams & Stables → Luchador 1 y 2.
* Edición de Tag Teams independientes.

### Se mantienen selectores tradicionales en:

* Historial.
* Títulos → Campeonato.
* Exposición → Temporada.
* Tag Teams derivados de un Stable, porque solo muestran los pocos miembros disponibles del Stable.

En Títulos → Agregar luchador también existe filtro por género:

* Todos
* Hombres
* Mujeres

---

# Arquitectura y reglas de desarrollo

* Mantener HTML, CSS y JavaScript vanilla.
* No introducir React.
* No introducir backend salvo que se decida explícitamente en una versión futura.
* No introducir APIs externas sin necesidad.
* No crear fuentes de datos duplicadas.
* Reutilizar el estado central existente.
* Reutilizar funciones existentes antes de crear nuevas.
* No modificar funcionalidades que ya funcionan.
* Evitar refactors innecesarios.
* Los nombres visibles pueden cambiar; nunca utilizar el nombre como identificador interno.
* Utilizar IDs internos estables para relacionar entidades.
* Mantener separadas las responsabilidades entre `data/`, `logic/` y `ui/`.

---

# Git / desarrollo por módulos

El proyecto se desarrolla mediante ramas por funcionalidad.

Ejemplo:

```text
master
├── feature/exposicion
├── feature/calendario
└── feature/calendar-stables-tags
```

Flujo habitual:

```text
feature → probar → commit → push → merge → master
```

Cada módulo importante debe probarse antes de fusionarse con `master`.

---

# Cómo abrir

1. Descomprimir la carpeta.
2. Abrir `index.html` con doble clic.

No requiere servidor para el funcionamiento actual.

---

# Backups

Utilizar **Exportar** para guardar una copia JSON del Universo.

Se recomienda realizar backups antes de cambios importantes.

La información almacenada en `localStorage` pertenece al navegador utilizado.

Si se borra el `localStorage`, se pierde el estado actual de ese navegador y la aplicación vuelve a utilizar los datos iniciales.

---

# Futuro

Funcionalidades previstas:

* Fotos de luchadores.
* Imágenes de títulos.
* Mejoras visuales y de interfaz.
* Posible sincronización entre PC y teléfono mediante backend en una versión futura.
* Nuevas herramientas y mejoras para la gestión del Universo.

La aplicación actualmente está pensada para uso personal y no requiere publicación en Google Play.
