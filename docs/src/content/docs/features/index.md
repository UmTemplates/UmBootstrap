---
title: Features
description: Content blocks that editors place inside layout areas — rich text, images, FAQs, navigation, and more.
---

Features are content blocks that editors place inside layout areas. Each feature renders a specific type of content — rich text, images, FAQs, navigation, etc.

## Available Features

| Element Type | Display Name | Component Composition |
|---|---|---|
| [`featureRichTextEditor`](/UmBootstrap/features/rich-text-editor/) | Rich Text Editor | `featureComponentRichTextEditor` |
| [`featureImage`](/UmBootstrap/features/image/) | Image | `featureComponentImage` |
| [`featureImageSlideshow`](/UmBootstrap/features/image-slideshow/) | Image Slideshow | `featureComponentImageSlideshow` |
| [`featureCode`](/UmBootstrap/features/code/) | Code | `featureComponentCode` |
| [`featureHTML`](/UmBootstrap/features/html/) | HTML | `featureComponentHtml` |
| [`featureFaqs`](/UmBootstrap/features/faqs/) | FAQs | `featureComponentFaqs` |
| [`featureTabs`](/UmBootstrap/features/tabs/) | Tabs | `featureComponentTabs` |
| [`featureInternalLinks`](/UmBootstrap/features/internal-links/) | Internal Links - Selected | `featureComponentsInternalLinks` |
| [`featureInternalLinksChildren`](/UmBootstrap/features/internal-links-children/) | Internal Links - Children | `featureComponentsInternalLinks` |
| [`featureInternalLinksPagination`](/UmBootstrap/features/internal-links-pagination/) | Internal Links - Pagination | `featureComponentsInternalLinks` |
| [`featureInternalLinksSlideshow`](/UmBootstrap/features/internal-links-slideshow/) | Internal Links - Slideshow | `featureComponentInternalLinksSlideshow` |
| [`featureFormContactUs`](/UmBootstrap/features/form-contact-us/) | Form - Contact Us | (inline form fields) |
| [`featurePageTitleDescription`](/UmBootstrap/features/page-title-description/) | Page Title and Description | (reads from page properties) |
| [`featureNavigationDescendants`](/UmBootstrap/features/navigation-descendants/) | Navigation - Descendants | `featureComponentNoConfiguration` |
| [`featureNavigationInPage`](/UmBootstrap/features/navigation-in-page/) | Navigation - In Page | `featureComponentNavigationInPage` |
| [`featureNavigationTableOfContents`](/UmBootstrap/features/navigation-table-of-contents/) | Navigation - Table of Contents | `featureComponentNoConfiguration` |

## Naming Convention

All feature element types follow the pattern `feature{Name}`.

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
- Respecting the `featureSettingsHideDisplay` toggle

**Exception**: Some features skip the shared layout — navigation features typically render their own container directly.

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

Features use settings blocks to provide editor-configurable options. There are two levels:

**Shared settings** — `featureSettings` (used by most features):

| Composition | Property | Purpose |
|---|---|---|
| `featureSettingsComponentColorPicker` | `featureSettingsColourPicker` | Background colour picker |
| `featureSettingsComponentHideDisplay` | `featureSettingsHideDisplay` | Hide/display toggle |

**Per-feature settings** — for features that need additional options:

| Settings Type | Used By | Extra Compositions |
|---|---|---|
| `featureSettingsNavigation` | `featureNavigationDescendants`, `featureNavigationInPage` | `featureSettingsComponentStickyNav` (sticky toggle) |

Per-feature settings types compose the same shared components (colour picker, hide/display) plus feature-specific ones.

### Per-Feature Settings Pattern

To create a per-feature settings type:

1. **Create the settings component** (e.g. `featureSettingsComponentStickyNav`) — an element type with the feature-specific property
2. **Create the settings type** (e.g. `featureSettingsNavigation`) — composes `featureSettingsComponentColorPicker` + `featureSettingsComponentHideDisplay` + your new component
3. **Update the Block Grid DataType** — change the settings element type for the relevant feature blocks from `featureSettings` to your new type
4. **Update the views** — read the new property from `Model.Settings`

Features without custom settings stay on the generic `featureSettings`. Migrate incrementally as needs arise.

### BlockPreview

Features get live previews automatically in the backoffice via [BlockPreview](/UmBootstrap/maintenance/packages/block-preview/). Any element type whose alias does **not** start with `layout` is included.

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
