// ===========================================
//          script_index.js
// ===========================================

// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener("DOMContentLoaded", function () {
  initializePage();
});

/**
 * Función principal que llama a todas las funciones de inicialización.
 */
function initializePage() {
  // Scroll y Animaciones
  initSmoothScrolling();
  initScrollAnimations();
  initStickyHeader(); // <-- Nueva función para el header dinámico

  // Componentes de Interfaz
  initMobileMenu();
  initFAQ();

  // Lógica Específica
  initLoanCalculator();
  initLocationSystem();
}

// -------------------------------------------
// ===== SCROLL Y ANIMACIONES
// -------------------------------------------

/**
 * Inicializa el desplazamiento suave (smooth scrolling) para los enlaces de anclaje.
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Inicializa la funcionalidad de mostrar/ocultar el header al hacer scroll.
 */
function initStickyHeader() {
  const header = document.querySelector(".header");
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  window.addEventListener("scroll", function () {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;

    // Mostrar siempre cerca de la parte superior
    if (currentScroll <= scrollThreshold) {
      header.classList.remove("header-hidden");
      lastScrollTop = currentScroll;
      return;
    }

    // SCROLL HACIA ABAJO (Ocultar)
    if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
      header.classList.add("header-hidden");
    }

    // SCROLL HACIA ARRIBA (Mostrar)
    else if (currentScroll < lastScrollTop) {
      header.classList.remove("header-hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}

/**
 * Inicializa las animaciones de aparición al hacer scroll (Intersection Observer).
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".service-card, .product-card, .news-card, .location-item"
    )
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "all 0.6s ease";
      observer.observe(card);
    });
}

// -------------------------------------------
// ===== COMPONENTES DE INTERFAZ
// -------------------------------------------

/**
 * Inicializa la funcionalidad de abrir/cerrar el menú móvil.
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");

  if (mobileMenuBtn && navMenu) {
    // Abrir/cerrar con el botón
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      // Actualizar icono de ARIA y texto del botón
      const isActive = navMenu.classList.contains("active");
      mobileMenuBtn.innerHTML = isActive
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
      mobileMenuBtn.setAttribute("aria-expanded", isActive);
    });

    // Cerrar menú cuando se presiona un enlace
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/**
 * Inicializa la funcionalidad de acordeón para las Preguntas Frecuentes (FAQ).
 */
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      question.parentElement.classList.toggle("active");
    });
  });
}

// -------------------------------------------
// ===== CALCULADORA DE PRÉSTAMOS
// -------------------------------------------

/**
 * Inicializa la lógica de la calculadora de préstamos.
 */
function initLoanCalculator() {
  const loanAmountRange = document.getElementById("loanAmountRange");
  const loanAmountInput = document.getElementById("loanAmount");
  const loanTypeSelect = document.getElementById("loanType");
  const loanTermSelect = document.getElementById("loanTerm");

  // Configurar el slider/input para que estén sincronizados
  if (loanAmountRange && loanAmountInput) {
    loanAmountRange.addEventListener("input", function () {
      loanAmountInput.value = this.value;
      // Recalcular la cuota automáticamente al cambiar el valor
      calculateLoan();
    });
    loanAmountInput.addEventListener("input", function () {
      loanAmountRange.value = this.value;
      // Recalcular la cuota automáticamente al cambiar el valor
      calculateLoan();
    });
  }

  // Configurar selects para que actualicen el interés automáticamente
  if (loanTypeSelect && loanTermSelect) {
    loanTypeSelect.addEventListener("change", updateInterestRateAndRecalculate);
    loanTermSelect.addEventListener("change", calculateLoan);
  }

  // Inicializar la tasa de interés y el cálculo al cargar
  updateInterestRate();
}

/**
 * Actualiza la tasa de interés basada en el tipo de préstamo y recalcula.
 */
function updateInterestRateAndRecalculate() {
  updateInterestRate();
  calculateLoan();
}

/**
 * Sincroniza el input number con el slider (Usada en el HTML, pero se recomienda mover la lógica a initLoanCalculator).
 * NOTA: Esta función queda solo por si es llamada en el HTML.
 * @param {string} value - El valor del monto.
 */
function updateLoanAmount(value) {
  document.getElementById("loanAmount").value = value;
}

/**
 * Determina y muestra la tasa de interés anual según el tipo de préstamo.
 */
function updateInterestRate() {
  const loanType = document.getElementById("loanType")?.value || "personal";
  let interestRate;

  switch (loanType) {
    case "personal":
      interestRate = 15.5;
      break;
    case "vehicular":
      interestRate = 9.8;
      break;
    case "hipotecario":
      interestRate = 7.2;
      break;
    default:
      interestRate = 15.5;
  }

  const interestInput = document.getElementById("interestRate");
  if (interestInput) {
    interestInput.value = interestRate;
  }
}

/**
 * Realiza el cálculo del préstamo y actualiza el resultado en la interfaz.
 */
function calculateLoan() {
  const loanAmount = parseFloat(document.getElementById("loanAmount")?.value);
  const loanTerm = parseInt(document.getElementById("loanTerm")?.value);
  const interestRate = parseFloat(
    document.getElementById("interestRate")?.value
  );

  const resultContent = document.getElementById("resultContent");

  if (
    isNaN(loanAmount) ||
    isNaN(loanTerm) ||
    isNaN(interestRate) ||
    loanAmount <= 0
  ) {
    if (resultContent) {
      resultContent.innerHTML = `<p class="text-center" style="text-align: center;">Complete los datos y haga clic en "Calcular Cuota"</p>`;
    }
    return;
  }

  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -loanTerm));
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  const formatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  });

  if (resultContent) {
    resultContent.innerHTML = `
            <div class="result-item">
                <span>Cuota Mensual:</span>
                <strong>${formatter.format(monthlyPayment.toFixed(2))}</strong>
            </div>
            <div class="result-item">
                <span>Total a Pagar:</span>
                <strong>${formatter.format(totalPayment.toFixed(2))}</strong>
            </div>
            <div class="result-item">
                <span>Total de Intereses:</span>
                <strong>${formatter.format(totalInterest.toFixed(2))}</strong>
            </div>
            <div class="result-item">
                <span>Monto del Préstamo:</span>
                <strong>${formatter.format(loanAmount)}</strong>
            </div>
            <div class="result-item">
                <span>Plazo:</span>
                <strong>${loanTerm} meses</strong>
            </div>
            <div class="result-total">
                Tasa de interés anual: ${interestRate}%
            </div>
        `;
  }
}

// -------------------------------------------
// ===== SISTEMA DE UBICACIONES Y MAPA
// -------------------------------------------

let map = null;
let userLocationMarker = null;
let branchMarkers = [];
let currentFilterState = {
  cityFilter: "",
  serviceFilter: "",
  searchText: "",
};

/**
 * Inicializa la lógica del sistema de ubicaciones (filtros y vistas).
 */
function initLocationSystem() {
  const listView = document.getElementById("listView");
  if (listView) {
    listView.classList.add("active"); // Iniciar en vista de lista por defecto
  }

  // Inicializar el estado de filtros y vincular eventos de cambio
  const citySearch = document.getElementById("citySearch");
  const serviceFilter = document.getElementById("serviceFilter");
  const locationSearch = document.getElementById("locationSearch");

  currentFilterState = {
    cityFilter: citySearch?.value || "",
    serviceFilter: serviceFilter?.value || "",
    searchText: locationSearch?.value.toLowerCase() || "",
  };

  if (citySearch) citySearch.addEventListener("change", filterLocations);
  if (serviceFilter) serviceFilter.addEventListener("change", filterLocations);
  if (locationSearch) locationSearch.addEventListener("keyup", filterLocations);

  // Mostrar la lista inicial
  applyFiltersToList();
}

/**
 * Inicializa el mapa de Leaflet.
 */
function initMap() {
  if (typeof L === "undefined") {
    console.error(
      "Leaflet.js no está cargado. Asegúrate de incluir el script."
    );
    return;
  }

  map = L.map("map").setView([-9.19, -75.0152], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  addBranchMarkers();
}

/**
 * Cambia entre la vista de lista y la vista de mapa.
 * @param {string} viewName - 'list' o 'map'.
 */
function showView(viewName) {
  document.querySelectorAll(".view-container").forEach((container) => {
    container.classList.remove("active");
    container.classList.add("hidden");
  });

  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const selectedView = document.getElementById(viewName + "View");
  selectedView.classList.add("active");
  selectedView.classList.remove("hidden");

  document
    .querySelector(`.toggle-btn[onclick="showView('${viewName}')"]`)
    .classList.add("active");

  if (viewName === "list") {
    applyFiltersToList();
  } else if (viewName === "map") {
    if (!map) {
      initMap();
    } else {
      // Asegurar que el mapa se redibuje correctamente si estaba oculto
      setTimeout(() => {
        map.invalidateSize();
        applyFiltersToMap();
      }, 100);
    }
  }
  hideNoResultsMessage(); // Asegurar que el mensaje de no resultados se oculte al cambiar de vista
}

/**
 * Aplica los filtros actuales a los elementos de la lista.
 */
function applyFiltersToList() {
  const { cityFilter, serviceFilter, searchText } = currentFilterState;
  const locationItems = document.querySelectorAll(".location-item");
  let hasVisibleItems = false;

  locationItems.forEach((item) => {
    const city = item.getAttribute("data-city");
    const service = item.getAttribute("data-service");
    const title = item.querySelector("h4").textContent.toLowerCase();

    const cityMatch = !cityFilter || city === cityFilter;
    const serviceMatch = !serviceFilter || service === serviceFilter;
    const searchMatch = !searchText || title.includes(searchText);

    if (cityMatch && serviceMatch && searchMatch) {
      item.style.display = "block";
      hasVisibleItems = true;
    } else {
      item.style.display = "none";
    }
  });

  // Mostrar mensaje de no resultados si es necesario
  if (!hasVisibleItems) {
    showNoResultsMessage();
  } else {
    hideNoResultsMessage();
  }
}

/**
 * Aplica los filtros actuales a los marcadores del mapa.
 */
function applyFiltersToMap() {
  addBranchMarkers();
}

/**
 * Agrega marcadores al mapa según el estado de los filtros.
 */
function addBranchMarkers() {
  // Limpiar marcadores existentes
  branchMarkers.forEach((marker) => map.removeLayer(marker));
  branchMarkers = [];

  const { cityFilter, serviceFilter, searchText } = currentFilterState;
  const locationItems = document.querySelectorAll(".location-item");
  let hasVisibleMarkers = false;

  locationItems.forEach((item) => {
    const city = item.getAttribute("data-city");
    const service = item.getAttribute("data-service");
    const title = item.querySelector("h4").textContent.toLowerCase();

    const cityMatch = !cityFilter || city === cityFilter;
    const serviceMatch = !serviceFilter || service === serviceFilter;
    const searchMatch = !searchText || title.includes(searchText);

    if (cityMatch && serviceMatch && searchMatch) {
      const lat = parseFloat(item.getAttribute("data-lat"));
      const lng = parseFloat(item.getAttribute("data-lng"));
      const address = item
        .querySelector("p")
        .textContent.replace("Dirección: ", "");

      // ... (Lógica de Iconos y Marcadores) ...
      let iconUrl;
      switch (service) {
        case "branch":
          iconUrl =
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";
          break;
        case "atm":
          iconUrl =
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png";
          break;
        case "express":
          iconUrl =
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
          break;
        default:
          iconUrl =
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
      }

      const customIcon = L.icon({
        iconUrl: iconUrl,
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
                <div class="leaflet-popup-content">
                    <h4>${item.querySelector("h4").textContent}</h4>
                    <p><strong>Dirección:</strong> ${address}</p>
                    <p><strong>Servicio:</strong> ${getServiceName(service)}</p>
                </div>
            `);

      branchMarkers.push(marker);
      hasVisibleMarkers = true;
    }
  });

  // Ajustar la vista del mapa
  if (hasVisibleMarkers) {
    const group = new L.featureGroup(branchMarkers);
    map.fitBounds(group.getBounds().pad(0.1));
  } else {
    map.setView([-9.19, -75.0152], 6); // Centrar en Perú si no hay resultados
  }
}

/**
 * Centraliza la actualización del estado de los filtros y su aplicación.
 */
function filterLocations() {
  // Actualizar el estado de filtros
  currentFilterState = {
    cityFilter: document.getElementById("citySearch")?.value || "",
    serviceFilter: document.getElementById("serviceFilter")?.value || "",
    searchText:
      document.getElementById("locationSearch")?.value.toLowerCase() || "",
  };

  // Aplicar filtros a la vista activa
  const activeView = document.querySelector(".view-container.active")?.id;

  if (activeView === "listView") {
    applyFiltersToList();
  } else if (activeView === "mapView") {
    applyFiltersToMap();
  }
}

/**
 * Centra el mapa en una ubicación específica y abre su popup.
 * @param {number} lat - Latitud.
 * @param {number} lng - Longitud.
 */
function focusOnMap(lat, lng) {
  showView("map");

  if (!map) {
    initMap();
  }

  map.setView([lat, lng], 15);

  branchMarkers.forEach((marker) => {
    const markerLatLng = marker.getLatLng();
    if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  });
}

/**
 * Intenta localizar al usuario y muestra un marcador en el mapa.
 */
function locateUser() {
  if (!navigator.geolocation) {
    alert("La geolocalización no es soportada por tu navegador.");
    return;
  }

  showView("map");
  if (!map) initMap();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
      }

      const userIcon = L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      userLocationMarker = L.marker([userLat, userLng], {
        icon: userIcon,
      }).addTo(map);
      userLocationMarker.bindPopup("<b>¡Estás aquí!</b>").openPopup();

      map.setView([userLat, userLng], 13);

      L.circle([userLat, userLng], {
        color: "blue",
        fillColor: "#0388fc",
        fillOpacity: 0.1,
        radius: position.coords.accuracy / 2,
      }).addTo(map);
    },
    (error) => {
      alert(
        "No se pudo obtener tu ubicación. Asegúrate de haber dado los permisos necesarios."
      );
      console.error("Error getting location:", error);
    }
  );
}

/**
 * Muestra el mensaje de 'no resultados' para los filtros.
 */
function showNoResultsMessage() {
  let noResultsMessage = document.getElementById("noResultsMessage");
  const container = document.querySelector(".location-display");

  if (!noResultsMessage) {
    noResultsMessage = document.createElement("div");
    noResultsMessage.id = "noResultsMessage";
    noResultsMessage.style.textAlign = "center";
    noResultsMessage.style.padding = "2rem";
    noResultsMessage.style.color = "var(--text-light)";
    noResultsMessage.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>No se encontraron sucursales</h3>
            <p>Intenta con otros criterios de búsqueda</p>
        `;

    const listView = document.getElementById("listView");
    if (container && listView) {
      container.insertBefore(noResultsMessage, listView);
    }
  }

  const listView = document.getElementById("listView");
  if (listView) listView.style.display = "none";
  noResultsMessage.style.display = "block";
}

/**
 * Oculta el mensaje de 'no resultados'.
 */
function hideNoResultsMessage() {
  const noResultsMessage = document.getElementById("noResultsMessage");
  const listView = document.getElementById("listView");

  if (noResultsMessage) {
    noResultsMessage.style.display = "none";
  }
  if (listView && listView.classList.contains("active")) {
    listView.style.display = "block";
  }
}

/**
 * Obtiene el nombre completo del servicio basado en su código.
 * @param {string} serviceCode - Código del servicio (e.g., 'atm').
 * @returns {string} El nombre completo.
 */
function getServiceName(serviceCode) {
  const services = {
    branch: "Sucursal Completa",
    atm: "Cajero Automático",
    express: "Agente Express",
  };
  return services[serviceCode] || serviceCode;
}

// -------------------------------------------
// ===== FUNCIONES DE ALERTAS
// -------------------------------------------

function showLoginAlert() {
  alert(
    "Redirigiendo a la Banca en Línea...\n\nEn la siguiente fase implementaremos el sistema completo de banca digital."
  );
}

function showAccountAlert() {
  alert(
    "Formulario de apertura de cuenta\n\nEn la implementación completa, aquí se abriría un formulario detallado para la apertura de cuenta."
  );
}

function showProductAlert(product) {
  alert(
    `Solicitud de ${product}\n\nEn la implementación completa, se procesaría la solicitud del producto seleccionado.`
  );
}
