/* =========================================================
  ARCHIVO PRINCIPAL DE JAVASCRIPT
  - Este archivo se encarga de:
    1. Renderizar las cards de lugares en Home
    2. Detectar clic en un lugar
    3. Mostrar el detalle del lugar
    4. Renderizar el pronóstico semanal
    5. Calcular y mostrar estadísticas de la semana
    6. Volver a la vista principal
    7. Evitar que la página salte sola al detalle al cargar
========================================================= */


/* =========================================================
  REFERENCIAS A ELEMENTOS DEL DOM
  - Guardamos elementos importantes para usarlos varias veces
========================================================= */
const citiesGrid = document.getElementById("citiesGrid");
const homeSection = document.getElementById("homeSection");
const detailSection = document.getElementById("detailSection");
const detailContainer = document.getElementById("detailContainer");
const navHome = document.getElementById("navHome");
const navDetail = document.getElementById("navDetail");
const brandLink = document.getElementById("brandLink");

/* =========================================================
  VARIABLE GLOBAL
  - Guarda el último lugar seleccionado
  - Sirve para reutilizar el enlace "Detalle" de la navbar
========================================================= */
let currentPlace = null;

/* =========================================================
  FUNCIÓN: calcularEstadisticas(pronosticoSemanal)
  - Recibe el arreglo de pronóstico de un lugar
  - Calcula:
    * Temperatura mínima de la semana
    * Temperatura máxima de la semana
    * Promedio de temperatura de la semana (usando (min + max) / 2)
    * Cantidad de días por tipo de estado
    * Un resumen textual de la semana
========================================================= */
function calcularEstadisticas(pronosticoSemanal) {
  // Valores iniciales para min y max
  let minSemana = Infinity;
  let maxSemana = -Infinity;
  let sumaPromedios = 0;

  // Objeto para contar cuántos días hay de cada estado
  const conteoEstados = {};

  // Recorremos todos los días del pronóstico
  pronosticoSemanal.forEach((dia) => {
    // Actualizar mínimos y máximos de la semana
    if (dia.min < minSemana) {
      minSemana = dia.min;
    }
    if (dia.max > maxSemana) {
      maxSemana = dia.max;
    }

    // Promedio de ese día (min + max) / 2
    const promedioDia = (dia.min + dia.max) / 2;
    sumaPromedios += promedioDia;

    // Contar estados (ej. "Soleado", "Nublado", etc.)
    if (!conteoEstados[dia.estado]) {
      conteoEstados[dia.estado] = 1;
    } else {
      conteoEstados[dia.estado] += 1;
    }
  });

  // Promedio de la semana
  const cantidadDias = pronosticoSemanal.length;
  const promedioSemana = sumaPromedios / cantidadDias;

  // Generar resumen textual según el estado más frecuente
  let estadoDominante = null;
  let maxConteo = 0;

  for (const estado in conteoEstados) {
    if (conteoEstados[estado] > maxConteo) {
      maxConteo = conteoEstados[estado];
      estadoDominante = estado;
    }
  }

  // Texto de resumen básico, puedes ajustarlo a tu gusto
  let resumen = "Semana variada en cuanto al clima.";

  if (estadoDominante) {
    resumen = `Semana mayormente ${estadoDominante.toLowerCase()}.`;
  }

  // Devolvemos un objeto con todas las estadísticas
  return {
    minSemana,
    maxSemana,
    promedioSemana: Math.round(promedioSemana), // redondeamos para mostrar
    conteoEstados,
    resumen,
  };
}

/* =========================================================
  FUNCIÓN: renderCities()
  - Recorre el arreglo lugares
  - Crea una card Bootstrap por cada lugar
  - Inserta las cards dentro de citiesGrid
========================================================= */
function renderCities() {
  // Limpiamos el contenedor antes de volver a renderizar
  citiesGrid.innerHTML = "";

  // Recorremos el arreglo lugares definido en data.js
  lugares.forEach((place) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    // Card de lugar (antes usabas city.city, ahora nombre, etc.)
    col.innerHTML = `
      <article class="card place-card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h3 class="place-card__title h5 mb-1">${place.nombre}</h3>
              <p class="place-card__region text-secondary mb-0">${place.region}</p>
            </div>
            <div class="place-card__icon weather-icon" aria-hidden="true">${place.icono}</div>
          </div>

          <p class="place-card__temp display-6 fw-bold mb-1">${place.tempActual}°C</p>
          <p class="place-card__status text-secondary mb-3">${place.estadoActual}</p>

          <div class="mt-auto">
            <button
              type="button"
              class="btn btn-primary w-100 place-card__button"
              data-place-id="${place.id}"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </article>
    `;

    citiesGrid.appendChild(col);
  });

  // Después de crear las cards, agregamos los eventos
  addCardEvents();
}

/* =========================================================
  FUNCIÓN: addCardEvents()
  - Busca todos los botones "Ver detalle"
  - Les agrega el evento click
  - Cuando se pulsa uno, se busca el lugar correspondiente
========================================================= */
function addCardEvents() {
  const buttons = document.querySelectorAll("[data-place-id]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const placeId = button.getAttribute("data-place-id");
      // Buscamos el lugar en el arreglo lugares
      const selectedPlace = lugares.find((place) => place.id === placeId);

      if (selectedPlace) {
        showDetail(selectedPlace);
      }
    });
  });
}

/* =========================================================
  FUNCIÓN: showDetail(place)
  - Guarda el lugar actual
  - Oculta Home
  - Muestra la sección de detalle
  - Inserta temperatura, humedad, viento, pronóstico semanal
    y estadísticas de la semana
========================================================= */
function showDetail(place) {
  // Guardamos el lugar actual para la navegación
  currentPlace = place;

  // Alternamos visibilidad de secciones
  homeSection.style.display = "none";
  detailSection.style.display = "block";

  navHome.classList.remove("active");
  navDetail.classList.add("active");

  // Calculamos estadísticas a partir del pronóstico semanal
  const stats = calcularEstadisticas(place.pronosticoSemanal);

  // Generamos HTML del detalle, pronóstico y estadísticas
  detailContainer.innerHTML = `
    <!-- =====================================================
      HERO DEL DETALLE
      - Bloque principal del lugar seleccionado
    ====================================================== -->
    <section class="detail-hero p-4 p-md-5 mb-4 shadow-sm">
      <div class="row align-items-center g-4">
        <div class="col-12 col-md-8">
          <h2 id="detailTitle" class="display-6 fw-bold mb-2">${place.nombre}</h2>
          <p class="lead mb-2">${place.region}</p>
          <p class="mb-0">Estado actual: <strong>${place.estadoActual}</strong></p>
        </div>

        <div class="col-12 col-md-4 text-md-end">
          <div class="weather-icon display-1" aria-hidden="true">${place.icono}</div>
          <div class="h2 mb-0">${place.tempActual}°C</div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      DATOS PRINCIPALES
      - Temperatura actual
      - Humedad
      - Viento
    ====================================================== -->
    <section class="mb-4">
      <div class="row g-4">
        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Temperatura</h3>
              <p class="display-6 fw-bold mb-0">${place.tempActual}°C</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Humedad</h3>
              <p class="display-6 fw-bold mb-0">${place.humedad}%</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Viento</h3>
              <p class="display-6 fw-bold mb-0">${place.viento} km/h</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
      PRONÓSTICO SEMANAL
      - Genera una card por cada día del arreglo pronosticoSemanal
    ====================================================== -->
    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 class="h4 mb-0">Pronóstico semanal</h3>
        <span class="badge text-bg-primary">${place.pronosticoSemanal.length} días</span>
      </div>

      <div class="row g-3">
        ${place.pronosticoSemanal
          .map(
            (dia) => `
          <div class="col-12 col-sm-6 col-lg-4">
            <article class="card border-0 shadow-sm h-100">
              <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="h6 mb-1">${dia.dia}</h4>
                  <p class="mb-0 text-secondary">${dia.estado}</p>
                </div>
                <div class="text-end">
                  <div class="weather-icon" aria-hidden="true">${place.icono}</div>
                  <strong>${dia.min}°C – ${dia.max}°C</strong>
                </div>
              </div>
            </article>
          </div>
        `,
          )
          .join("")}
      </div>
    </section>

    <!-- =====================================================
      ESTADÍSTICAS DE LA SEMANA
      - Mínimo, máximo, promedio y conteo de estados
      - Resumen textual generado desde JS
    ====================================================== -->
    <section class="mb-4">
      <h3 class="h4 mb-3">Estadísticas de la semana</h3>

      <div class="row g-4 mb-3">
        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h4 class="h6 text-secondary">Mínima semanal</h4>
              <p class="display-6 fw-bold mb-0">${stats.minSemana}°C</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h4 class="h6 text-secondary">Máxima semanal</h4>
              <p class="display-6 fw-bold mb-0">${stats.maxSemana}°C</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h4 class="h6 text-secondary">Promedio semanal</h4>
              <p class="display-6 fw-bold mb-0">${stats.promedioSemana}°C</p>
            </div>
          </article>
        </div>
      </div>

      <div class="mb-3">
        <h4 class="h6 text-secondary mb-2">Días por tipo de clima</h4>
        <div class="d-flex flex-wrap gap-2">
          ${Object.entries(stats.conteoEstados)
            .map(
              ([estado, cantidad]) => `
            <span class="badge text-bg-secondary">
              ${estado}: ${cantidad} día(s)
            </span>
          `,
            )
            .join("")}
        </div>
      </div>

      <p class="mb-0">
        <strong>Resumen:</strong> ${stats.resumen}
      </p>
    </section>

    <!-- ===================================================
      BOTÓN PARA VOLVER A INICIO
    ==================================================== -->
    <section class="mt-4">
      <button type="button" class="btn btn-outline-primary back-btn" id="backButton">
        Volver al inicio
      </button>
    </section>
  `;

  // Agregamos el evento al botón dinámico
  addBackEvent();

  /* =======================================================
    SCROLL CONTROLADO AL DETALLE
    - Solo se hace cuando el usuario realmente elige un lugar
    - Así evitamos que ocurra automáticamente al cargar la página
  ======================================================== */
  detailSection.scrollIntoView({ behavior: "smooth" });
}

/* =========================================================
  FUNCIÓN: showHome()
  - Oculta el detalle
  - Muestra nuevamente la Home
  - Actualiza la navbar
========================================================= */
function showHome() {
  detailSection.style.display = "none";
  homeSection.style.display = "block";

  navDetail.classList.remove("active");
  navHome.classList.add("active");
}

/* =========================================================
  FUNCIÓN: addBackEvent()
  - Agrega el evento al botón dinámico para volver al inicio
========================================================= */
function addBackEvent() {
  const backButton = document.getElementById("backButton");

  if (backButton) {
    backButton.addEventListener("click", () => {
      showHome();

      /* =====================================================
        SCROLL CONTROLADO A LA PARTE SUPERIOR
        - Al volver al inicio, llevamos al usuario arriba
      ====================================================== */
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

/* =========================================================
  EVENTOS DE NAVEGACIÓN
  - Home vuelve al inicio sin recargar
  - La marca también vuelve al inicio
  - Detalle solo funciona si ya hay un lugar seleccionado
========================================================= */
navHome.addEventListener("click", (event) => {
  event.preventDefault();
  showHome();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  showHome();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

navDetail.addEventListener("click", (event) => {
  event.preventDefault();

  if (currentPlace) {
    showDetail(currentPlace);
  }
});

/* =========================================================
  INICIALIZACIÓN DE LA APP
  - Se ejecuta cuando el HTML termina de cargar
  - Renderiza los lugares
  - Muestra Home por defecto
  - Fuerza que la página comience arriba
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderCities();
  showHome();

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
});