// ===== SISTEMA DE NOTIFICACIONES PROFESIONAL =====
class NotificationSystem {
    constructor() {
        this.initializeSystem();
    }

    initializeSystem() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('customAlert')) {
            this.createAlertContainer();
        }
    }

    createAlertContainer() {
        const alertHTML = `
            <div id="customAlert" class="custom-alert">
                <div class="alert-overlay"></div>
                <div class="alert-container">
                    <div class="alert-header">
                        <i class="alert-icon"></i>
                        <h3 class="alert-title"></h3>
                        <button class="alert-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="alert-content">
                        <p class="alert-message"></p>
                    </div>
                    <div class="alert-footer">
                        <button class="alert-btn alert-btn-primary">Aceptar</button>
                        <button class="alert-btn alert-btn-secondary">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        this.bindEvents();
    }

    bindEvents() {
        const alert = document.getElementById('customAlert');
        const closeBtn = alert.querySelector('.alert-close');
        const overlay = alert.querySelector('.alert-overlay');
        const primaryBtn = alert.querySelector('.alert-btn-primary');
        const secondaryBtn = alert.querySelector('.alert-btn-secondary');

        [closeBtn, overlay, primaryBtn, secondaryBtn].forEach(element => {
            element.addEventListener('click', () => this.hide());
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && alert.classList.contains('active')) {
                this.hide();
            }
        });
    }

    show(config) {
        const {
            title,
            message,
            type = 'info',
            icon = null,
            showCancel = false,
            confirmText = 'Aceptar',
            cancelText = 'Cancelar',
            onConfirm = null,
            onCancel = null
        } = config;

        const alert = document.getElementById('customAlert');
        const alertIcon = alert.querySelector('.alert-icon');
        const alertTitle = alert.querySelector('.alert-title');
        const alertMessage = alert.querySelector('.alert-message');
        const primaryBtn = alert.querySelector('.alert-btn-primary');
        const secondaryBtn = alert.querySelector('.alert-btn-secondary');

        // Configurar icono y tipo
        alertIcon.className = `alert-icon ${type}`;
        alertIcon.innerHTML = icon || this.getDefaultIcon(type);

        // Configurar contenido
        alertTitle.textContent = title;
        alertMessage.textContent = message;

        // Configurar botones
        primaryBtn.textContent = confirmText;
        secondaryBtn.textContent = cancelText;
        secondaryBtn.style.display = showCancel ? 'block' : 'none';

        // Configurar eventos
        primaryBtn.onclick = () => {
            this.hide();
            if (onConfirm) onConfirm();
        };

        secondaryBtn.onclick = () => {
            this.hide();
            if (onCancel) onCancel();
        };

        // Mostrar alerta
        alert.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Efecto de sonido (opcional)
        this.playSound(type);
    }

    hide() {
        const alert = document.getElementById('customAlert');
        alert.classList.remove('active');
        document.body.style.overflow = '';
    }

    getDefaultIcon(type) {
        const icons = {
            info: '<i class="fas fa-info-circle"></i>',
            success: '<i class="fas fa-check-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            error: '<i class="fas fa-times-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    playSound(type) {
        // Implementar sonidos personalizados si se desea
        console.log(`Playing ${type} sound`);
    }

    showToast(config) {
        const {
            title,
            message,
            type = 'info',
            duration = 5000
        } = config;

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div class="toast-icon ${type}">${this.getToastIcon(type)}</div>
            <div class="toast-content">
                <h4 class="toast-title">${title}</h4>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Animación de entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Cerrar toast
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hideToast(toast));

        // Auto-ocultar
        if (duration > 0) {
            setTimeout(() => this.hideToast(toast), duration);
        }
    }

    hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }

    getToastIcon(type) {
        const icons = {
            info: '<i class="fas fa-info"></i>',
            success: '<i class="fas fa-check"></i>',
            warning: '<i class="fas fa-exclamation"></i>'
        };
        return icons[type] || icons.info;
    }
}

// ===== INICIALIZACIÓN DEL SISTEMA =====
const notifications = new NotificationSystem();

// ===== FUNCIONES DE ALERTAS ACTUALIZADAS =====
function showLoginAlert() {
    notifications.show({
        title: "Banca en Línea",
        message: "Redirigiendo a la Banca en Línea...\n\nEn la siguiente fase implementaremos el sistema completo de banca digital.",
        type: "info",
        icon: '<i class="fas fa-university"></i>',
        confirmText: "Continuar",
        onConfirm: () => {
            // Simular redirección después de 1 segundo
            setTimeout(() => {
                notifications.showToast({
                    title: "Redireccionando",
                    message: "Serás dirigido al portal de banca en línea",
                    type: "info",
                    duration: 3000
                });
            }, 1000);
        }
    });
}

function showAccountAlert() {
    notifications.show({
        title: "Apertura de Cuenta",
        message: "Formulario de apertura de cuenta\n\nEn la implementación completa, aquí se abriría un formulario detallado para la apertura de cuenta.",
        type: "success",
        icon: '<i class="fas fa-file-contract"></i>',
        showCancel: true,
        confirmText: "Iniciar Solicitud",
        cancelText: "Más Tarde",
        onConfirm: () => {
            notifications.showToast({
                title: "Solicitud Iniciada",
                message: "Proceso de apertura de cuenta iniciado",
                type: "success",
                duration: 3000
            });
        }
    });
}

function showProductAlert(product) {
    notifications.show({
        title: `Solicitud de ${product}`,
        message: `Estás solicitando: ${product}\n\nEn la implementación completa, se procesaría la solicitud del producto seleccionado.`,
        type: "warning",
        icon: '<i class="fas fa-hand-holding-usd"></i>',
        showCancel: true,
        confirmText: "Confirmar Solicitud",
        cancelText: "Revisar",
        onConfirm: () => {
            notifications.showToast({
                title: "Solicitud Enviada",
                message: `Tu solicitud de ${product} ha sido procesada`,
                type: "success",
                duration: 4000
            });
        },
        onCancel: () => {
            notifications.showToast({
                title: "Solicitud en Pausa",
                message: "Puedes continuar más tarde",
                type: "info",
                duration: 3000
            });
        }
    });
}

// ===== FUNCIONES DE USO GENERAL =====
function showSuccessAlert(title, message) {
    notifications.show({
        title: title,
        message: message,
        type: "success"
    });
}

function showErrorAlert(title, message) {
    notifications.show({
        title: title,
        message: message,
        type: "error"
    });
}

function showInfoToast(title, message) {
    notifications.showToast({
        title: title,
        message: message,
        type: "info"
    });
}