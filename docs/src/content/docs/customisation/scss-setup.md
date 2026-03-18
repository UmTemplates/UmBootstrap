---
title: SCSS Setup
---

Before you can compile or customise the SCSS, you need to install the npm dependencies and have the Sass compiler available.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Sass](https://sass-lang.com/install/) installed globally

Install Sass globally if you don't already have it:

```bash
npm install -g sass
```

## Install Dependencies

From the `Umbootstrap.Web/` directory, run:

```bash
npm install
```

This installs Bootstrap's SCSS source into `node_modules/`, which the project imports directly.

## Compiling SCSS

From the `Umbootstrap.Web/` directory, compile the SCSS to CSS:

```bash
sass SCSS/index.scss wwwroot/css/Index.css
```

## Watch Mode

To automatically recompile whenever you save a change:

```bash
sass --watch SCSS/index.scss wwwroot/css/Index.css
```

Leave this running in a terminal while you work. Each save will recompile the CSS.

## SCSS File Structure

| File | Purpose |
|------|---------|
| `SCSS/index.scss` | Entry point — controls the full import order |
| `SCSS/_variables_overrides.scss` | Override Bootstrap variables *before* Bootstrap loads them |
| `SCSS/_variables.scss` | Additional variables defined *after* Bootstrap (e.g. custom colour scales) |
| `SCSS/_overrides.scss` | Override Bootstrap maps (e.g. merge custom colours into Bootstrap's colour maps) |
| `SCSS/_utilities.scss` | Custom utility classes, merged into Bootstrap's utilities map |
| `SCSS/_type.scss` | Typography overrides |
| `SCSS/_navbar.scss` | Navbar component styles |
| `SCSS/_nav.scss` | Nav component styles |
| `SCSS/_card.scss` | Card component styles |
| `SCSS/_carousel.scss` | Carousel component styles |
| `SCSS/_list-group.scss` | List group component styles |

## Output

The compiled CSS is output to `wwwroot/css/Index.css`, which is referenced by the site's layout view.
