// Theme toggler — handles two independent concerns:
// 1. Mode (light/dark/auto) via data-bs-theme — Bootstrap native
// 2. Palette (umbraco/ultraviolet/none) via data-bs-theme-palette — custom

(() => {
    'use strict';

    // --- Mode (light/dark/auto) ---

    const modes = ['light', 'dark', 'auto'];
    const getStoredMode = () => localStorage.getItem('theme');
    const setStoredMode = mode => localStorage.setItem('theme', mode);

    const applyMode = mode => {
        if (mode === 'auto') {
            document.documentElement.setAttribute(
                'data-bs-theme',
                window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            );
        } else {
            document.documentElement.setAttribute('data-bs-theme', mode);
        }
    };

    const toggleMode = () => {
        const currentMode = getStoredMode() || 'auto';
        const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
        setStoredMode(nextMode);
        applyMode(nextMode);
        updateModeButton(nextMode);
    };

    const updateModeButton = mode => {
        const button = document.getElementById('themeToggleBtn');
        const icon = document.getElementById('themeIcon');

        if (button && icon) {
            if (mode === 'light') {
                icon.className = 'bi bi-sun';
                button.textContent = ' Light';
                button.prepend(icon);
            } else if (mode === 'dark') {
                icon.className = 'bi bi-moon';
                button.textContent = ' Dark';
                button.prepend(icon);
            } else if (mode === 'auto') {
                icon.className = 'bi bi-circle-half';
                button.textContent = ' Auto';
                button.prepend(icon);
            }
        }
    };

    // --- Palette (theme switcher) ---

    const getStoredPalette = () => localStorage.getItem('palette');
    const setStoredPalette = palette => localStorage.setItem('palette', palette);

    const applyPalette = palette => {
        document.documentElement.setAttribute('data-bs-theme-palette', palette || 'bootstrap');
    };

    const updatePaletteButton = palette => {
        const activePalette = palette || 'bootstrap';
        const label = document.getElementById('paletteLabel');
        if (label) {
            label.textContent = activePalette.charAt(0).toUpperCase() + activePalette.slice(1);
        }

        // Update active state on dropdown items
        document.querySelectorAll('[data-bs-palette-value]').forEach(item => {
            const isActive = (item.getAttribute('data-bs-palette-value') === activePalette);
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', isActive);
        });
    };

    // --- Initialise ---

    document.addEventListener('DOMContentLoaded', () => {
        // Mode
        const preferredMode = getStoredMode() || 'auto';
        applyMode(preferredMode);
        updateModeButton(preferredMode);
        document.getElementById('themeToggleBtn')?.addEventListener('click', toggleMode);

        // Palette
        const preferredPalette = getStoredPalette() || 'bootstrap';
        applyPalette(preferredPalette);
        updatePaletteButton(preferredPalette);

        document.querySelectorAll('[data-bs-palette-value]').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                const palette = item.getAttribute('data-bs-palette-value');
                setStoredPalette(palette);
                applyPalette(palette);
                updatePaletteButton(palette);
            });
        });
    });

    // Listen for system colour scheme changes (for auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedMode = getStoredMode();
        if (!storedMode || storedMode === 'auto') {
            applyMode('auto');
        }
    });
})();
