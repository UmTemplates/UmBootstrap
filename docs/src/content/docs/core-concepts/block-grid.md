---
title: Block Grid
description: How the block grid renders layouts and features — the rendering pipeline from page to content block.
---

The block grid is the primary content editing surface in UmBootstrap. Editors build pages by placing layouts and features into a block grid property. Umbraco then renders them through a chain of partial views.

## Rendering Pipeline

When Umbraco renders a block grid, the chain is:

1. **`default.cshtml`** — entry point, calls `GetPreviewBlockGridItemsHtmlAsync`
2. **`items.cshtml`** — loops through items, resolves partial view by alias
3. **`layout363.cshtml`** (example) — sets layout, calls `GetPreviewBlockGridItemAreasHtmlAsync`
4. **`_Layout_Layouts.cshtml`** — wraps with id, background colour/image
5. **`areas.cshtml`** — renders `<div class="areas grid container-xxl">` and loops through areas
6. **`area.cshtml`** — renders each area's `<div>` (Umbraco adds the `g-col-*` classes)
7. **`items.cshtml`** — renders feature blocks within the area

```
Views/Partials/blockgrid/
  default.cshtml               -- Entry point
  items.cshtml                 -- Loops through block items
  areas.cshtml                 -- Container div with CSS Grid
  area.cshtml                  -- Individual area wrapper
  Components/
    layout12.cshtml            -- Layout view (delegates to shared layout)
    layout363.cshtml           -- Layout view (delegates to shared layout)
    _Layout_Layouts.cshtml     -- Shared wrapper: id, background, settings
    _Layout_Features.cshtml    -- Shared wrapper: header, body, footer
    featureRichTextEditor.cshtml  -- Feature view (renders content)
    ...
```

## CSS Grid

UmBootstrap uses Bootstrap's **CSS Grid** system (not the legacy flexbox grid):

```scss
$enable-grid-classes: false;  // Disable col-* classes
$enable-cssgrid: true;        // Enable g-col-* classes
```

The `areas.cshtml` container uses `container-xxl` — fluid below 1400px, capped width above.

## Responsive Breakpoints

:::caution[Configured in the backoffice, not in code]
The responsive `g-col-*` classes that control how areas stack and split at different screen sizes are set **in the Umbraco backoffice UI** on the Block Grid DataType's Areas tab — not in code, CSS, or SCSS files. Umbraco's built-in block grid rendering outputs these classes automatically.
:::

Each layout's areas have column spans and responsive breakpoints configured via the block grid editor. For example, a `layout363` might have:

- Tertiary area: `g-col-12 g-col-md-4 g-col-lg-3`
- Primary area: `g-col-12 g-col-md-8 g-col-lg-6`
- Secondary area: `g-col-12 g-col-md-12 g-col-lg-3`

These classes are serialised by uSync but the source of truth is the backoffice UI.

## Block Grid DataType

The `_Content Grid Default - Content - Block Grid` DataType is where layouts and features are registered:

- **Layout Blocks**: Each layout element type, linked to `layoutSettings` for background options, with areas configured for column spans and allowed features
- **Feature Blocks**: Each feature element type, linked to `featureSettings` (or a per-feature settings type) for colour and visibility options
