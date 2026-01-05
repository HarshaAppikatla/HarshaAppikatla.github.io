// Main JavaScript for Harsha's Portfolio

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle Logic ---
    const themeParams = {
        key: 'harsha_portfolio_theme',
        light: 'light-theme',
        iconMoon: 'fa-moon',
        iconSun: 'fa-sun'
    };

    const toggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem(themeParams.key);
    if (savedTheme === 'light') {
        body.classList.add(themeParams.light);
        if (toggleIcon) {
            toggleIcon.classList.remove(themeParams.iconSun);
            toggleIcon.classList.add(themeParams.iconMoon);
        }
    }

    // Toggle Event
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle(themeParams.light);
            const isLight = body.classList.contains(themeParams.light);

            // Update Icon
            if (toggleIcon) {
                if (isLight) {
                    toggleIcon.classList.replace(themeParams.iconSun, themeParams.iconMoon);
                } else {
                    toggleIcon.classList.replace(themeParams.iconMoon, themeParams.iconSun);
                }
            }

            // Save Preference
            localStorage.setItem(themeParams.key, isLight ? 'light' : 'dark');
        });
    }

    // --- 2. Sticky Resume Button Scroll Logic ---
    const stickyBtn = document.getElementById('sticky-resume');

    if (stickyBtn) {
        // --- Scroll Reveal Animation ---
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-scroll');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        // Select elements to animate
        // We target cards, titles, and major text blocks
        const animatedElements = document.querySelectorAll('.project-card, .skill-item, .section-title, .hero-content, .timeline-item, .blog-card, .contact-info-card, .contact-form-card, .achievement-hero-card, .project-detail-grid > div');

        animatedElements.forEach((el, index) => {
            el.classList.add('hidden-scroll');
            // Optional: Stagger delay for grids (simple implementation)
            // if (el.classList.contains('skill-item')) {
            //     el.style.transitionDelay = `${index % 5 * 100}ms`;
            // }
            observer.observe(el);
        });

        // --- Previous Logic ---
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                stickyBtn.classList.add('visible');
            } else {
                stickyBtn.classList.remove('visible');
            }
        });
    }

    // --- 4. Typewriter Effect (Hero Section) ---
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const texts = ["Java Systems.", "Web Apps.", "Secure APIs.", "Cloud Solutions."];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typeWriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster deletion
            } else {
                typeWriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing loop
        setTimeout(type, 1000);
    }

    // --- 3. Mobile Menu Toggle (Optional Future Proofing) ---
    // If we add a hamburger menu later, logic goes here.
});
