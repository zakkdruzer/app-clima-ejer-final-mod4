/* =========================================================
  ARCHIVO PRINCIPAL DE JAVASCRIPT
  - Este archivo se encarga de:
    1. Renderizar las cards de ciudades en Home
    2. Detectar clic en una ciudad
    3. Mostrar el detalle de la localidad
    4. Renderizar el pronóstico semanal
    5. Volver a la vista principal
    6. Evitar que la página salte sola al detalle al cargar
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
  - Guarda la última ciudad seleccionada
  - Sirve para reutilizar el enlace "Detalle" de la navbar
========================================================= */
let currentCity = null;

/* =========================================================
  FUNCIÓN: renderCities()
  - Recorre weatherData
  - Crea una card Bootstrap por cada ciudad
  - Inserta las cards dentro de citiesGrid
========================================================= */
function renderCities() {
  citiesGrid.innerHTML = "";

  weatherData.forEach((city) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    col.innerHTML = `
  <article class="card place-card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="place-card__title h5 mb-1">${city.city}</h3>
          <p class="place-card__region text-secondary mb-0">${city.region}</p>
        </div>
        <div class="place-card__icon weather-icon" aria-hidden="true">${city.icon}</div>
      </div>

      <p class="place-card__temp display-6 fw-bold mb-1">${city.temp}°C</p>
      <p class="place-card__status text-secondary mb-3">${city.status}</p>

      <div class="mt-auto">
        <button
          type="button"
          class="btn btn-primary w-100 place-card__button"
          data-city-id="${city.id}"
        >
          Ver detalle
        </button>
      </div>
    </div>
  </article>
`;

    citiesGrid.appendChild(col);
  });

  addCardEvents();
}

/* =========================================================
  FUNCIÓN: addCardEvents()
  - Busca todos los botones "Ver detalle"
  - Les agrega el evento click
  - Cuando se pulsa uno, se busca la ciudad correspondiente
========================================================= */
function addCardEvents() {
  const buttons = document.querySelectorAll("[data-city-id]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const cityId = button.getAttribute("data-city-id");
      const selectedCity = weatherData.find((city) => city.id === cityId);

      if (selectedCity) {
        showDetail(selectedCity);
      }
    });
  });
}

/* =========================================================
  FUNCIÓN: showDetail(city)
  - Guarda la ciudad actual
  - Oculta Home
  - Muestra la sección de detalle
  - Inserta temperatura, humedad, viento y pronóstico semanal
========================================================= */
function showDetail(city) {
  currentCity = city;

  homeSection.style.display = "none";
  detailSection.style.display = "block";

  navHome.classList.remove("active");
  navDetail.classList.add("active");

  detailContainer.innerHTML = `
    <!-- =====================================================
      HERO DEL DETALLE
      - Bloque principal de la ciudad seleccionada
    ====================================================== -->
    <section class="detail-hero p-4 p-md-5 mb-4 shadow-sm">
      <div class="row align-items-center g-4">
        <div class="col-12 col-md-8">
          <h2 id="detailTitle" class="display-6 fw-bold mb-2">${city.city}</h2>
          <p class="lead mb-2">${city.region}</p>
          <p class="mb-0">Estado actual: <strong>${city.status}</strong></p>
        </div>

        <div class="col-12 col-md-4 text-md-end">
          <div class="weather-icon display-1" aria-hidden="true">${city.icon}</div>
          <div class="h2 mb-0">${city.temp}°C</div>
        </div>
      </div>
    </section>

    <!-- =====================================================
      DATOS PRINCIPALES
      - Temperatura
      - Humedad
      - Viento
    ====================================================== -->
    <section class="mb-4">
      <div class="row g-4">
        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Temperatura</h3>
              <p class="display-6 fw-bold mb-0">${city.temp}°C</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Humedad</h3>
              <p class="display-6 fw-bold mb-0">${city.humidity}%</p>
            </div>
          </article>
        </div>

        <div class="col-12 col-md-4">
          <article class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <h3 class="h6 text-secondary">Viento</h3>
              <p class="display-6 fw-bold mb-0">${city.wind} km/h</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
      PRONÓSTICO SEMANAL
      - Genera una card por cada día del arreglo forecast
    ====================================================== -->
    <section>
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 class="h4 mb-0">Pronóstico semanal</h3>
        <span class="badge text-bg-primary">7 días</span>
      </div>

      <div class="row g-3">
        ${city.forecast
          .map(
            (day) => `
          <div class="col-12 col-sm-6 col-lg-4">
            <article class="card border-0 shadow-sm h-100">
              <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="h6 mb-1">${day.day}</h4>
                  <p class="mb-0 text-secondary">${day.status}</p>
                </div>
                <div class="text-end">
                  <div class="weather-icon" aria-hidden="true">${day.icon}</div>
                  <strong>${day.temp}°C</strong>
                </div>
              </div>
            </article>
          </div>
        `,
          )
          .join("")}
      </div>

      <!-- ===================================================
        BOTÓN PARA VOLVER A INICIO
      ==================================================== -->
      <button type="button" class="btn btn-outline-primary back-btn" id="backButton">
        Volver al inicio
      </button>
    </section>
  `;

  addBackEvent();

  /* =======================================================
    SCROLL CONTROLADO AL DETALLE
    - Solo se hace cuando el usuario realmente elige una ciudad
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
  - Detalle solo funciona si ya hay una ciudad seleccionada
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

  if (currentCity) {
    showDetail(currentCity);
  }
});

/* =========================================================
  INICIALIZACIÓN DE LA APP
  - Se ejecuta cuando el HTML termina de cargar
  - Renderiza las ciudades
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
