---
title: Custom Colours
---

You can extend Bootstrap's colour system with your own named colours, complete with tint and shade scales. UmBootstrap includes coral as a worked example.

## Adding a New Colour

### Step 1 — Define the base colour

In `SCSS/_variables.scss`, define your colour after Bootstrap's variables have loaded (this file is imported at step 3b):

```scss
$brand: #2d6a4f;
```

### Step 2 — Generate a shade scale

Use Bootstrap's `tint-color()` and `shade-color()` functions to generate a 100–900 scale:

```scss
$brand-100: tint-color($brand, 80%);
$brand-200: tint-color($brand, 60%);
$brand-300: tint-color($brand, 40%);
$brand-400: tint-color($brand, 20%);
$brand-500: $brand;
$brand-600: shade-color($brand, 20%);
$brand-700: shade-color($brand, 40%);
$brand-800: shade-color($brand, 60%);
$brand-900: shade-color($brand, 80%);
```

### Step 3 — Create a Sass map

Group the shades into a map so Bootstrap can work with them:

```scss
$brands: (
  "brand-100": $brand-100,
  "brand-200": $brand-200,
  "brand-300": $brand-300,
  "brand-400": $brand-400,
  "brand-500": $brand-500,
  "brand-600": $brand-600,
  "brand-700": $brand-700,
  "brand-800": $brand-800,
  "brand-900": $brand-900,
);
```

### Step 4 — Merge into Bootstrap's colour maps

In `SCSS/_overrides.scss`, merge your colour into Bootstrap's `$colors` map so utility classes (`.text-brand`, `.bg-brand`) are generated:

```scss
$custom-colors: (
  "brand": $brand
);

$colors: map-merge($colors, $custom-colors);
```

### Step 5 — Generate CSS custom properties

UmBootstrap includes a mixin that generates `--bs-*-rgb` CSS variables for each shade. Call it in `_variables.scss` after defining your map:

```scss
@include generate-rgb-variables($brands, "brand");
```

This outputs variables like `--bs-brand-100-rgb`, `--bs-brand-500-rgb`, etc., which Bootstrap's opacity utilities rely on.

## The Coral Example

UmBootstrap ships with coral as a demonstration of this pattern. You can use it as a reference or remove it if you don't need it.

The relevant code is in `SCSS/_variables.scss`:

```scss
$coral: #ff7f50;

$coral-100: tint-color($coral, 80%);
// ... through to $coral-900

$corals: (
  "coral-100": $coral-100,
  // ...
);

@include generate-rgb-variables($corals, "coral");
```

And in `SCSS/_overrides.scss`:

```scss
$custom-colors: (
  "coral": $coral
);
$colors: map-merge($colors, $custom-colors);
```

## Using Your Colours

Once registered, Bootstrap generates utility classes automatically:

```html
<p class="text-brand">Brand coloured text</p>
<div class="bg-brand-100">Light brand background</div>
<button class="btn btn-brand">Brand button</button>
```
