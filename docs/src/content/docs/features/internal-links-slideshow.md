---
title: Internal Links - Slideshow
description: Display internal page links as a Bootstrap carousel slideshow.
---

The Internal Links - Slideshow feature displays internal page links as a Bootstrap carousel.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureInternalLinksSlideshow` |
| Display name | Internal Links - Slideshow |
| Component composition | `featureComponentInternalLinksSlideshow` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentInternalLinksSlideshow` — slideshow-specific composition

Note: This feature uses its own composition (`featureComponentInternalLinksSlideshow`) rather than the shared `featureComponentsInternalLinks` used by the other Internal Links variants, as the slideshow rendering requires different configuration.
