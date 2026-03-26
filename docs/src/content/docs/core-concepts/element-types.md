---
title: Element Types & Data Types
description: How Umbraco element types, data types, compositions, and property editors underpin UmBootstrap's layouts and features.
---

UmBootstrap is built on Umbraco's standard content architecture. Understanding these building blocks helps you create new layouts and features or customise existing ones.

## Element Types

An **element type** is a document type with "Is Element" enabled. Unlike regular document types, element types can't exist as standalone content — they're used inside block grid and block list editors.

UmBootstrap uses element types for:

- **Layouts** (e.g. `layout12`, `layout363`) — container elements with areas
- **Features** (e.g. `featureRichTextEditor`, `featureImage`) — content blocks
- **Feature components** (e.g. `featureComponentRichTextEditor`) — compositions that provide specific properties
- **Settings** (e.g. `featureSettings`, `layoutSettings`) — configuration blocks for colour, visibility, etc.

## Compositions

Compositions let element types inherit properties from other element types. UmBootstrap uses compositions extensively to keep things DRY:

**Feature compositions**:
- `featureComponentFeatureTitle` → provides the heading field
- `featureComponentFeatureDescription` → provides the lead text field
- `featureComponentFeatureSummary` → provides the footer text field
- One specific component per feature (e.g. `featureComponentRichTextEditor`)

**Settings compositions**:
- `featureSettingsComponentColorPicker` → background colour
- `featureSettingsComponentHideDisplay` → show/hide toggle
- `layoutSettingsComponentColorPicker` → layout background colour
- `layoutSettingsComponentBackgroundImage` → layout background image

A feature element type has no properties of its own — everything comes from compositions.

## Data Types

A **data type** is a configured instance of a property editor. For example, "Rich Text Editor" is a property editor; a data type might be "Feature Content - Rich Text" with specific toolbar options configured.

Key data types in UmBootstrap:

- `_Content Grid Default - Content - Block Grid` — the main block grid, where layouts and features are registered
- `Feature Settings - Colour Picker` — the background colour picker used by feature settings
- `Feature Component - Navigation In Page Items - Data List` — the Contentment data list for in-page navigation

## Property Editors

Property editors define the editing UI for a property. UmBootstrap uses both built-in Umbraco property editors and community ones:

- **Rich Text Editor** (Umbraco) — for rich text content
- **Media Picker** (Umbraco) — for images
- **Block Grid** (Umbraco) — the main page content editor
- **Block List** (Umbraco) — for repeating items within features
- **Data List** (Contentment) — for custom data source pickers
- **UmbNav** (community) — for site navigation

## Naming Conventions

UmBootstrap follows strict naming conventions for element types:

| Type | Pattern | Examples |
|------|---------|----------|
| Layouts | `layout{columns}` | `layout12`, `layout363`, `layout39` |
| Features | `feature{Name}` | `featureRichTextEditor`, `featureImage` |
| Feature components | `featureComponent{Name}` | `featureComponentRichTextEditor` |
| Feature settings | `featureSettings{Scope}` | `featureSettings`, `featureSettingsNavigation` |
| Layout settings | `layoutSettings` | `layoutSettings` |

See the [Layouts](/UmBootstrap/layouts/) and [Features](/UmBootstrap/features/) sections for complete lists.
