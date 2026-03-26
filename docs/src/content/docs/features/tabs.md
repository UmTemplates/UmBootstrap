---
title: Tabs
description: Tabbed content block using Bootstrap tabs and block list for individual tab panels.
---

The Tabs feature renders Bootstrap tabs where each tab panel is a block list item.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureTabs` |
| Display name | Tabs |
| Component composition | `featureComponentTabs` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentTabs` — block list of tab items

## Block List

This feature uses **block list inside block grid**. The `featureComponentTabs` property is a block list that accepts `featureComponentTab` items.

Each tab item has its own view at `Views/Partials/blocklist/Components/featureComponentTab.cshtml` which renders an individual tab pane.

See [Block List](/UmBootstrap/core-concepts/block-list/) for more on how block list works inside block grid features.
