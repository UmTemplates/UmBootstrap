# BlockPreview

| | |
|---|---|
| **Package** | Umbraco.Community.BlockPreview |
| **Version** | 5.1.0 |
| **Source** | [GitHub](https://github.com/rickbutterfield/Umbraco.Community.BlockPreview) |

## What It Does

BlockPreview renders live previews of block grid and block list components directly in the Umbraco backoffice. Instead of seeing generic block placeholders, content editors see a rendered preview of each block using the same Razor partial views as the front end.

## How UmBootstrap Uses It

BlockPreview is configured in `appsettings.json` using an **opt-in** approach. Each feature element type that should show a preview is listed in the `ContentTypes` array:

```json
{
  "BlockPreview": {
    "BlockGrid": {
      "Enabled": true,
      "ContentTypes": [
        "featurePageTitleDescription",
        "featureRichTextEditor",
        "featureImage",
        "featureInternalLinksChildren",
        "featureInternalLinks",
        "featureInternalLinksSlideshow",
        "featureInternalLinksPagination",
        "featureNavigationDescendants",
        "featureFaqs",
        "featureTabs",
        "featureHtml",
        "featureCode",
        "featureFormContactUs"
      ],
      "Stylesheets": ["/css/Index.css"]
    },
    "BlockList": {
      "Enabled": false
    }
  }
}
```

Layout elements (`layout12`, `layout48`, etc.) are deliberately excluded — they only contain areas and don't need previews.

## Adding Previews for New Blocks

When you create a new feature element type:

1. Create the Razor partial view in `Views/Partials/blockgrid/`
2. Add the element type alias to the `ContentTypes` array in `appsettings.json`

!!! note
    UmBootstrap uses opt-in (`ContentTypes`) rather than opt-out (`IgnoredContentTypes`) because the opt-out approach does not work reliably in BlockPreview v5.1.0.
