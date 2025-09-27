// Bootstraps example theme toggler
(() => {
    'use strict';

    const themes = ['light', 'dark', 'auto']; // Define the theme states
    const getStoredTheme = () => localStorage.getItem('theme'); // Retrieve the saved theme
    const setStoredTheme = theme => localStorage.setItem('theme', theme); // Save the theme

    const setTheme = theme => {
        if (theme === 'auto') {
            document.documentElement.setAttribute(
                'data-bs-theme',
                window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            );
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    };

    const toggleTheme = () => {
        const currentTheme = getStoredTheme() || 'auto';
        const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length]; // Cycle to the next theme
        setStoredTheme(nextTheme); // Save the new theme
        setTheme(nextTheme); // Apply the new theme
        updateButton(nextTheme); // Update the button icon and label
    };

    const updateButton = theme => {
        const button = document.getElementById('themeToggleBtn');
        const icon = document.getElementById('themeIcon');

        if (button && icon) {
            if (theme === 'light') {
                icon.className = 'bi bi-sun'; // Sun icon for light theme
                button.textContent = ' Light'; // Update button label
                button.prepend(icon); // Ensure the icon stays at the start
            } else if (theme === 'dark') {
                icon.className = 'bi bi-moon'; // Moon icon for dark theme
                button.textContent = ' Dark'; // Update button label
                button.prepend(icon);
            } else if (theme === 'auto') {
                icon.className = 'bi bi-circle-half'; // Circle-half icon for auto theme
                button.textContent = ' Auto'; // Update button label
                button.prepend(icon);
            }
        }
    };

    // Initialize the theme on page load
    document.addEventListener('DOMContentLoaded', () => {
        const preferredTheme = getStoredTheme() || 'auto';
        setTheme(preferredTheme); // Apply the preferred theme
        updateButton(preferredTheme); // Update the button to reflect the current theme

        // Add click event listener to the toggle button
        document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    });
})();