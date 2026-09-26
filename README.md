# WWE Universe Tracker

Aplicación web personal para gestionar un **WWE 2K Universe Mode**
mediante HTML, CSS y JavaScript vanilla.

No utiliza React, backend, APIs externas, base de datos ni
autenticación.

Está pensada para uso personal en PC, tablet y teléfono.

------------------------------------------------------------------------

## Tecnologías

-   HTML
-   CSS
-   JavaScript vanilla
-   `localStorage`
-   JSON para exportación/importación de backups

Arquitectura modular:

``` text
data/
logic/
ui/
```

El estado principal de la aplicación se mantiene en un estado central y
se persiste en `localStorage`.

------------------------------------------------------------------------

# Datos y persistencia

Los datos iniciales del Universo se encuentran en:

``` text
js/data/seedData.js
```

Los datos iniciales se utilizan al crear el estado del Universo por
primera vez en un navegador.

Después de esa carga inicial, la aplicación trabaja con los datos
guardados en `localStorage`.

La aplicación no vuelve a leer `seedData.js` en cada carga.

Para realizar backups se utiliza **Exportar**, que genera un archivo
JSON.

También se puede utilizar **Importar** para recuperar un backup del
Universo.

La aplicación conserva, entre otros:

-   Roster
-   Shows
-   WM2
-   WM3
-   Campeonatos
-   Historial de títulos
-   Temporadas
-   Exposición
-   Comparación WWE 2K25 / WWE 2K26
-   Teams & Stables
-   Configuración del Calendario
-   Carteleras y resultados del Calendario

La información de `localStorage` pertenece al navegador utilizado.

------------------------------------------------------------------------

# Roster

El módulo Roster permite administrar los luchadores del Universo.

Características:

-   Roster completo de luchadores.
-   Múltiples shows simultáneos por luchador.
-   RAW, SmackDown, NXT y Retired.
-   Búsqueda.
-   Filtros combinables.
-   Ordenamiento.
-   Edición inline.
-   Agregar y eliminar luchadores.
-   Overall base y actual.
-   Edad base y actual.

La edición inline aparece debajo de la fila del luchador que se está
editando.

Eliminar un luchador del Roster sincroniza las referencias
correspondientes en Teams & Stables, pero no elimina su historial de
títulos.

------------------------------------------------------------------------

# Temporadas

Permite administrar las temporadas del Universo.

Características:

-   Creación de temporadas.
-   Edición.
-   Apertura y cierre.
-   Reapertura.
-   Reset.
-   Eliminación.
-   Advertencias cuando existen dependencias.

El Calendario registra sus resultados en la temporada actual.

------------------------------------------------------------------------

# Títulos

Gestión de los campeonatos del Universo.

Incluye:

-   Campeones actuales.
-   Historial de campeonatos.
-   Registro de luchadores por campeonato.
-   Gestión independiente de los datos de títulos.

La selección de luchadores utiliza el buscador reutilizable.

------------------------------------------------------------------------

# Historial

Módulo destinado al historial de campeonatos.

Incluye:

-   Registro de cambios de campeón.
-   Consulta del historial.
-   Selectores tradicionales donde existe una cantidad reducida de
    opciones.

------------------------------------------------------------------------

# Exposición

Permite administrar manualmente qué luchadores forman parte de la
Exposición de una temporada.

Columnas principales:

``` text
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

## Participación

La participación se clasifica mediante texto:

``` text
0–10    → Poca
11–30   → Media
31–40   → Alta
41+     → Mucha
```

## Racha / Tendencia

La tendencia se determina mediante el balance:

``` text
Balance <= 0   → Mala
1              → Parejo
2–10           → Buena
11–29          → Muy bueno
30+            → Excelente
```

## Prioridad utilizada por el Calendario

El generador del Calendario utiliza cinco niveles:

``` text
P1 → balance <= 0
P2 → balance = 1
P3 → balance 2–10
P4 → balance 11–29
P5 → balance >= 30
```

La prioridad sirve para decidir qué luchadores de Exposición deben
recibir protagonismo primero.

El generador intenta cubrir a los luchadores de mayor prioridad antes de
pasar a prioridades inferiores, siempre respetando las estructuras de
combate disponibles.

Un luchador puede considerarse cubierto aunque participe como compañero
dentro de un Tag o Stable.

------------------------------------------------------------------------

# Overall

Editor del Overall de los luchadores existentes en el Roster.

No crea una fuente de datos independiente.

El Calendario utiliza el Overall actual normalizado de cada luchador.

Para los oponentes se **prefieren** luchadores con Overall `<= 80`.

El límite de 80 es una preferencia de selección y no una exclusión
absoluta: si no existen candidatos adecuados dentro de ese grupo, el
generador puede utilizar otros Overall disponibles.

------------------------------------------------------------------------

# Comparación WWE 2K25 / WWE 2K26

Permite comparar dinámicamente los datos correspondientes a ambas
versiones.

La comparación utiliza los datos existentes del Universo y permite
ordenar la información.

------------------------------------------------------------------------

# Calendario

El Calendario es el generador de carteleras del Universo.

Actualmente genera:

``` text
Miércoles → 9 combates
Jueves    → 9 combates

Total → 18 combates
```

Los dos shows comparten un control global de apariciones para evitar
repetir innecesariamente a los mismos luchadores entre ambas carteleras.

## Tipos de combate

Actualmente existen seis tipos:

1.  **1 vs 1**
2.  **2 vs 2**
3.  **Triple Threat**
4.  **Fatal 4-Way**
5.  **3 vs 3**
6.  **2 vs 2 vs 2**

Las probabilidades actuales son:

``` text
1 vs 1       → 30%
2 vs 2       → 25%
Triple Threat → 15%
Fatal 4-Way  → 10%
3 vs 3       → 10%
2 vs 2 vs 2  → 10%
```

Total:

``` text
100%
```

Las probabilidades son ponderadas. No significa que cada cartelera tenga
que respetar exactamente esos porcentajes.

Además, cada show limita a un máximo de 3 combates de cada tipo durante
la generación.

------------------------------------------------------------------------

## Protagonistas

Los protagonistas se obtienen de los luchadores seleccionados en
**Exposición**.

El generador prioriza:

1.  P1
2.  P2
3.  P3
4.  P4
5.  P5

Dentro de una misma prioridad, la selección puede ser aleatoria.

La lógica intenta cubrir a todos los P1 a lo largo de las 18 posiciones
cuando las estructuras disponibles lo permiten.

La prioridad decide el **ancla o protagonista** del combate.

Los Tags y Stables determinan los acompañantes cuando existe una
estructura válida.

------------------------------------------------------------------------

## Tags y Stables en el Calendario

El Calendario utiliza las estructuras existentes en **Teams & Stables**.

Cuando corresponde, puede utilizar:

-   Tag Teams reales.
-   Stables reales.
-   Tags derivados de Stables.
-   Equipos temporales cuando no existe una estructura real adecuada.

Los equipos temporales generados por el Calendario **no se guardan** en
`estado.equipos`.

La prioridad de Exposición no se aplica de forma independiente a todos
los miembros de un Stable: determina principalmente el protagonista que
activa la estructura.

------------------------------------------------------------------------

## Oponentes

Los oponentes se obtienen del Roster general.

Reglas principales:

-   No pueden pertenecer a Exposición.
-   Deben respetar el género del combate.
-   Se prefieren Overall `<= 80`.
-   Se intenta utilizar primero a los oponentes con menos apariciones en
    la cartelera.
-   Se evitan repeticiones innecesarias cuando existen alternativas
    válidas.
-   Si no existen candidatos adecuados dentro del grupo preferido, se
    puede recurrir a otros oponentes disponibles.

Los Tags y Stables reales de los oponentes se utilizan cuando todavía no
fueron utilizados en la cartelera.

Una vez agotadas las estructuras reales disponibles, el generador
utiliza equipos temporales en lugar de repetir indefinidamente los
mismos Tags o Stables.

Esto también se aplica a equipos de 3 integrantes.

------------------------------------------------------------------------

## Cambiar

Cada combate permite modificar individualmente sus participantes
mediante **Cambiar**.

El buscador de cambio:

-   Respeta el género del combate.
-   Excluye al luchador actualmente seleccionado.
-   Excluye luchadores que ya aparecen en otros combates de la
    cartelera.
-   Utiliza IDs internos, no nombres.
-   Prioriza visualmente los oponentes con Overall `<= 80`.
-   Permite seleccionar manualmente otra opción disponible.

El generador propone; la decisión final queda en manos del usuario.

------------------------------------------------------------------------

## Regenerar

Cada combate puede regenerarse individualmente.

La regeneración utiliza el mismo motor de generación que la creación de
la cartelera.

También existe la posibilidad de regenerar la cartelera completa.

------------------------------------------------------------------------

## Bloquear

Un combate puede bloquearse para conservar su composición.

Los combates bloqueados:

-   No se regeneran.
-   No se modifican mediante los controles de regeneración.
-   Se mantienen al utilizar la regeneración global.

Esto permite fijar manualmente combates que ya fueron aceptados y seguir
trabajando sobre el resto de la cartelera.

------------------------------------------------------------------------

## Cambiar género

Cada combate puede forzarse a:

``` text
🎲 Aleatorio
👨 Hombres
👩 Mujeres
```

Al cambiar el género se reconstruye el combate utilizando el mismo motor
de generación.

------------------------------------------------------------------------

## Cambiar tipo de combate

El tipo de combate puede cambiarse individualmente.

Al hacerlo, la aplicación intenta conservar los participantes que siguen
siendo válidos y completar o reducir la composición según sea necesario.

La lógica continúa respetando las reglas de protagonistas, oponentes,
género, Tags, Stables y equipos temporales.

------------------------------------------------------------------------

## Dejar en blanco

Cada posición de la cartelera puede utilizar:

**🧹 Dejar en blanco**

Esta opción no elimina la posición del combate.

Por ejemplo:

``` text
Combate 1
Combate 2
Combate 3 → vacío
Combate 4
```

El combate vacío conserva su posición, pero elimina:

-   Tipo de combate.
-   Género.
-   Participantes.
-   Equipos.
-   Ganador.
-   Estado correspondiente del combate.

La posición queda disponible para que el usuario pueda decidirla
posteriormente.

Cuando está vacío, el género se muestra como:

``` text
-
```

Los participantes también se eliminan realmente de la estructura interna
del combate, no solamente de la interfaz.

------------------------------------------------------------------------

## Resultados

Cada combate permite seleccionar un ganador y registrar el resultado.

Al registrar un combate:

-   El ganador obtiene una victoria.
-   Los perdedores obtienen una derrota.
-   En combates por equipos, todos los integrantes del equipo ganador
    reciben victoria.
-   Todos los integrantes del equipo perdedor reciben derrota.
-   Los datos se acumulan en la temporada correspondiente.
-   Los datos utilizados por Exposición se actualizan a partir de los
    acumulados existentes.

El resultado registrado no puede modificarse mediante los controles
normales del combate.

------------------------------------------------------------------------

## Reinicio automático de la cartelera

Cuando los 18 combates de Miércoles y Jueves fueron registrados:

``` text
9 Miércoles → registrados
9 Jueves    → registrados
-------------------------
18 / 18
```

el Calendario limpia las carteleras generadas para permitir una nueva
generación.

No se elimina:

-   La temporada actual.
-   La configuración.
-   Los datos de Exposición.
-   Los resultados acumulados.
-   Los datos de Teams & Stables.

La siguiente generación crea una cartelera nueva.

------------------------------------------------------------------------

# Teams & Stables

Módulo para administrar Tags y Stables del Universo.

Los datos viven en:

``` text
estado.equipos
```

con la estructura:

``` text
{
    stables: [],
    tagTeams: []
}
```

También forman parte de Exportar/Importar.

------------------------------------------------------------------------

## Stables

Un Stable puede tener uno o más miembros.

Un luchador puede pertenecer a un solo Stable al mismo tiempo.

Si un Stable queda sin miembros:

-   Se elimina el Stable.
-   Se eliminan sus Tags derivados.

Los luchadores permanecen en el Roster.

------------------------------------------------------------------------

## Tag Teams

Un Tag Team tiene exactamente dos luchadores.

Un luchador puede pertenecer a varios Tag Teams.

Un Tag Team puede existir independientemente de cualquier Stable.

------------------------------------------------------------------------

## Tags derivados de Stables

Desde un Stable se pueden crear Tags derivados.

Ejemplo:

``` text
The Bloodline
├── Roman Reigns
├── Jey Uso
├── Jimmy Uso
└── Jacob Fatu

The Usos
Jey Uso + Jimmy Uso
```

Un Tag derivado solamente puede utilizar miembros del Stable de origen.

Los Stable y Tag Team tienen IDs internos independientes del nombre.

Los nombres son editables sin utilizar el nombre como identificador.

Si se elimina un Stable:

-   Se elimina el Stable.
-   Se eliminan sus Tags derivados.
-   Los luchadores permanecen en el Roster.
-   Los Tags independientes permanecen.

------------------------------------------------------------------------

## Buscador de Teams & Stables

El módulo utiliza un único buscador para Stables y Tags.

La búsqueda se realiza por:

-   Nombre del Stable.
-   Nombre del Tag Team.
-   Nombre de cualquiera de sus integrantes.

Ejemplos:

``` text
Tatum
→ Allies of Convenience
```

``` text
Gargano
→ #DIY
```

Si no hay resultados, se informa que no se encontraron Stables ni Tags.

------------------------------------------------------------------------

## Archivos principales

``` text
js/logic/equipos.js
js/ui/equipos-ui.js
```

------------------------------------------------------------------------

# Buscador de luchadores

Existe un componente reutilizable para trabajar con el Roster sin
depender de selectores enormes.

Archivo:

``` text
js/ui/buscador-luchador-ui.js
```

Características:

-   Búsqueda parcial.
-   Ignora mayúsculas y minúsculas.
-   Ignora tildes.
-   Selección mediante clic.
-   Navegación con ↑ / ↓.
-   Confirmación con Enter.
-   Muestra el luchador seleccionado con ✓.
-   Conserva el ID seleccionado mediante `input hidden`.
-   Mantiene compatibilidad con la lógica anterior basada en
    `select.value`.

Actualmente se utiliza en:

-   Títulos → Agregar luchador.
-   Exposición → Luchador.
-   Teams & Stables → miembros.
-   Edición de Tags independientes.
-   Otros formularios que necesitan buscar luchadores del Roster.

Se mantienen selectores tradicionales donde la cantidad de opciones es
pequeña o donde las opciones dependen de un grupo reducido, por ejemplo:

-   Historial.
-   Títulos → Campeonato.
-   Exposición → Temporada.
-   Tags derivados de un Stable.

------------------------------------------------------------------------

# Arquitectura

Reglas principales de desarrollo:

-   Mantener HTML, CSS y JavaScript vanilla.
-   No introducir React.
-   No crear backend salvo que se decida explícitamente en una versión
    futura.
-   No introducir APIs externas sin necesidad.
-   Reutilizar el estado central.
-   Reutilizar funciones existentes antes de crear nuevas.
-   Evitar fuentes de datos duplicadas.
-   Evitar refactors innecesarios.
-   No modificar funcionalidades estables sin una razón concreta.
-   Utilizar IDs internos estables.
-   No utilizar nombres visibles como identificadores.
-   Mantener separadas las responsabilidades entre `data/`, `logic/` y
    `ui/`.

La lógica de generación del Calendario se mantiene principalmente en:

``` text
js/logic/calendario.js
```

La interfaz del Calendario se mantiene principalmente en:

``` text
js/ui/calendario-ui.js
```

------------------------------------------------------------------------

# Git y desarrollo por módulos

El proyecto se desarrolla mediante ramas por funcionalidad.

Ejemplo:

``` text
master
├── feature/roster
├── feature/exposicion
├── feature/calendario
```

Flujo habitual:

``` text
feature
   ↓
probar
   ↓
commit
   ↓
push
   ↓
GitHub
   ↓
merge
   ↓
master
```

Los cambios nuevos deben probarse antes de fusionarse con `master`.

No se recomienda subir archivos de prueba, copias de seguridad o
archivos duplicados de código a la rama final.

------------------------------------------------------------------------

# Archivos de prueba

Antes de hacer commit y push se deben revisar especialmente archivos con
nombres como:

``` text
archivo - copia.js
archivo copia.js
archivo_old.js
archivo_backup.js
```

Estos archivos no forman parte de la aplicación si son únicamente copias
utilizadas durante pruebas.

Por ejemplo, si existe:

``` text
js/logic/calendario - copia.js
```

y es solamente una copia de prueba de `calendario.js`, debe eliminarse
antes de subir la rama final.

------------------------------------------------------------------------

# Cómo abrir

1.  Descargar o descomprimir el proyecto.
2.  Abrir `index.html`.

La aplicación funciona actualmente sin necesidad de un servidor.

------------------------------------------------------------------------

# Backups

Se recomienda utilizar **Exportar** antes de realizar cambios
importantes.

El backup genera un archivo JSON con el estado actual del Universo.

Si se elimina el `localStorage` del navegador, se pierde el estado
actual guardado en ese navegador.

En ese caso, la aplicación vuelve a utilizar los datos iniciales
disponibles para crear un nuevo Universo.

------------------------------------------------------------------------

# Futuro

Ideas y funcionalidades que pueden incorporarse posteriormente:

-   Fotos de luchadores.
-   Imágenes de títulos.
-   Mejoras visuales y de interfaz.
-   Nuevas herramientas para la gestión del Universo.
-   Posible sincronización entre PC y teléfono mediante backend.
-   Otras herramientas personales para el Universe Mode.

La aplicación está pensada actualmente para uso personal y no requiere
publicación en Google Play.
