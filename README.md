# App de Clima – Módulo 4

Aplicación web de clima desarrollada para el Módulo 4 del bootcamp, enfocada en practicar lógica de programación en JavaScript, manejo de datos y actualización dinámica del DOM. La app muestra un listado de lugares con su clima actual y una vista de detalle con pronóstico semanal y estadísticas calculadas en tiempo real.

## Temática

La app usa distintas ciudades de Chile (Santiago, Valparaíso, Concepción, Arica, Iquique, Antofagasta, Temuco, Punta Arenas, Puerto Montt y Copiapó) como lugares de referencia, mostrando su estado del tiempo, humedad, viento y pronóstico semanal.

## Modelo de datos

Toda la información de clima está definida en JavaScript dentro de un arreglo de lugares llamado `lugares`. Cada elemento del arreglo representa un lugar y se modela como un objeto con la siguiente estructura mínima:

- `id`: identificador único del lugar (string).
- `nombre`: nombre del lugar (ciudad).
- `region`: región a la que pertenece.
- `tempActual`: temperatura actual en °C.
- `estadoActual`: descripción corta del estado del tiempo actual (ej. “Soleado”, “Nublado”).
- `icono`: icono o emoji representando el clima.
- `humedad`: porcentaje de humedad.
- `viento`: velocidad del viento en km/h.
- `pronosticoSemanal`: arreglo de objetos que representa el pronóstico de la semana.

Cada objeto dentro de `pronosticoSemanal` tiene la forma:

- `dia`: nombre del día (Lunes, Martes, etc.).
- `min`: temperatura mínima prevista para ese día.
- `max`: temperatura máxima prevista para ese día.
- `estado`: estado del tiempo para ese día (ej. “Soleado”, “Nublado”, “Lluvia”).

Todo el pronóstico está definido directamente en el archivo `data.js`, sin consumir ninguna API externa, cumpliendo el requisito de tener los datos “locales” en JavaScript.

## Lógica y estadísticas

La lógica principal de la app se implementa en `main.js` y se organiza en funciones para separar responsabilidades:

- `renderCities()`: recorre el arreglo `lugares` y genera dinámicamente las cards de cada lugar en la vista Home.
- `buscarLugarPorId(id)`: recibe un `id` y devuelve el objeto lugar correspondiente desde el arreglo `lugares`.
- `showDetail(place)`: muestra la vista de detalle de un lugar, incluyendo datos actuales, pronóstico semanal y estadísticas.
- `calcularEstadisticas(pronosticoSemanal)`: recibe el pronóstico semanal de un lugar y calcula las estadísticas de la semana.

La función `calcularEstadisticas` utiliza variables, ciclos y condicionales para:

- Recorrer el arreglo `pronosticoSemanal`.
- Calcular la **temperatura mínima** de la semana (`minSemana`) a partir de los valores `min` de cada día.
- Calcular la **temperatura máxima** de la semana (`maxSemana`) a partir de los valores `max` de cada día.
- Calcular la **temperatura promedio** de la semana (`promedioSemana`) usando el promedio diario `(min + max) / 2` y luego la media de todos los días.
- Contar cuántos días hay de cada tipo de clima (`conteoEstados`), usando el campo `estado`.

Además, a partir de los conteos por estado, la función determina qué tipo de clima fue más frecuente en la semana y genera un **resumen textual**, por ejemplo:

- “Semana mayormente soleada.”
- “Semana mayormente nublada.”
- “Semana variada en cuanto al clima.”

Todas estas estadísticas se muestran en la sección “Estadísticas de la semana” dentro de la vista de detalle, generadas dinámicamente desde JavaScript.

## Interfaz y DOM

La app manipula el DOM para:

- Mostrar el listado inicial de lugares con su clima actual en la Home.
- Cambiar a la vista de detalle al hacer clic en “Ver detalle” en una card.
- Renderizar el pronóstico diario como cards con día, min, max y estado.
- Renderizar la sección de estadísticas con mínimo, máximo, promedio, conteo de días por tipo de clima y el resumen textual.

No hay datos de clima “quemados” en el HTML; todo se construye a partir del arreglo `lugares` y sus objetos de `pronosticoSemanal`, cumpliendo así los requisitos del módulo sobre lógica, estructuras de datos y actualización del DOM.

## Puedes ver el resultado en:

https://zakkdruzer.github.io/app-clima-ejer-final-mod4/
