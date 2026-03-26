---
title: Image
description: Single image content block using Umbraco's media picker.
---

The Image feature lets editors add a single image from the media library to a page.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureImage` |
| Display name | Image |
| Component composition | `featureComponentImage` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentImage` — media picker for the image

## Block List Usage

An Image block list view also exists at `Views/Partials/blocklist/Components/featureImage.cshtml` for use inside other features.
