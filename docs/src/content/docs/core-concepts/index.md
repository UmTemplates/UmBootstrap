---
title: Core Concepts
description: The fundamental building blocks of an UmBootstrap site — layouts, features, and how they combine.
---

UmBootstrap sites are built from two types of content block: **layouts** and **features**. Understanding how they work together is the key to building and customising pages.

## Layouts

Layouts are container elements that define the column structure of a page. They hold **areas** — named slots where editors place content. A layout has no visible content of its own; it provides structure.

Each layout's name describes its column split across a 12-column grid. For example, `layout363` creates three areas splitting the page 3 + 6 + 3 columns.

See [Layouts](/UmBootstrap/layouts/) for the full list and details.

## Features

Features are the content blocks that editors place inside layout areas. Each feature renders a specific type of content — rich text, images, FAQs, navigation, and more.

Features follow a consistent **composition pattern**: the feature element type has no properties of its own. Instead, it composes shared compositions (title, description, summary) plus one feature-specific component.

See [Features](/UmBootstrap/features/) for the full list and details.

## How They Combine

A typical page is built like this:

1. The editor adds one or more **layouts** to the page's block grid
2. Each layout provides **areas** (columns)
3. The editor places **features** into those areas
4. Each feature renders its content within the area's column width

```
Page
└── Block Grid
    ├── layout363 (3 areas: tertiary | primary | secondary)
    │   ├── [tertiary]  → Navigation - In Page
    │   ├── [primary]   → Rich Text Editor, Image, FAQs
    │   └── [secondary] → Internal Links
    └── layout12 (1 area: full width)
        └── [full width] → Contact Form
```

## Settings

Both layouts and features have **settings blocks** — element types that provide editor-configurable options (background colour, visibility, etc.) without cluttering the content editing experience.

- **Layout settings**: background colour, background image
- **Feature settings**: background colour, hide/display toggle
- Some features have **per-feature settings** that add extra options (e.g. navigation features have a sticky toggle)

## Further Reading

- [Block Grid](/UmBootstrap/core-concepts/block-grid/) — how the block grid renders layouts and features
- [Block List](/UmBootstrap/core-concepts/block-list/) — how block list is used inside block grid features
- [Element Types & Data Types](/UmBootstrap/core-concepts/element-types/) — the Umbraco building blocks behind layouts and features
