---
title: Custom Components
---

For project-specific styles that go beyond Bootstrap variable overrides, add your own SCSS partials.

## Adding a Partial

Create a new file in the `SCSS/` directory, prefixed with an underscore:

```
SCSS/_my-component.scss
```

Then import it in `index.scss` in the custom code section (step 8):

```scss
// 8. Add additional custom code here
@import "_card";
@import "_carousel";
@import "_my-component"; // add yours here
```

The underscore prefix tells Sass the file is a partial — it won't be compiled on its own, only when imported.

## Overriding Bootstrap Components

Bootstrap component styles are imported individually in `index.scss`. To override them, add your styles *after* the relevant Bootstrap import in step 8.

For example, to customise cards:

```scss
// SCSS/_card.scss

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: transparent;
  border-bottom-color: var(--bs-border-color-translucent);
}
```

UmBootstrap already has component partials for the most common overrides — check these before creating new ones:

| File | Component |
|------|-----------|
| `_card.scss` | Card |
| `_carousel.scss` | Carousel |
| `_list-group.scss` | List group |
| `_nav.scss` | Nav |
| `_navbar.scss` | Navbar |
| `_type.scss` | Typography |

## Using Bootstrap Variables in Your Styles

Because your partials are imported after Bootstrap, you have access to all Bootstrap variables and CSS custom properties:

```scss
// _my-component.scss

.my-hero {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  padding: $spacer * 4;
  border-radius: $border-radius-lg;
}
```

## Keeping Styles Scoped

Where possible, scope your styles to a specific class rather than targeting broad selectors. This avoids unintended side effects:

```scss
// Too broad — affects all paragraphs
p {
  margin-bottom: 1.5rem;
}

// Better — scoped to your component
.my-component p {
  margin-bottom: 1.5rem;
}
```
