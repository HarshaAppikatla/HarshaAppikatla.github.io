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
