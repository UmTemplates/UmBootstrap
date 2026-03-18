---
title: Customisation
---

UmBootstrap is designed to be customised. The frontend is built on Bootstrap 5 via SCSS, giving you full control over the visual design — from colours and typography to component styles.

## What You Can Customise

- **Bootstrap theme** — override variables to change colours, spacing, typography, and more
- **Custom colours** — add new named colours with full tint/shade scales
- **Component styles** — add or override styles for specific Bootstrap components
- **Your own partials** — add custom SCSS files for project-specific styles

## How It Works

UmBootstrap uses Bootstrap's [Option B](https://getbootstrap.com/docs/5.3/customize/sass/#importing) approach — importing Bootstrap piece by piece rather than as a single bundle. This gives you precise control over what's included and where your customisations are applied.

The entry point is `SCSS/index.scss`, which follows a strict import order:

1. Bootstrap functions
2. Your variable overrides
3. Bootstrap variables
4. Your map overrides
5. Bootstrap components
6. Your custom styles

## Pages in This Section

- [SCSS Setup](/UmBootstrap/customisation/scss-setup/) — install dependencies and compile SCSS
- [Bootstrap Theming](/UmBootstrap/customisation/bootstrap-theming/) — override Bootstrap variables
- [Custom Colours](/UmBootstrap/customisation/custom-colours/) — add new named colours with shade scales
- [Custom Components](/UmBootstrap/customisation/custom-components/) — add your own SCSS partials
