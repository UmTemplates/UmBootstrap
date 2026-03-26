---
title: HTML
description: Raw HTML content block for custom markup.
---

The HTML feature lets editors add raw HTML content to a page. Use this for custom markup that doesn't fit the rich text editor.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureHTML` |
| Display name | HTML |
| Component composition | `featureComponentHtml` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentHtml` — raw HTML content
