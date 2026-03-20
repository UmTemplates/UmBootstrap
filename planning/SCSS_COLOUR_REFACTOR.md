# SCSS Colour System Refactoring

## Context

The SCSS colour system was set up quickly and has several issues: brand colour overrides are in the wrong file (after Bootstrap variables instead of before), `!default` flags are used on overrides (incorrect), coral was an experimental custom colour that isn't part of the Umbraco brand, `_overrides.scss` is empty when it should contain map modifications, and ~130 lines of temp styles sit at the bottom of `index.scss`. This refactoring creates a proper theme folder structure, adds Umbraco brand colours as first-class Bootstrap theme colours with full dark mode support (following Bootstrap 5.3's documented pattern), and organises the temp styles into proper partials.

## Approach

**Do NOT override Bootstrap's default named colours** (`$blue`, `$pink` etc.). Instead, define Umbraco brand colours as new, standalone theme colours following Bootstrap 5.3's documented methodology for adding custom colours with light/dark mode support. Bootstrap's defaults stay untouched underneath.

**Brand palette** (from umbraco.com):
- `$umbraco-blue: #283a97` — primary brand colour
- `$umbraco-pink: #f5c1bc` — accent/banner colour
- `$umbraco-cream: #f9f7f4` — background colour
- `$umbraco-dark: #162335` — text colour (dark blue-grey)

**Each brand colour** gets the full Bootstrap 5.3 theme-colour treatment:
1. Base variable defined in theme `_colours.scss`
2. Light-mode semantic variants (text-emphasis, bg-subtle, border-subtle)
3. Dark-mode semantic variants
4. Merged into `$theme-colors` + all 6 semantic maps

This generates utility classes (`.btn-umbraco-blue`, `.bg-umbraco-pink-subtle`, `.text-umbraco-blue-emphasis` etc.) and full dark mode adaptation automatically.

## Theme Folder Architecture

```
SCSS/
├── themes/
│   └── umbraco/
│       ├── _colours.scss        # Brand colour definitions (raw values only)
│       ├── _fonts.scss          # Font families, weights, sizes
│       └── _components.scss     # Theme-specific component overrides (if any)
├── _variables_overrides.scss    # Imports active theme, sets Bootstrap system overrides
├── _variables.scss              # Custom shade scales, maps (theme-agnostic pipeline)
├── _overrides.scss              # Theme-colour integration into Bootstrap maps (theme-agnostic pipeline)
├── _utilities.scss              # Utility extensions inc. RGB mixin (theme-agnostic pipeline)
├── _layout.scss                 # Layout, root vars, scroll-margin
├── _anchors.scss                # Anchor link styles
├── _sticky.scss                 # Sticky nav + TOC
├── _card.scss                   # Card overrides
├── _carousel.scss               # Carousel overrides
├── _list-group.scss             # List group overrides
├── _nav.scss                    # Nav + in-page bar
├── _navbar.scss                 # Navbar + toggler
├── _type.scss                   # Typography
└── index.scss                   # Entry point — import order
```

### Theme file responsibilities

**`themes/umbraco/_colours.scss`** — raw brand values only:
```scss
// Umbraco brand colours
$umbraco-blue: #283a97;
$umbraco-pink: #f5c1bc;
$umbraco-cream: #f9f7f4;
$umbraco-dark: #162335;
```

**`themes/umbraco/_fonts.scss`** — font declarations:
```scss
// Umbraco uses system fonts (matching umbraco.com)
// No custom web fonts needed — Bootstrap's default system font stack is correct
```

**`themes/umbraco/_components.scss`** — empty initially, available for theme-specific component tweaks.

### How the pipeline uses theme values

`_variables_overrides.scss` imports the active theme then sets non-theme Bootstrap overrides:
```scss
// Active theme
@import "themes/umbraco/colours";
@import "themes/umbraco/fonts";
@import "themes/umbraco/components";

// Bootstrap system overrides (not theme-specific)
$enable-grid-classes: false;
$enable-cssgrid: true;
```

`_overrides.scss` generates the full theme-colour integration (shade scales, semantic variants, map merges) from whatever brand colours the theme provided. This file is theme-agnostic — it works with any theme's colour variables.

## Branch

`feature/scss-colour-refactor`

---

## Status

Phases 1–4 complete and committed on `feature/scss-colour-refactor`. Remaining:
- Phase 5: Update documentation
- Phase 6 (new): Create a second theme as proof of concept + theme switching
- Phase 7 (new): Docs for theme switching

---

## Phase 1 — Create theme folder and fix variable override ordering

- [ ] **1.1** Create `SCSS/themes/umbraco/_colours.scss` — brand colour definitions (`$umbraco-blue`, `$umbraco-pink`, `$umbraco-cream`, `$umbraco-dark`)
- [ ] **1.2** Create `SCSS/themes/umbraco/_fonts.scss` — font declarations (system fonts, comment explaining no custom fonts needed)
- [ ] **1.3** Create `SCSS/themes/umbraco/_components.scss` — empty stub with comment
- [ ] **1.4** `_variables_overrides.scss` — Replace contents: import theme folder, keep non-theme Bootstrap overrides (`$enable-grid-classes`, `$enable-cssgrid`), remove all `!default` flags
- [ ] **1.5** `_variables.scss` — Remove all existing colour overrides (`$blue-umbraco`, `$pink-umbraco`, re-declared colour list, `$headings-color`, coral definition, coral shade scale, `$corals` map, `$custom-colors` map, `$colors` map-merge, `generate-rgb-variables` mixin and all `@include` calls)
- [ ] **1.6** Compile and verify — should compile cleanly with no brand styling yet (just vanilla Bootstrap + system overrides)

## Phase 2 — Integrate Umbraco brand colours as theme colours

Following Bootstrap 5.3's documented pattern for adding custom theme colours with dark mode support.

- [ ] **2.1** `_overrides.scss` — Add `umbraco-blue` as a theme colour:
  - Light-mode: `$umbraco-blue-text-emphasis`, `$umbraco-blue-bg-subtle`, `$umbraco-blue-border-subtle`
  - Dark-mode: `$umbraco-blue-text-emphasis-dark`, `$umbraco-blue-bg-subtle-dark`, `$umbraco-blue-border-subtle-dark`
  - Merge into `$theme-colors` + all 6 semantic maps
- [ ] **2.2** Compile and verify — `.btn-umbraco-blue`, `.bg-umbraco-blue-subtle`, `.text-umbraco-blue-emphasis` should exist
- [ ] **2.3** `_overrides.scss` — Repeat for `umbraco-pink`
- [ ] **2.4** Compile and verify
- [ ] **2.5** `_overrides.scss` — Repeat for `umbraco-cream` and `umbraco-dark`
- [ ] **2.6** Compile and verify — all 4 brand colours have full utility classes and dark mode support
- [ ] **2.7** Apply brand colours: set `$headings-color`, `$body-color`, `$body-bg`, list-group active states etc. using the brand variables (in theme `_colours.scss` or `_components.scss` as appropriate)
- [ ] **2.8** Compile and verify — site should look branded with correct colours

## Phase 3 — Relocate shade utilities

The shade utilities (`bg-blue-300` etc.) provide fine-grained colour classes for views. The `generate-rgb-variables` mixin emits CSS output but is currently in `_variables.scss` where only Sass variables should be defined.

- [ ] **3.1** `_utilities.scss` — Move the `generate-rgb-variables` mixin definition here (from `_variables.scss`)
- [ ] **3.2** `_utilities.scss` — Add `@include` calls for brand colour shade maps (if shade scales are generated for brand colours)
- [ ] **3.3** Compile and verify — shade utility classes and RGB custom properties still generated correctly

## Phase 4 — Extract temp styles from index.scss

Create new partials and move styles to existing ones:

- [ ] **4.1** Create `_layout.scss`:
  - `:root { --navbar-height: 7rem; }`
  - `body` / `.document` min-height rules
  - `[data-FeatureContentKey]` scroll-margin-top
- [ ] **4.2** Create `_anchors.scss`:
  - `.anchor-link` and `.anchor-hash` styles
- [ ] **4.3** Create `_sticky.scss`:
  - `[class*="area-"]:has(.sticky-nav)` desktop sticky rule
  - `.nav-toc-sticky` with scroll-state container query + JS fallback
- [ ] **4.4** Move to `_navbar.scss`:
  - `.card .navbar-toggler-icon` / `.nav-in-page-bar .navbar-toggler-icon` light/dark SVG overrides
- [ ] **4.5** Move to `_nav.scss`:
  - `.nav-in-page-bar` fixed bottom bar
  - `body:has(.nav-in-page-bar)` padding-bottom
- [ ] **4.6** Move to `_utilities.scss` (or new `_shadows.scss`):
  - `.shadow-b` and `.shadow` hover transition
- [ ] **4.7** `index.scss` — Add imports for `_layout`, `_anchors`, `_sticky` in section 8. Remove section 9 (Temp) entirely
- [ ] **4.8** `_navbar.scss` — Change `#ffffff` to `$white` or `var(--bs-white)`
- [ ] **4.9** `_nav.scss` — Clean up: remove commented-out code block (lines 1-26), change `$blue` to `var(--bs-primary)` on nav-pills
- [ ] **4.10** `_type.scss` — Remove hardcoded `"Lato"` font-family (Umbraco theme uses system fonts)

## Phase 5 — Update documentation

- [ ] **5.1** `customisation/scss-setup.md` — Update file table with new partials and `themes/` folder structure
- [ ] **5.2** `customisation/bootstrap-theming.md` — Rewrite to document the theme folder approach: what goes in each theme file, how to create a new theme, how the pipeline integrates brand colours with dark mode
- [ ] **5.3** `customisation/custom-colours.md` — Rewrite to document the theme-colour integration pattern (Bootstrap 5.3's approach: `$theme-colors` + 6 semantic maps). Explain the full process for adding a brand colour with dark mode support
- [ ] **5.4** `customisation/custom-components.md` — Update if file references changed

## Verification

After each phase:
1. `sass SCSS/index.scss wwwroot/css/Index.css` — must compile without errors
2. Compare CSS size before/after
3. Visual check in browser:
   - Headings use Umbraco blue
   - Body text uses Umbraco dark blue-grey
   - Background uses Umbraco cream
   - List-group active states use Umbraco pink/blue
   - Nav-pills use correct colours
   - Dark mode toggle works — all brand colours adapt
   - Brand utility classes exist (`.btn-umbraco-blue`, `.bg-umbraco-pink-subtle` etc.)
   - Sticky nav, anchor links, TOC, mobile bottom bar all still work
   - No regressions in any Bootstrap component styling

## Files Modified

| File | Change |
|------|--------|
| `SCSS/themes/umbraco/_colours.scss` | **NEW** — brand colour definitions |
| `SCSS/themes/umbraco/_fonts.scss` | **NEW** — font declarations (system fonts) |
| `SCSS/themes/umbraco/_components.scss` | **NEW** — empty stub |
| `SCSS/_variables_overrides.scss` | Import theme folder, remove `!default`, keep system overrides |
| `SCSS/_variables.scss` | Remove all existing colour code (coral, brand overrides, RGB mixin) |
| `SCSS/_overrides.scss` | Full theme-colour integration for all 4 brand colours |
| `SCSS/_utilities.scss` | Receive RGB mixin from `_variables.scss` |
| `SCSS/_navbar.scss` | Add toggler SVGs, fix `#ffffff` |
| `SCSS/_nav.scss` | Add bottom bar, clean up commented code |
| `SCSS/_type.scss` | Remove hardcoded Lato, use system fonts |
| `SCSS/_layout.scss` | **NEW** — root vars, body, scroll-margin |
| `SCSS/_anchors.scss` | **NEW** — anchor link styles |
| `SCSS/_sticky.scss` | **NEW** — sticky nav + TOC |
| `SCSS/index.scss` | New imports, remove temp section |
| `docs/.../scss-setup.md` | Updated file table + theme folder docs |
| `docs/.../bootstrap-theming.md` | Rewritten for theme folder approach |
| `docs/.../custom-colours.md` | Rewritten for theme-colour pattern |
| `docs/.../custom-components.md` | Minor updates if needed |
