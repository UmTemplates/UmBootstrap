---
title: Layouts
description: Container elements that define the column structure of a page. Each layout provides areas where editors place features.
---

Layouts are container elements that define the column structure of a page. They hold **areas** which in turn hold features (content blocks). Layouts themselves have no visible content — they provide structure.

## Available Layouts

| Element Type | Display Name | Areas | Column Split |
|---|---|---|---|
| [`layout12`](/UmBootstrap/layouts/layout12/) | Layout - 12 | 1 area (full width) | 12 |
| [`layout363`](/UmBootstrap/layouts/layout363/) | Layout - 3 \| 6 \| 3 | 3 areas (tertiary, primary, secondary) | 3 + 6 + 3 |
| [`layout39`](/UmBootstrap/layouts/layout39/) | Layout - 3 \| 9 | 2 areas | 3 + 9 |
| [`layout66`](/UmBootstrap/layouts/layout66/) | Layout - 6 \| 6 | 2 areas | 6 + 6 |
| [`layout8`](/UmBootstrap/layouts/layout8/) | Layout - 8 | 1 area (narrower centred) | 8 |

## Naming Convention

All layout element types follow the pattern `layout{columns}`, where the numbers represent the Bootstrap 12-column grid split.

## How Layouts Are Built

### Element Type (Backoffice)

Each layout is an **element type** in the Umbraco backoffice (Settings > Document Types > Layouts). A layout element type:

- Is marked as **Is Element: true**
- Has **no own properties** — no tabs, no fields
- Has **no compositions** — layouts don't need feature title/description/summary
- Lives in the **Layouts** folder

### Block Grid DataType Configuration

Layouts are registered as **Layout Blocks** on the `_Content Grid Default - Content - Block Grid` DataType. This is where the key configuration happens:

1. **Settings tab** — each layout block is linked to the `layoutSettings` element type, which provides background colour and background image options via compositions
2. **Areas tab** — this is where responsive behaviour is defined:
   - **Grid Columns for Areas** — the total column count (12)
   - **Areas** — each area is configured with:
     - An **alias** (e.g. `tertiary`, `primary`, `secondary`)
     - **Column span classes** — Bootstrap CSS Grid responsive classes like `g-col-12 g-col-md-4 g-col-lg-3`
     - Which feature blocks are allowed in each area

:::caution[Responsive breakpoints are configured in the backoffice]
The responsive `g-col-*` classes that control how areas stack and split at different screen sizes are set **in the Umbraco backoffice UI** on the Block Grid DataType's Areas tab — not in code, CSS, or SCSS files. Umbraco's built-in block grid rendering outputs these classes automatically.
:::

### Razor Views

All layout views are identical in structure. They:

1. Set `Layout = "_Layout_Layouts.cshtml"` (the shared layout wrapper)
2. Read layout settings (background colour)
3. Call `Html.GetPreviewBlockGridItemAreasHtmlAsync(Model)` to render areas

The shared `_Layout_Layouts.cshtml` wrapper handles:
- Rendering a `<div>` with the layout's `ContentKey` as its `id`
- Applying background colour and background image from settings
- Calling `@RenderBody()` which renders the areas

### Layout Settings

All layouts share the `layoutSettings` element type as their settings block. This composes:

- `layoutSettingsComponentColorPicker` — background colour
- `layoutSettingsComponentBackgroundImage` — background image

## Creating a New Layout

1. **Create the element type** in the backoffice under Layouts, following the `layout{columns}` naming convention
2. **Create the Razor view** at `Views/Partials/blockgrid/Components/layout{name}.cshtml` — copy any existing layout view (they're all identical)
3. **Add it to the Block Grid DataType** as a Layout Block:
   - Link `layoutSettings` as the settings type
   - Configure areas with aliases, column spans, and responsive `g-col-*` breakpoint classes
   - Set which feature blocks are allowed in each area
4. **BlockPreview** automatically excludes it (any alias starting with `layout` is ignored via reflection in `Program.cs`)
