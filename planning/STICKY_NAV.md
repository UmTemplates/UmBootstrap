# Sticky Nav via `:has()` Selector

## Problem

The current sticky sidebar CSS in `index.scss` targets `[data-LayoutAlias="layout363"] .area-3`, which makes **both** `.area-3` columns in layout363 sticky (left tertiary AND right secondary). Only the column containing a navigation feature should be sticky.

Additionally, the sticky offset `7rem` is hardcoded in three places with no shared variable.

## Solution

Use CSS `:has()` so that a `.sticky-nav` class on the nav feature **inside** the area drives sticky behaviour upward. The area only becomes sticky because something inside it asked for it. This is layout-agnostic and content-driven.

Introduce a `--navbar-height` CSS custom property to centralise the hardcoded `7rem` value.

## Why `:has()` instead of a class on the area?

- Adding Bootstrap classes to areas in the backoffice is a workflow we want to move away from (future Umbraco update will handle area breakpoints natively)
- `:has()` is content-driven: the sticky behaviour follows the navigation feature, not the container
- Works on any layout, not just layout363
- Browser support is solid (all modern browsers since late 2023)

## How sticky works at different breakpoints

- **Mobile** (below md): columns stack vertically, so the **area div** needs to be sticky
- **Desktop** (md+): columns sit side-by-side, so the **`.feature-items` div** (inside the area) needs to be sticky — the area itself fills the full grid row height

The `:has()` selector handles both cases from a single `.sticky-nav` class on the nav element.

## Files to modify

### 1. `Umbootstrap.Web/SCSS/index.scss`

**Add** `:root { --navbar-height: 7rem; }` near the top of section 9 (before `body` rule).

**Replace** `scroll-margin-top: 7rem` with `scroll-margin-top: var(--navbar-height)`.

**Delete** lines 104-118 (layout363-specific sticky rules) and **replace** with:

```scss
// Sticky nav: any area containing a .sticky-nav element
// Desktop (md+): .feature-items wrapper becomes sticky inside the area
[class*="area-"]:has(.sticky-nav) .feature-items {
    @media (min-width: 768px) {
        position: sticky;
        top: var(--navbar-height);
    }
}

// Mobile (below md): the area itself becomes sticky when columns stack
[class*="area-"]:has(.sticky-nav) {
    @media (max-width: 767.98px) {
        position: sticky;
        top: var(--navbar-height);
        z-index: 1020;
    }
}
```

### 2. `featureNavigationInPage.cshtml` (line 17)

Add `sticky-nav` to nav class: `class="card"` → `class="card sticky-nav"`

### 3. `featureNavigationDescendants.cshtml` (line 36)

Add `sticky-nav` to desktop nav class: `class="card d-none d-md-block "` → `class="card d-none d-md-block sticky-nav"`

The breadcrumb nav (line 50) does **not** get the class.

## Note on `:has()` and `d-none`

The descendants nav uses `d-none d-md-block` (hidden on mobile via `display: none`). `:has()` checks DOM presence, not visibility, so the area will still be sticky on mobile. This is correct — the breadcrumb replaces the tree nav visually, and the sticky area keeps it accessible.

## Verification

1. Sass watch auto-compiles the CSS
2. Layout363 page: only the column with a nav feature should be sticky
3. Desktop: `.feature-items` sticky, area scrolls normally
4. Mobile: area itself sticky when columns stack
5. Right-hand `.area-3` column (without nav) should scroll normally

## Status

- [x] Implement SCSS changes
- [x] Add `sticky-nav` class to featureNavigationInPage
- [x] Add `sticky-nav` class to featureNavigationDescendants
- [x] Verify in browser
- [x] Commit and merge to develop + main
- [x] Apply changes to UpDoc
- [x] Update documentation
