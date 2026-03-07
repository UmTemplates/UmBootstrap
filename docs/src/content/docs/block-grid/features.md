---
title: Block Grid Features
---

Features are content blocks that editors place inside layout areas. Each feature renders a specific type of content — rich text, images, FAQs, navigation, etc.

## Naming Convention

All feature element types follow the pattern `feature{Name}`:

| Element Type | Display Name | Component Composition |
|---|---|---|
| `featureRichTextEditor` | Rich Text Editor | `featureComponentRichTextEditor` |
| `featureImage` | Image | `featureComponentImage` |
| `featureCode` | Code | `featureComponentCode` |
| `featureHTML` | HTML | `featureComponentHtml` |
| `featureFaqs` | FAQs | `featureComponentFaqs` |
| `featureTabs` | Tabs | `featureComponentTabs` |
| `featureInternalLinks` | Internal Links - Selected | `featureComponentsInternalLinks` |
| `featureInternalLinksChildren` | Internal Links - Children | `featureComponentsInternalLinks` |
| `featureInternalLinksPagination` | Internal Links - Pagination | `featureComponentsInternalLinks` |
| `featureInternalLinksSlideshow` | Internal Links - Slideshow | `featureComponentInternalLinksSlideshow` |
| `featureFormContactUs` | Form - Contact Us | (inline form fields) |
| `featurePageTitleDescription` | Page Title and Description | (reads from page properties) |
| `featureNavigationDescendants` | Navigation - Descendants | `featureComponentNoConfiguration` |
| `featureNavigationInPage` | Navigation - In Page | `featureComponentNavigationInPage` |

## How Features Are Built

### Element Type (Backoffice)

Each feature is an **element type** in the Umbraco backoffice (Settings > Document Types > Features). A feature element type:

- Is marked as **Is Element: true**
- Has **no own properties** — all properties come from compositions
- Composes the **standard compositions** (title, description, summary) plus one **specific component**
- Lives in the **Features** folder

### Composition Pattern

Features use a consistent composition pattern with two groups:

**Standard compositions** (shared by most features):

| Composition | Property | Purpose |
|---|---|---|
| `featureComponentFeatureTitle` | `featurePropertyFeatureTitle` | Heading above the content |
| `featureComponentFeatureDescription` | `featurePropertyFeatureDescription` | Lead text below the heading |
| `featureComponentFeatureSummary` | `featurePropertyFeatureSummary` | Footer text below the content |

**Specific component** (one per feature type):

Each feature has its own component composition that provides the content-specific property (e.g. `featureComponentRichTextEditor` provides the rich text field).

All component properties use **SortOrder 50** on the `featureContent` tab.

**No-configuration features** (e.g. `featureNavigationDescendants`) compose only `featureComponentNoConfiguration` — they derive their content from the page context rather than editor input.

### Block Grid DataType Configuration

Features are registered as **Feature Blocks** on the `_Content Grid Default - Content - Block Grid` DataType:

- Each feature block is linked to the `featureSettings` element type, which provides colour picker settings
- Features are assigned to specific layout areas (controlling which features can appear in which areas)

### Shared Layout: `_Layout_Features.cshtml`

Most features set `Layout = "_Layout_Features.cshtml"`, which provides the standard feature rendering structure:

```html
<section id="feature-{ContentKey}" class="feature-item {alias}">
    <header class="feature__header">
        <h2>{featureTitle}</h2>
        <p class="lead">{featureDescription}</p>
    </header>
    <div class="feature__body">
        {feature-specific content via @RenderBody()}
    </div>
    <footer class="feature__footer">
        <p><small>{featureSummary}</small></p>
    </footer>
</section>
```

The layout wrapper handles:
- Rendering the `<section>` with the feature's `ContentKey` as its `id`
- Conditionally showing header (title + description) only when populated
- Rendering the feature-specific content via `@RenderBody()`
- Conditionally showing footer (summary) only when populated
- Applying background colour from feature settings
- Respecting the `featureSettingsHideDisplay` toggle (hides on front end but shows in backoffice preview)

**Exception**: Some features skip the shared layout:
- `featureNavigationDescendants` uses `_Layout.cshtml` (the base layout)
- `featureNavigationInPage` renders directly without a layout wrapper

### Feature-Specific Views

The feature's own `.cshtml` view is minimal — it only renders the content-specific part. The standard header/body/footer structure comes from the shared layout.

For example, `featureRichTextEditor.cshtml`:

```razor
@inherits UmbracoViewPage<BlockGridItem<FeatureRichTextEditor>>

@{
    Layout = "_Layout_Features.cshtml";
}

@Model.Content.RichTextContent
```

### Feature Settings

All features share the `featureSettings` element type as their settings block. This composes:

- `featureSettingsComponentColorPicker` — background colour
- `featureSettingsComponentColorPicker1` — hide/display toggle

### BlockPreview

Features get live previews automatically in the backoffice via [BlockPreview](/UmBootstrap/packages/block-preview/). Any element type whose alias does **not** start with `layout` is included.

## Creating a New Feature

1. **Create the component composition** (e.g. `featureComponentMyWidget`) with the content-specific property on the `featureContent` tab at SortOrder 50
2. **Create the feature element type** (e.g. `featureMyWidget`) in the Features folder, composing:
   - `featureComponentFeatureTitle`
   - `featureComponentFeatureDescription`
   - `featureComponentFeatureSummary`
   - Your new `featureComponentMyWidget`
3. **Create the Razor view** at `Views/Partials/blockgrid/Components/featureMyWidget.cshtml`:
   - Set `Layout = "_Layout_Features.cshtml"`
   - Render only the content-specific part (title/description/summary are handled by the layout)
4. **Add it to the Block Grid DataType** as a Feature Block:
   - Link `featureSettings` as the settings type
   - Assign it to the appropriate layout areas
5. **BlockPreview** automatically includes it — no configuration needed
