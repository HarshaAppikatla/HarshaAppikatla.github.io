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
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                stickyBtn.classList.add('visible');
            } else {
                stickyBtn.classList.remove('visible');
            }
        });
    }

    // --- 3. Mobile Menu Toggle (Optional Future Proofing) ---
    // If we add a hamburger menu later, logic goes here.
});
