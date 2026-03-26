---
title: FAQs
description: Accordion-style FAQ block using Bootstrap collapse and block list for individual questions.
---

The FAQs feature renders a Bootstrap accordion where each question/answer pair is a block list item.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureFaqs` |
| Display name | FAQs |
| Component composition | `featureComponentFaqs` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentFaqs` — block list of FAQ items

## Block List

This feature uses **block list inside block grid**. The `featureComponentFaqs` property is a block list that accepts `featureComponentFAQ` items.

Each FAQ item has its own view at `Views/Partials/blocklist/Components/featureComponentFAQ.cshtml` which renders an individual accordion item with a question (header) and answer (body).

See [Block List](/UmBootstrap/core-concepts/block-list/) for more on how block list works inside block grid features.
