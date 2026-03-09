# Backlog

Lightweight summary of upcoming work. See GitHub Projects board for full issue tracking:
https://github.com/orgs/UmTemplates/projects/1

## In Progress

### Responsive Layout Breakpoints
- Review 6|6 layout breakpoint behaviour (waiting for real device testing of 3|6|3 and 3|9 first)
- Review layout 8 breakpoint behaviour
- Document layout area config conventions (which breakpoints, when to use `md` vs `lg`)

## Up Next

### Per-Feature Settings Types
- Migrate from single shared `featureSettings` to per-feature settings element types
- Each `featureSettings{Name}` composes shared components (Color Picker, Hide Display) + feature-specific settings
- Migrate incrementally: start with nav features, split others as needs arise
- Features without custom settings stay on generic `featureSettings` until they need their own

### Sticky Nav Settings Toggle (first per-feature settings migration)
- Create `featureSettingsNavigation` element type (composes Color Picker + Hide Display + new Sticky Nav toggle)
- Nav feature blocks use this settings type instead of standard `featureSettings` on Block Grid DataType
- Views conditionally render `sticky-nav` class based on setting
- Currently sticky is always on for both nav features — this makes it editor-controlled per instance

### Self-Host CDN Assets
- Currently in `_Layout.cshtml`: highlight.js, highlightjs-copy, Bootstrap JS, Bootstrap Icons all loaded from jsdelivr/unpkg
- Edge Tracking Prevention blocks these CDN resources
- Install via npm and serve from wwwroot instead
- Packages: `highlight.js`, `highlightjs-copy`, `bootstrap-icons`
- Bootstrap JS bundle already available via npm bootstrap package

### Navigation - In Page Polish
- Auto-collapse on mobile when a nav link is clicked
- Picker filtering in Contentment Data List
- Contentment Item Picker group rendering (feature request — pattern exists in configuration editor modal)
- Multi-step picker: custom property editor for grid+area selection then feature picking

### Dark Mode Contrast
- White text on pink feature background has poor contrast in dark mode

## Future

### Layout Documentation
- Document all layout types and their responsive behaviour
- Document area naming conventions (primary, secondary, tertiary)
- Document Bootstrap CSS Grid usage (`g-col-*` classes, `$enable-cssgrid: true`)

## Completed

### Sticky Nav via :has() Selector (2026-03-09)
- Replaced layout363-specific sticky rules with CSS `:has(.sticky-nav)` pseudo-class
- `.sticky-nav` class on nav elements drives sticky behaviour upward to containing area
- Introduced `--navbar-height` CSS custom property (replaces hardcoded `7rem`)
- Layout-agnostic: works on any layout, not just layout363
- Applied to both `featureNavigationInPage` and `featureNavigationDescendants`
- Synced changes to UpDoc (SCSS, views, header null check, list-group cleanup)
- Renamed planning file: `JUMP_LIST.md` → `NAVIGATION_IN_PAGE.md`

### Navigation CSS Fixes (2026-03-09)
- Bootstrap card + list-group-flush pattern (removed card-body wrapper)
- Removed `list-group-item-light` for dark mode support
- Bootstrap variable overrides for active state colours (`$list-group-active-bg`, etc.)
- Fixed CS8604 null reference in header.cshtml

### ScrollSpy & Scroll Margin Fix (2026-03-08)
- Replaced deprecated `offset: 120` with `rootMargin: '0px 0px -75%'` (Bootstrap 5.2+ Intersection Observer)
- Fixed `scroll-margin-top` from `5rem` to `7rem` to match sticky `top` offset
- Migrated Navigation - In Page feature to UpDoc project (uSync + code copy)
- UpDoc migration note: DataType config must reference the target project's assembly name for the DataSource key

### Multi-Grid DataSource Support (2026-03-08)
- Removed hardcoded `contentGrid` alias from DataSource and view
- Scans all `BlockGridModel` properties dynamically
- Sets `DataListItem.Group` per grid alias (ready for Contentment group rendering)
- View searches across all block grids to resolve selected content keys
- Label moved above picker field (`LabelOnTop: true`)

### Navigation - In Page Sticky + Collapse + ScrollSpy (2026-03-07)
- Sticky sidebars on layout363 via CSS `data-LayoutAlias` selector
- Desktop: feature-items sticky in sidebar at md+
- Mobile: area sticky when stacked below md
- Bootstrap collapse toggle on mobile (navbar toggler button)
- ScrollSpy highlights active section while scrolling
- card-body wrapper for consistency with Bootstrap card conventions
- Also fixed featureNavigationDescendants wrapper div (empty class -> card-body)

### Navigation - In Page Feature (formerly Jump List)
- Merged to develop and main (2026-03-05)
- Renamed from Jump List to Navigation - In Page (2026-03-07)
- Custom Contentment DataSource, block grid picker, card+list-group nav styling

### Responsive Container Fix
- Changed `areas.cshtml` from `container` to `container-xxl` (2026-03-05)
- Fixed 3|6|3 layout `md` breakpoint from 6+6 to 4+8
- Fixed breadcrumb visibility (`d-block d-md-none`)
