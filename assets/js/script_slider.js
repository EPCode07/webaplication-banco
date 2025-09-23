// Hero Slider Functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const autoplayToggle = document.querySelector('.autoplay-toggle');
    
    let currentSlide = 0;
    let isAutoplay = true;
    let autoplayInterval;

    // Initialize autoplay
    startAutoplay();

    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Calculate correct slide index
        currentSlide = (n + slides.length) % slides.length;

        // Show current slide
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoplay() {
        if (isAutoplay) {
            autoplayInterval = setInterval(nextSlide, 20000); // Change slide every 5 seconds
            autoplayToggle.innerHTML = '<i class="fas fa-pause"></i>';
            autoplayToggle.title = 'Pausar slider';
        }
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        autoplayToggle.innerHTML = '<i class="fas fa-play"></i>';
        autoplayToggle.title = 'Reanudar slider';
    }

    // Event Listeners
    nextArrow.addEventListener('click', () => {
        nextSlide();
        if (isAutoplay) {
            stopAutoplay();
            startAutoplay();
        }
    });

    prevArrow.addEventListener('click', () => {
        prevSlide();
        if (isAutoplay) {
            stopAutoplay();
            startAutoplay();
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            if (isAutoplay) {
                stopAutoplay();
                startAutoplay();
            }
        });
    });

    autoplayToggle.addEventListener('click', () => {
        isAutoplay = !isAutoplay;
        if (isAutoplay) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Pause autoplay on hover
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => {
        if (isAutoplay) {
            stopAutoplay();
        }
    });

    slider.addEventListener('mouseleave', () => {
        if (isAutoplay) {
            startAutoplay();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe right
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});