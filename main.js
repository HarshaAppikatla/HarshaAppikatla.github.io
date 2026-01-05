/**
 * Main JavaScript for Harsha's Portfolio
 * Refactored for Performance, Scalability, and Clean Code standards.
 */

document.addEventListener('DOMContentLoaded', () => {

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

    // --- 1. Theme Toggle Logic ---
    const toggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem(THEME_CONFIG.key);
    if (savedTheme === 'light') {
        body.classList.add(THEME_CONFIG.lightClass);
        updateThemeIcon(true);
    }

    // Toggle Event
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle(THEME_CONFIG.lightClass);
            const isLight = body.classList.contains(THEME_CONFIG.lightClass);
            updateThemeIcon(isLight);
            localStorage.setItem(THEME_CONFIG.key, isLight ? 'light' : 'dark');
        });
    }

    function updateThemeIcon(isLight) {
        if (!toggleIcon) return;
        if (isLight) {
            toggleIcon.classList.replace(THEME_CONFIG.iconSun, THEME_CONFIG.iconMoon);
        } else {
            toggleIcon.classList.replace(THEME_CONFIG.iconMoon, THEME_CONFIG.iconSun);
        }
    }

    // --- 2. Scroll Animations (IntersectionObserver) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: ANIMATION_CONFIG.threshold, rootMargin: ANIMATION_CONFIG.rootMargin });

    // Select and Observe elements
    const animatedElements = document.querySelectorAll(ANIMATION_CONFIG.selectors.join(', '));
    animatedElements.forEach((el) => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });

    // --- 3. Unified Scroll Event Handler ---
    const stickyResumeBtn = document.getElementById('sticky-resume');
    const header = document.querySelector('header');

    // Throttled Scroll Handler
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    /**
     * Handles all scroll-based UI updates.
     * Centralized to avoid multiple scroll listeners and layout thrashing.
     */
    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky Navbar Effect
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Sticky Resume Button Visibility
        if (stickyResumeBtn) {
            if (scrollY > 300) {
                stickyResumeBtn.classList.add('visible');
            } else {
                stickyResumeBtn.classList.remove('visible');
            }
        }
    }

    // --- 4. Mobile Menu Logic ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        // Set initial state
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-controls', 'nav-links'); // Best practice

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');

            // Toggle ARIA State
            mobileBtn.setAttribute('aria-expanded', isOpen);

            const icon = mobileBtn.querySelector('i');
            // Icon Flip
            if (isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 5. Smooth Scroll Polyfill (Delegated) ---
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // --- 6. Typewriter Effect (Performance Optimized) ---
    const typeWriterElement = document.getElementById('typewriter-text');

    if (typeWriterElement) {
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            // Performance: Skip typing if tab is hidden
            if (document.hidden) {
                setTimeout(type, 500); // Check again later
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
});
