# SCSS Colour System Refactoring

## Context

The SCSS colour system needed restructuring to support multiple themes with clean separation between Bootstrap's base styles and theme-specific overrides. The original approach baked Umbraco brand colours into Bootstrap at compile time, making it impossible to switch themes cleanly at runtime.

## Approach

**Themes are fully disconnected from the compile-time pipeline.** Bootstrap compiles as vanilla — no brand colours, no custom fonts at compile time. All theming happens via CSS custom property overrides scoped to `[data-bs-theme-palette]` selectors, which are included in the compiled CSS but only activate when the matching attribute is set on `<html>`.

**Key principles:**
- Bootstrap's compiled output is vanilla — no theme contamination
- Every theme is a folder with an `_index.scss` (palette overrides) and supporting files
- The palette switcher always sets a `data-bs-theme-palette` attribute (never removes it)
- Bootstrap is the default palette — it explicitly resets all overrides to Bootstrap defaults
- Background tiers: bg1 (`--bs-body-bg`) for content surfaces, bg3 (`--bs-tertiary-bg`) for page canvas
- Each CSS custom property override must include its `-rgb` variant for Bootstrap utility classes to work
- SVG icons use `var(--bs-primary)` so they follow the active theme
- Fonts are a theme concern — removed from structural partials

## Background Colour Strategy

| Element | Class/Variable | Purpose |
|---------|---------------|---------|
| Body/header/footer | `bg-body-tertiary` / `--bs-tertiary-bg` | Page canvas (outermost) |
| Layout rows | transparent | Sit on the canvas |
| Areas | `bg-body` / `--bs-body-bg` | Content surfaces (lighter than canvas) |
| Cards | `--bs-card-bg` | Bootstrap handles automatically |

Each theme sets both the base and `-rgb` variants for `--bs-body-bg`, `--bs-secondary-bg`, and `--bs-tertiary-bg` in both light and dark modes.

## Theme Folder Architecture

```
SCSS/
├── themes/
│   ├── bootstrap/
│   │   └── _index.scss          # Reset palette — Bootstrap defaults with -rgb variants
│   ├── umbraco/
│   │   ├── _index.scss          # Palette overrides for light + dark mode
│   │   ├── _colours.scss        # Brand colour definitions from umbraco.com
│   │   └── _fonts.scss          # Font family (Lato)
│   └── ultraviolet/
│       ├── _index.scss          # Palette overrides for light + dark mode
│       └── _colours.scss        # Brand colour definitions
├── _variables_overrides.scss    # Bootstrap system overrides only (cssgrid etc.)
├── _overrides.scss              # Empty — no compile-time theme integration
├── _utilities.scss              # Utility extensions inc. RGB mixin
├── _card.scss                   # Card overrides + SVG colour swap
├── _type.scss                   # Typography (no theme fonts)
├── [other partials]             # Structural styles only, no colours
└── index.scss                   # Entry point — imports themes last
```

## Umbraco Brand Palette (from umbraco.com CSS)

| Variable | Hex | Umbraco CSS name |
|----------|-----|-----------------|
| `$umbraco-blue` | `#283a97` | `--color-identity-blue` |
| `$umbraco-pink` | `#f5c1bc` | `--color-identity-pink` |
| `$umbraco-white` | `#f9f7f4` | `--color-identity-white` |
| `$umbraco-smoke` | `#f2ebe6` | `--color-identity-smoke` |
| `$umbraco-surface` | `#f1f0ee` | `--color-page-surface` |
| `$umbraco-dark` | `#1b264f` | `--color-identity-dark` |
| `$umbraco-darkest` | `#162335` | `--color-identity-darkest` |

## Theme Palette Structure

Each `_index.scss` defines overrides for `[data-bs-theme-palette="themename"]` with:

**Light mode:**
- Body colour + rgb
- Body bg + rgb
- Emphasis colour + rgb
- Primary + rgb + text-emphasis + bg-subtle + border-subtle
- Link colour + rgb + hover
- Heading colour
- Secondary bg + rgb
- Tertiary bg + rgb
- Border colour

**Dark mode** (`[data-bs-theme-palette="themename"][data-bs-theme="dark"]`):
- Same properties with dark-appropriate values
- `color-scheme: dark`

## Theme Switching

- Dropdown in utility bar lists all themes (Bootstrap, Umbraco, Ultraviolet)
- Selection stored in `localStorage('palette')`
- Inline `<head>` script applies stored palette before first paint (prevents FOUC)
- `theme-toggler.js` handles switching and persists choice
- Light/dark mode toggle is independent — both attributes compose naturally
- No "Default" option — Bootstrap is the explicit default

## Branch

`feature/scss-colour-refactor`

## Status

- [x] Theme folder structure created (bootstrap, umbraco, ultraviolet)
- [x] Themes disconnected from compile-time pipeline
- [x] Palette switching working with all three themes
- [x] FOUC prevention via inline `<head>` script
- [x] Background tier system (bg1/bg3) working across all themes
- [x] Missing `-rgb` variants fixed
- [x] SVG icons follow theme primary colour
- [x] Fonts moved to theme concern
- [x] `_runtime.scss` renamed to `_index.scss`
- [x] "Default" removed from switcher — Bootstrap is default
- [ ] Refine Umbraco dark mode colours
- [ ] Refine Ultraviolet colours
- [ ] Update documentation site
- [ ] Test on Tailored Travel as real-world proof
