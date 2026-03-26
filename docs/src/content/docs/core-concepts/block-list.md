---
title: Block List
description: How block list is used inside block grid features for repeating content like FAQs and tabs.
---

While the block grid handles page-level layout, some features need **repeating items** within them. This is where block list comes in — it's used inside block grid features to let editors add multiple items of the same type.

## Block List Inside Block Grid

UmBootstrap nests block list inside block grid features. The editor experience is:

1. Editor adds a feature (e.g. FAQs) to a layout area in the **block grid**
2. Inside that feature, a **block list** property lets them add individual items (e.g. FAQ questions)
3. Each block list item is its own element type with its own view

This pattern is used by:

| Block Grid Feature | Block List Item | Purpose |
|---|---|---|
| `featureFaqs` | `featureComponentFAQ` | Individual FAQ question + answer |
| `featureTabs` | `featureComponentTab` | Individual tab with title + content |

## Views

Block list items have their own partial views, separate from block grid views:

```
Views/Partials/
  blockgrid/Components/    -- Block grid feature views
    featureFAQs.cshtml     -- Renders the accordion container
    featureTabs.cshtml     -- Renders the tab container
  blocklist/Components/    -- Block list item views
    featureComponentFAQ.cshtml   -- Renders one FAQ item
    featureComponentTab.cshtml   -- Renders one tab panel
```

The block grid feature view renders the container (e.g. a Bootstrap accordion or tab group), then iterates through the block list items, rendering each one with its block list partial view.

## When to Use Block List

Use block list inside a block grid feature when:

- The feature needs **repeating items** of the same type (FAQs, tabs, slides)
- Each item has its own **structured fields** (not just rich text)
- The items need to render as **distinct UI elements** (accordion panels, tab panes, carousel slides)

For simpler repeating content, a single rich text editor or a Contentment data list may be more appropriate.
