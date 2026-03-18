---
title: Bootstrap Theming
---

Bootstrap is built on Sass variables. Every colour, spacing value, border radius, font size, and more is controlled by a variable. You can override any of these before Bootstrap compiles them.

## How `!default` Works

Bootstrap variables are declared with the `!default` flag:

```scss
$primary: #0d6efd !default;
```

`!default` means "use this value *unless* a value is already assigned". So if you set a variable *before* Bootstrap's own declaration, Bootstrap will use yours instead.

This is why `_variables_overrides.scss` is imported at step 2 in `index.scss` — before Bootstrap's variables at step 3.

## Where to Put Your Overrides

Add your Bootstrap variable overrides to `SCSS/_variables_overrides.scss`:

```scss
// _variables_overrides.scss

$primary: #2d6a4f;
$secondary: #40916c;
$font-family-base: 'Inter', sans-serif;
$border-radius: 0.5rem;
```

Do **not** add `!default` to your overrides — you want them to take effect unconditionally.

## Common Variables

### Colours

```scss
$primary:   #0d6efd;
$secondary: #6c757d;
$success:   #198754;
$info:      #0dcaf0;
$warning:   #ffc107;
$danger:    #dc3545;
$light:     #f8f9fa;
$dark:      #212529;
```

### Typography

```scss
$font-family-base:      system-ui, -apple-system, sans-serif;
$font-size-base:        1rem;
$font-weight-normal:    400;
$line-height-base:      1.5;
$headings-font-weight:  500;
$headings-color:        null; // inherits body colour by default
```

### Spacing

```scss
$spacer: 1rem; // base unit for the spacing scale (0.25rem, 0.5rem, 1rem, 1.5rem, 3rem)
```

### Borders

```scss
$border-width:  1px;
$border-radius: 0.375rem;
```

For the full list of available variables, see the [Bootstrap Sass variables reference](https://getbootstrap.com/docs/5.3/customize/sass/#variable-defaults).

## UmBootstrap Defaults

UmBootstrap ships with a set of default overrides already in place. These give the starter kit its Umbraco-inspired look:

```scss
// _variables_overrides.scss

// Enable Bootstrap CSS Grid, disable legacy flexbox grid
$enable-grid-classes: false;
$enable-cssgrid:      true;

// Active state for list groups (Umbraco pink bg, Umbraco blue text)
$list-group-active-bg:           #f5c1bc;
$list-group-active-border-color: #f5c1bc;
$list-group-active-color:        #283a97;
```

```scss
// _variables.scss

// Umbraco brand colours
$blue:  #283a97;
$pink:  #f5c1bc;

// Headings use Umbraco blue
$headings-color: $blue;
```

You can change or remove any of these to suit your project.

## Reducing the Bundle

UmBootstrap imports every Bootstrap component by default. If your project doesn't use certain components, you can remove their `@import` lines from `index.scss` to reduce the compiled CSS size:

```scss
// Comment out components you don't need
// @import "../node_modules/bootstrap/scss/carousel";
// @import "../node_modules/bootstrap/scss/modal";
// @import "../node_modules/bootstrap/scss/tooltip";
```
