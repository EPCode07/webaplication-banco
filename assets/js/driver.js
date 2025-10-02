const driver = window.driver.js.driver;

const driverObj = driver({
  onPopoverRender: (popover) => {
    popover.nextButton.style.background = "#3b82f6";
  },

  popoverClass: "driverjs-theme",
  showcloseButton: false,
  steps: [
    {
      element: "#navMenu",
      popover: {
        title: "Menú de Navegación",
        description:
          "Desde aquí accedes a todas las secciones principales del banco: inico, servicios, productos y más.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#loginBtn",
      popover: {
        title: "Iniciar Sesión",
        description:
          "Accede a tu banca en línea de forma segura ingresando tu usuario y contraseña.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#openAccountBtn",
      popover: {
        title: "Abrir una Cuenta",
        description:
          "Desde aquí puedes crear una nueva cuenta bancaria en minutos, sin necesidad de ir a la sucursal.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#seeProductsBtn",
      popover: {
        title: "Nuestros Productos",
        description:
          "Explora tarjetas de crédito, préstamos personales, cuentas de ahorro y otros servicios financieros.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#servicesGrid",
      popover: {
        title: "Servicios en Línea",
        description:
          "Creditos hipotecarios, inversiones, creditos vehiculares, y otros servicios financieros.",
        side: "left",
        align: "start",
      },
    },

    {
      element: "#productsGrid",
      popover: {
        title: "Catálogo de Productos",
        description:
          "Aquí encuentras información detallada de cada producto financiero, con beneficios y requisitos.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#creditCalculator",
      popover: {
        title: "Simulador de Créditos",
        description:
          "Calcula cuotas y plazos para préstamos o créditos según tus necesidades antes de solicitarlos.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#socialMediaContainer",
      popover: {
        title: "Redes Sociales",
        description:
          "Accede a nuestras redes sociales para estar al tanto de las noticias financieras y promociones.",
        side: "left",
        align: "start",
      },
    },
  ],
  showButtons: ["next", "previous"],
  nextBtnText: "Siguiente ➡️",
  prevBtnText: "⬅️ Anterior",
  doneBtnText: "Finalizar ✅",
});

setTimeout(() => {
  driverObj.drive();
}, 7000);
