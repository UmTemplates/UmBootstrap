# Backlog

Lightweight summary of upcoming work. See GitHub Projects board for full issue tracking:
https://github.com/orgs/UmTemplates/projects/1

## In Progress

### Responsive Layout Breakpoints
- Review 6|6 layout breakpoint behaviour (waiting for real device testing of 3|6|3 and 3|9 first)
- Review layout 8 breakpoint behaviour
- Document layout area config conventions (which breakpoints, when to use `md` vs `lg`)

## Up Next

### Sticky Layout Variant
- Create `layout363sticky` (or similar) with `sticky-md-top` on tertiary area
- Only sticky when sidebar nav is present, not on every 3|6|3
- Add CSS offset (`top: 5rem`) so sticky content clears the fixed navbar

### Self-Host CDN Assets
- Currently in `_Layout.cshtml`: highlight.js, highlightjs-copy, Bootstrap JS, Bootstrap Icons all loaded from jsdelivr/unpkg
- Edge Tracking Prevention blocks these CDN resources
- Install via npm and serve from wwwroot instead
- Packages: `highlight.js`, `highlightjs-copy`, `bootstrap-icons`
- Bootstrap JS bundle already available via npm bootstrap package

### Navigation - In Page Enhancements
- Sticky positioning within layout area
- Collapse/expand support (Bootstrap collapse component)
- Picker filtering in Contentment Data List

## Future

### Layout Documentation
- Document all layout types and their responsive behaviour
- Document area naming conventions (primary, secondary, tertiary)
- Document Bootstrap CSS Grid usage (`g-col-*` classes, `$enable-cssgrid: true`)

## Completed

### Navigation - In Page Feature (formerly Jump List)
- Merged to develop and main (2026-03-05)
- Renamed from Jump List to Navigation - In Page (2026-03-07)
- Custom Contentment DataSource, block grid picker, card+list-group nav styling

### Responsive Container Fix
- Changed `areas.cshtml` from `container` to `container-xxl` (2026-03-05)
- Fixed 3|6|3 layout `md` breakpoint from 6+6 to 4+8
- Fixed breadcrumb visibility (`d-block d-md-none`)
