// ===== INICIALIZACIÓN GENERAL =====
document.addEventListener("DOMContentLoaded", function () {
  initializePage();
});

function initializePage() {
  // Smooth scrolling
  initSmoothScrolling();

  // Scroll animations
  initScrollAnimations();

  // Mobile menu
  initMobileMenu();

  // FAQ functionality
  initFAQ();

  // Loan calculator
  initLoanCalculator();

  // Map and locations
  initLocationSystem();
}

// ===== SCROLL Y ANIMACIONES =====
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

// ===== COMPONENTES DE INTERFAZ =====
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");

  if (mobileMenuBtn && navMenu) {
    // abrir/cerrar con el botón
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileMenuBtn.innerHTML = navMenu.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // cerrar menú y volver a icono "bars" cuando se presiona un enlace
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}


function initFAQ() {
  function toggleFAQ(element) {
    element.classList.toggle("active");
  }

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      toggleFAQ(question.parentElement);
    });
  });
}

// ===== CALCULADORA DE PRÉSTAMOS =====
function initLoanCalculator() {
  updateInterestRate();

  const loanAmountRange = document.getElementById("loanAmountRange");
  const loanAmountInput = document.getElementById("loanAmount");

  if (loanAmountRange) {
    loanAmountRange.style.width = "100%";
    loanAmountRange.style.marginTop = "0.5rem";
  }

  if (loanAmountInput) {
    loanAmountInput.addEventListener("input", function () {
      document.getElementById("loanAmountRange").value = this.value;
    });
  }
}

function updateLoanAmount(value) {
  document.getElementById("loanAmount").value = value;
}

function updateInterestRate() {
  const loanType = document.getElementById("loanType").value;
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

  document.getElementById("interestRate").value = interestRate;
}

function calculateLoan() {
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const loanTerm = parseInt(document.getElementById("loanTerm").value);
  const interestRate = parseFloat(
    document.getElementById("interestRate").value
  );

  if (isNaN(loanAmount) || isNaN(loanTerm) || isNaN(interestRate)) {
    alert("Por favor, complete todos los campos correctamente.");
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

  document.getElementById("resultContent").innerHTML = `
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

// ===== SISTEMA DE UBICACIONES Y MAPA (VERSIÓN CORREGIDA) =====
let map = null;
let userLocationMarker = null;
let branchMarkers = [];
let currentFilterState = {
    cityFilter: '',
    serviceFilter: '',
    searchText: ''
};

function initLocationSystem() {
    const listView = document.getElementById("listView");
    if (listView) {
        listView.classList.add("hidden");
    }
    
    // Inicializar el estado de filtros
    currentFilterState = {
        cityFilter: document.getElementById("citySearch").value,
        serviceFilter: document.getElementById("serviceFilter").value,
        searchText: document.getElementById("locationSearch").value.toLowerCase()
    };
}


function showView(viewName) {
    // Ocultar todos los contenedores y desactivar botones
    document.querySelectorAll(".view-container").forEach((container) => {
        container.classList.remove("active");
        container.classList.add("hidden");
    });
    
    document.querySelectorAll(".toggle-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    // Mostrar el contenedor seleccionado y activar su botón
    const selectedView = document.getElementById(viewName + "View");
    selectedView.classList.add("active");
    selectedView.classList.remove("hidden");

    document.querySelector(`.toggle-btn[onclick="showView('${viewName}')"]`).classList.add("active");

    // Manejar la lógica específica de cada vista
    if (viewName === "list") {
        showListView();
    } else if (viewName === "map") {
        showMapView();
    }
}

function showListView() {
    // Aplicar filtros actuales a la lista
    applyFiltersToList();
    
    // Ocultar mensaje de no resultados si existe
    const noResultsMessage = document.getElementById("noResultsMessage");
    if (noResultsMessage) {
        noResultsMessage.classList.add("hidden");
    }
}

function showMapView() {
    // Si el mapa no está inicializado, inicializarlo
    if (!map) {
        initMap();
    } else {
        // Si ya está inicializado, actualizar el tamaño y los marcadores
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
                // Aplicar filtros actuales al mapa
                applyFiltersToMap();
            }
        }, 100);
    }
    
    // Ocultar mensaje de no resultados
    const noResultsMessage = document.getElementById("noResultsMessage");
    if (noResultsMessage) {
        noResultsMessage.classList.add("hidden");
    }
}


function applyFiltersToList() {
    const { cityFilter, serviceFilter, searchText } = currentFilterState;
    const locationItems = document.querySelectorAll(".location-item");
    const listView = document.getElementById("listView");
    let hasVisibleItems = false;

    // Primero ocultar todos los items
    locationItems.forEach((item) => {
        item.style.display = "none";
    });

    // Mostrar solo los items que coincidan con los filtros actuales
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
        }
    });

    // Manejar la visibilidad de la lista y el mensaje de no resultados
    const hasActiveFilters = cityFilter || serviceFilter || searchText;
    
    if (hasActiveFilters) {
        if (hasVisibleItems) {
            // Hay resultados: mostrar lista
            listView.classList.remove("hidden");
        } else {
            // No hay resultados: mostrar mensaje
            listView.classList.add("hidden");
            showNoResultsMessage();
        }
    } else {
        // Sin filtros activos: mostrar todos los items
        locationItems.forEach((item) => {
            item.style.display = "block";
        });
        listView.classList.remove("hidden");
    }
}

function applyFiltersToMap() {
    // Actualizar los marcadores del mapa según los filtros actuales
    addBranchMarkers();
}

function addBranchMarkers() {
    // Limpiar marcadores existentes
    branchMarkers.forEach((marker) => map.removeLayer(marker));
    branchMarkers = [];

    const { cityFilter, serviceFilter, searchText } = currentFilterState;
    const locationItems = document.querySelectorAll(".location-item");

    locationItems.forEach((item) => {
        const city = item.getAttribute("data-city");
        const service = item.getAttribute("data-service");
        const title = item.querySelector("h4").textContent.toLowerCase();

        const cityMatch = !cityFilter || city === cityFilter;
        const serviceMatch = !serviceFilter || service === serviceFilter;
        const searchMatch = !searchText || title.includes(searchText);

        // Solo agregar marcadores que coincidan con los filtros
        if (cityMatch && serviceMatch && searchMatch) {
            const lat = parseFloat(item.getAttribute("data-lat"));
            const lng = parseFloat(item.getAttribute("data-lng"));
            const address = item.querySelector("p").textContent.replace("Dirección: ", "");

            let iconUrl;
            switch (service) {
                case "branch":
                    iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";
                    break;
                case "atm":
                    iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png";
                    break;
                case "express":
                    iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
                    break;
                default:
                    iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
            }

            const customIcon = L.icon({
                iconUrl: iconUrl,
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
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
        }
    });

    // Ajustar la vista del mapa para mostrar todos los marcadores visibles
    if (branchMarkers.length > 0) {
        const group = new L.featureGroup(branchMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    } else {
        // Si no hay marcadores, centrar en Perú
        map.setView([-9.19, -75.0152], 6);
    }
}

function filterLocations() {
    // Actualizar el estado actual de los filtros
    currentFilterState = {
        cityFilter: document.getElementById("citySearch").value,
        serviceFilter: document.getElementById("serviceFilter").value,
        searchText: document.getElementById("locationSearch").value.toLowerCase()
    };

    // Aplicar filtros según la vista activa
    const activeView = document.querySelector('.view-container.active').id;
    
    if (activeView === 'listView') {
        applyFiltersToList();
    } else if (activeView === 'mapView') {
        applyFiltersToMap();
    }
}

function filterLocationsAndMap() {
    filterLocations();
}

function showNoResultsMessage() {
    let noResultsMessage = document.getElementById("noResultsMessage");
    
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
        listView.parentNode.insertBefore(noResultsMessage, listView.nextSibling);
    }
    
    noResultsMessage.classList.remove("hidden");
}

// El resto de las funciones (focusOnMap, locateUser, etc.) se mantienen igual...
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
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            });

            userLocationMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
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
            alert("No se pudo obtener tu ubicación. Asegúrate de haber dado los permisos necesarios.");
            console.error("Error getting location:", error);
        }
    );
}

function getServiceName(serviceCode) {
    const services = {
        branch: "Sucursal Completa",
        atm: "Cajero Automático",
        express: "Agente Express",
    };
    return services[serviceCode] || serviceCode;
}
function initMap() {
  map = L.map("map").setView([-9.19, -75.0152], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  addBranchMarkers();
}
// ===== FUNCIONES DE ALERTAS =====
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
