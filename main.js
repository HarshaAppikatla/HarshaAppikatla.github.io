/**
 * Main JavaScript for Harsha's Portfolio
 * Architecture: Modular Initialization for Clean Separation of Concerns.
 */

// --- Configuration Constants ---
const THEME_CONFIG = {
    key: 'harsha_portfolio_theme',
    lightClass: 'light-theme',
    iconMoon: 'fa-moon',
    iconSun: 'fa-sun'
};

const ANIMATION_CONFIG = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    selectors: [
        '.project-card',
        '.skill-item',
        '.section-title',
        '.hero-content',
        '.timeline-item',
        '.blog-card',
        '.contact-info-card',
        '.contact-form-card',
        '.achievement-hero-card',
        '.project-detail-grid > div'
    ]
};

const TYPEWRITER_TEXTS = ["Java Systems.", "Web Apps.", "Secure APIs.", "Cloud Solutions."];

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollAnimations();
    initNavigation();
    initTypewriter();
    initGlobalScrollHandler();
    initContactForm();
    initTiltEffect();
    initPageTransitions();
    initParticles();
    initCustomCursor();
});

/**
 * Initializes Theme Toggle Logic (Light/Dark Mode)
 */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem(THEME_CONFIG.key);
    if (savedTheme === 'light') {
        body.classList.add(THEME_CONFIG.lightClass);
        updateThemeIcon(toggleIcon, true);
    }

    // Toggle Event
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle(THEME_CONFIG.lightClass);
            const isLight = body.classList.contains(THEME_CONFIG.lightClass);
            updateThemeIcon(toggleIcon, isLight);
            localStorage.setItem(THEME_CONFIG.key, isLight ? 'light' : 'dark');
        });
    }
}

function updateThemeIcon(iconElement, isLight) {
    if (!iconElement) return;
    if (isLight) {
        iconElement.classList.replace(THEME_CONFIG.iconSun, THEME_CONFIG.iconMoon);
    } else {
        iconElement.classList.replace(THEME_CONFIG.iconMoon, THEME_CONFIG.iconSun);
    }
}

/**
 * Initializes IntersectionObserver for Scroll Animations
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: ANIMATION_CONFIG.threshold, rootMargin: ANIMATION_CONFIG.rootMargin });

    const animatedElements = document.querySelectorAll(ANIMATION_CONFIG.selectors.join(', '));
    animatedElements.forEach((el) => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });
}

/**
 * Initializes Navigation Logic (Mobile Menu & Smooth Scroll)
 */
function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        // Accessibility Init
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-controls', 'nav-links');

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');

            // Toggle ARIA
            mobileBtn.setAttribute('aria-expanded', isOpen);

            // Icon Flip
            const icon = mobileBtn.querySelector('i');
            if (isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll Polyfill (Delegated)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileBtn) {
                    mobileBtn.setAttribute('aria-expanded', 'false');
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }

            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/**
 * Initializes Typewriter Effect for Hero Section
 */
function initTypewriter() {
    const typeWriterElement = document.getElementById('typewriter-text');

    if (typeWriterElement) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            if (document.hidden) {
                setTimeout(type, 500);
                return;
            }

            const currentText = TYPEWRITER_TEXTS[textIndex];

            if (isDeleting) {
                typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % TYPEWRITER_TEXTS.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }
}

/**
 * Initializes Global Scroll Handler (Sticky Navbar & Resume Button)
 */
function initGlobalScrollHandler() {
    const stickyResumeBtn = document.getElementById('sticky-resume');
    const header = document.querySelector('header');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScrollUpdates(header, stickyResumeBtn);
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

/**
 * Helper: Updates UI elements based on scroll position
 */
function handleScrollUpdates(header, stickyResumeBtn) {
    const scrollY = window.scrollY;

    // Sticky Navbar
    if (header) {
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Sticky Resume Button
    if (stickyResumeBtn) {
        if (scrollY > 300) {
            stickyResumeBtn.classList.add('visible');
        } else {
            stickyResumeBtn.classList.remove('visible');
        }
    }
}

/**
 * Initialize Contact Form Enhancements
 * Adds loading state and validation
 */
function initContactForm() {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Show loading state
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.dataset.originalText = btn.innerHTML; // Save original text
                btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Sending...';
                btn.disabled = true;
                btn.style.opacity = '0.7';
                btn.style.cursor = 'not-allowed';
            }
        });

        // Restore button state if page is restored from bfcache
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                const btn = contactForm.querySelector('button[type="submit"]');
                if (btn && btn.dataset.originalText) {
                    btn.innerHTML = btn.dataset.originalText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            }
        });
    }
}

/**
 * Initializes VanillaTilt for 3D card effects
 */
function initTiltEffect() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".skill-card, .project-card, .blog-card, .timeline-content, .achievement-hero-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }
}

/**
 * Initializes Smooth Page Transitions
 */
function initPageTransitions() {
    // Add fade-in to the main wrapper on load
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }

    // Intercept internal links for fade-out
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([download])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's pointing to the same page or external domain
            const targetUrl = this.href;
            const currentUrl = window.location.href.split('#')[0];

            if (targetUrl === currentUrl || !targetUrl.startsWith(window.location.origin)) {
                return;
            }

            e.preventDefault();

            if (mainContent) {
                mainContent.classList.remove('page-transition');
                mainContent.classList.add('page-transition-exit');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400); // Matches CSS fadeOut duration
            } else {
                window.location.href = targetUrl;
            }
        });
    });
}

/**
 * Initializes Interactive Hero Particle Background
 */
function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = document.querySelector('.hero').offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        const particleCount = Math.min(Math.floor(width / 15), 100); // Responsive particle count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Only draw lines if particles are close
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 - distance / 1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
}

/**
 * Initializes Custom Interactive Cursor
 */
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    // Detect touch devices to disable custom cursor
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate update for the dot
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth following for the outline
    function animateCursor() {
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;

        outlineX += distX * 0.2; // Easing factor
        outlineY += distY * 0.2;

        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover states
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card, .blog-card, .theme-toggle');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });
}
