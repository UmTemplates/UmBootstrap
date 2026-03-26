---
title: Internal Links - Selected
description: Display a curated list of internal page links chosen by the editor.
---

The Internal Links - Selected feature lets editors pick specific pages to display as a list of links.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureInternalLinks` |
| Display name | Internal Links - Selected |
| Component composition | `featureComponentsInternalLinks` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentsInternalLinks` — content picker for selected pages

## Related Features

This shares the `featureComponentsInternalLinks` composition with:
- [Internal Links - Children](/UmBootstrap/features/internal-links-children/)
- [Internal Links - Pagination](/UmBootstrap/features/internal-links-pagination/)

Each variant renders the same picked content in a different layout.
