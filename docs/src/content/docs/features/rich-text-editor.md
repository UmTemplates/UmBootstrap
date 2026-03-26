---
title: Rich Text Editor
description: Rich text content block using Umbraco's TipTap-based editor.
---

The Rich Text Editor feature lets editors add formatted text content to a page using Umbraco's built-in rich text editor.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureRichTextEditor` |
| Display name | Rich Text Editor |
| Component composition | `featureComponentRichTextEditor` |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## Compositions

- `featureComponentFeatureTitle` — heading
- `featureComponentFeatureDescription` — lead text
- `featureComponentFeatureSummary` — footer text
- `featureComponentRichTextEditor` — rich text content

## View

The view is minimal — it renders the rich text content and delegates the header/footer structure to the shared layout:

```razor
@inherits UmbracoViewPage<BlockGridItem<FeatureRichTextEditor>>

@{
    Layout = "_Layout_Features.cshtml";
}

@Model.Content.RichTextContent
```

## Block List Usage

A Rich Text Editor block list view also exists at `Views/Partials/blocklist/Components/featureRichTextEditor.cshtml` for use inside other features that need rich text items.
