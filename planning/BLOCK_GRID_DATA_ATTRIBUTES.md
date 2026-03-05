# Block Grid & Block List Data Attribute Conventions

**STATUS:** COMPLETED (commit 95a4c72)

## Overview

Standardise how we output HTML `id` attributes, `data-` attributes, and content keys across all block grid and block list views. This establishes a consistent, future-proof naming convention that aligns with Umbraco's own terminology.

## Background

### Why this is needed

1. **Inconsistent naming**: `areas.cshtml` uses `data-ContentUdi` but the value is actually a `Guid` (content key), not a UDI. Umbraco moved from UDIs to GUIDs/Keys in v14+.
2. **Inconsistent casing**: Some attributes use PascalCase (`data-ContentUdi`, `data-GridColumns`), others use kebab-case (`data-block-alias`, `data-bgimage`). No clear convention.
3. **Useless output**: `data-Content="@Model.Content"` just outputs `ToString()` of an `IPublishedElement` - not useful.
4. **No block identification**: Feature blocks have no `id` attribute, making anchor linking (e.g. jump lists) impossible.
5. **No type disambiguation**: When multiple levels of the hierarchy output keys, there's no way to tell if a GUID belongs to a layout, feature, area, or block list item.
6. **Reusable blocks**: Umbraco is introducing reusable blocks, which could mean the same block instance appears multiple times on a page. Our ID/key strategy needs to account for this.

### Umbraco terminology

- Umbraco uses **Key** not GUID as its property name (`ContentKey`, `Content.Key`, `SettingsKey`)
- `ContentKey` is the property on `BlockGridItem` and `BlockListItem`
- `Key` is the property on `IPublishedElement` (note: `BlockGridArea` has NO `Key` property - only `Alias`, `ColumnSpan`, `RowSpan`)
- UDIs (`umb://document/...`) are legacy (pre-v14) - no longer the primary identifier

### .NET / Razor convention

- PascalCase for data attributes mirrors the C# property names, making the connection between Razor and HTML obvious
- This is an intentional project convention, not an HTML requirement (browsers lowercase all attributes anyway)

## Current State

### Block Grid Hierarchy

```
BlockGridModel (collection - no key)
  -> BlockGridItem (layout or feature block)
       Properties: ContentKey (Guid), Content.Key, Content.ContentType.Alias,
                   SettingsKey, Settings, Areas, GridColumns
     -> BlockGridArea
          Properties: Alias, ColumnSpan, RowSpan (NO Key property)
        -> BlockGridItem (nested feature blocks)
             (same properties as above)
```

### Block List Hierarchy

```
BlockListModel (collection - no key)
  -> BlockListItem
       Properties: ContentKey (Guid), Content.Key, Content.ContentType.Alias,
                   SettingsKey, Settings
```

### Current data attribute usage by file

| File | Attribute | Value | Issue |
|------|-----------|-------|-------|
| `areas.cshtml:17` | `data-ContentUdi` | `@Model.ContentKey` | Wrong name - it's a Key, not a UDI |
| `areas.cshtml:17` | `data-Content` | `@Model.Content` | Useless - outputs type ToString() |
| `areas.cshtml:17` | `data-GridColumns` | `@Model.GridColumns` | Fine but see casing discussion |
| `areas.cshtml:17` | `data-areas` | `@dataAreas` | Lowercase, trailing space in value |
| `_Layout_Layouts.cshtml:41` | `data-bgimage` | `@backgroundImage?.MediaUrl()` | Kebab-case, inconsistent |
| `_Layout_Layouts.cshtml:42` | `data-block-alias` | `@Model.Content.ContentType.Alias` | Kebab-case, inconsistent |
| `_Layout_Features.cshtml` | (none) | - | No id or data attributes at all |
| `area.cshtml` | (none) | - | No id or data attributes for key |

### Current key/GUID usage for Bootstrap component IDs

These are internal IDs used for Bootstrap JS components (accordion, tabs, carousel). They use the `n` prefix with `ToString("N")` format (GUID without hyphens).

| File | Pattern | Purpose |
|------|---------|---------|
| `featureFAQs.cshtml` | `id="n@(content.Key.ToString("N"))"` | Accordion parent ID |
| `featureFAQs.cshtml` | `id="n@(faq.Key.ToString("N"))"` | Accordion item collapse ID |
| `featureTabs.cshtml` | `id="n@(content.Key.ToString("N"))"` | Tab list ID |
| `featureTabs.cshtml` | `id="n@(tab.Key.ToString("N"))"` | Individual tab pane ID |

These are functional IDs for Bootstrap JS and should remain as-is. They are not part of this standardisation.

### JavaScript / CSS consumers

**None.** No JS or CSS in the project currently references any of these data attributes. Changes are safe.

## Design

### Naming Convention

#### Rule 1: Use Umbraco's "Key" terminology

Use `ContentKey` (not GUID, not UDI) to match the Umbraco API property name.

#### Rule 2: PascalCase for data attributes

Data attributes that mirror .NET properties use PascalCase: `data-ContentKey`, `data-GridColumns`.

This is a deliberate project convention. It signals "this value comes directly from a .NET property" and makes the Razor code self-documenting.

#### Rule 3: Prefix with entity type

To disambiguate which level of the hierarchy a key belongs to, prefix the attribute name with the entity type.

#### Rule 4: HTML `id` attributes use entity-type prefix

The `id` attribute uses a lowercase prefix matching the entity type, followed by the key. This prevents IDs starting with a digit (invalid CSS selector) and identifies the entity type at a glance.

### Proposed Convention

| Level | `id` attribute | `data-` attributes |
|-------|---------------|-------------------|
| **Layout block** | `id="layout-{ContentKey}"` | `data-LayoutContentKey`, `data-LayoutAlias` |
| **Feature block** | `id="feature-{ContentKey}"` | `data-FeatureContentKey` |
| **Area** | (none - no Key property) | `data-AreaAlias` |
| **Block list item** | (internal Bootstrap IDs only) | `data-ItemContentKey` (if needed) |

#### Additional attributes (keep or standardise)

| Attribute | Proposed | Notes |
|-----------|----------|-------|
| `data-areas` | `data-AreaAliases` | Concatenated area aliases for the layout container |
| `data-GridColumns` | `data-GridColumns` | Already correct - matches property name |
| `data-bgimage` | `data-BackgroundImage` | Align to PascalCase convention |

### Reusable Blocks Consideration

Umbraco is developing reusable blocks - blocks that can be referenced (not copied) across pages or within the same page. This has implications:

1. **Duplicate IDs**: If the same block instance appears twice on a page, `id="feature-{ContentKey}"` would produce duplicate IDs (invalid HTML). We may need to incorporate a positional index or use only `data-` attributes for the key, with a generated unique `id`.
2. **ContentKey stability**: Reusable blocks should retain the same `ContentKey` across references - that's the point. So the key identifies the *content*, not the *placement*.
3. **Future-proofing**: For now, blocks are always unique per page. When reusable blocks land, we may need to revisit the `id` strategy. The `data-` attributes remain valid regardless since they're informational, not uniqueness-constrained.

**Decision**: Proceed with `id="feature-{ContentKey}"` for now. Add a note in the implementation to revisit when reusable blocks ship. The data attributes won't need to change.

## Implementation

### Files to modify

| File | Changes |
|------|---------|
| `Views/Partials/blockgrid/Components/_Layout_Features.cshtml` | Add `id="feature-@Model.ContentKey"` and `data-FeatureContentKey="@Model.ContentKey"` to both `<section>` elements (line 36 and preview mode) |
| `Views/Partials/blockgrid/Components/_Layout_Layouts.cshtml` | Add `id="layout-@Model.ContentKey"`, rename `data-block-alias` to `data-LayoutAlias`, add `data-LayoutContentKey`, rename `data-bgimage` to `data-BackgroundImage` |
| `Views/Partials/blockgrid/areas.cshtml` | Rename `data-ContentUdi` to `data-LayoutContentKey`, replace `data-Content` with `data-LayoutAlias`, remove `data-areas` (and the loop that builds it) |
| `Views/Partials/blockgrid/area.cshtml` | Add `data-AreaAlias="@Model.Alias"` (no `id` - `BlockGridArea` has no `Key` property) |

### Block list items: shared layout consideration

Block grid features benefit from `_Layout_Features.cshtml` - a shared wrapper that all feature blocks use via `Layout = "_Layout_Features.cshtml"`. This means adding `id` and `data-` attributes once applies to all features automatically.

Block list items have no equivalent shared layout. Each block list component view (FAQs, Tabs, etc.) renders its own HTML directly. This means `data-ItemContentKey` would need adding to each one individually.

**Future consideration**: Create a `_Layout_BlockListItem.cshtml` shared wrapper for block list items, similar to `_Layout_Features.cshtml`. This would:
- Provide a single place to add `data-ItemContentKey` and other shared attributes
- Ensure consistency across all block list items
- Reduce duplication as more block list types are added

This is out of scope for the current naming consistency work but should be considered as a follow-up.

**For now**: Add `data-ItemContentKey` manually to existing block list component views (FAQs, Tabs) and any new ones (jump list item).

### Files NOT modified (and why)

| File | Reason |
|------|--------|
| `featureFAQs.cshtml` | Internal Bootstrap accordion IDs - functional, not informational. Block list `data-ItemContentKey` to be added separately. |
| `featureTabs.cshtml` | Internal Bootstrap tab IDs - functional, not informational. Block list `data-ItemContentKey` to be added separately. |
| `featureInternalLinksSlideshow.cshtml` | Internal Bootstrap carousel ID |
| All other feature `*.cshtml` | Use `_Layout_Features.cshtml` as layout - inherit the changes automatically |

### Debug blocks

Each key view gets a commented-out debug block that displays all available properties at that level of the hierarchy. These serve as a reference card for the naming convention and a quick toggle for inspecting the model during development.

| View | Debug block shows |
|------|-------------------|
| `_Layout_Features.cshtml` | `ContentKey`, `Content.ContentType.Alias`, `Content.Key`, `SettingsKey`, feature compositions (Title, Description, Summary) |
| `_Layout_Layouts.cshtml` | `ContentKey`, `Content.ContentType.Alias`, `Areas.Count`, `GridColumns`, layout settings (colour, opacity, background image) |
| `areas.cshtml` | `ContentKey`, `Content.ContentType.Alias`, `GridColumns`, `Areas` (count + aliases) |
| `area.cshtml` | `Alias`, `ColumnSpan`, `RowSpan` |

Debug blocks are Razor comments (`@* ... *@`) so they produce zero output when commented. Uncomment to render a visible panel on the page.

### Implementation order

This is a single small commit. All changes are in 4-5 files and are purely additive/renaming. No logic changes.

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Breaking JS that reads data attributes | None | Confirmed no JS/CSS references these attributes |
| Duplicate IDs from reusable blocks (future) | Medium | Documented as known limitation; data attributes unaffected |
| Confusion with Bootstrap component IDs (`n{key}`) | Low | Different convention, different purpose, documented above |
| Transferability to other UmBootstrap projects | Low | Copy the 4 modified files; no other dependencies |

## Open Questions

- [x] Should `data-BackgroundImage` replace `data-bgimage` in this PR or a separate one? **Yes - same PR, it's the same naming fix.**
- [x] Should block list items get `data-ItemContentKey` now or wait until needed? **Yes - add now for consistency.**
- [ ] When reusable blocks ship, should the `id` incorporate a positional index (e.g. `feature-{ContentKey}-{index}`)? **Deferred - can't answer until we see Umbraco's implementation. They may ship with a source key and a placement key.**
- [x] Should `data-AreaAliases` replace `data-areas` or is `data-areas` fine as-is? **Remove entirely.** The value is a concatenation of full CSS class strings with no delimiters - not useful. Individual area divs already carry their own classes. Was a debug artifact.

## Final Implementation (Reference for Other Projects)

This section documents the exact HTML output from each modified file. Any project built from the UmBootstrap template should match this exactly.

### `_Layout_Features.cshtml` — Feature block wrapper

The `<section>` element gets `id` and `data-FeatureContentKey`. This appears twice in the file (normal render and preview-mode render) — both must match.

```html
<section id="feature-@Model.ContentKey"
         class="feature-item @Model.Content.ContentType.Alias"
         data-FeatureContentKey="@Model.ContentKey"
         style="@(colorLabel != null ? $"background-color: var({colorLabel});" : "")">
```

### `_Layout_Layouts.cshtml` — Layout block wrapper

The outer `<div>` gets `id`, `data-LayoutContentKey`, `data-LayoutAlias`, and `data-BackgroundImage`.

```html
<div id="layout-@Model.ContentKey"
     class="layout-item py-3 @backgroundColorClass @backgroundOpacityClass"
     data-LayoutContentKey="@Model.ContentKey"
     data-LayoutAlias="@Model.Content.ContentType.Alias"
     data-BackgroundImage="@backgroundImage?.MediaUrl()"
     style="@styleAttribute">
    @RenderBody()
</div>
```

### `areas.cshtml` — Areas container (wraps all areas within a layout)

The outer `<div>` gets `data-LayoutContentKey`, `data-LayoutAlias`, and `data-GridColumns`. The old `data-ContentUdi`, `data-Content`, and `data-areas` attributes are removed.

```html
<div class="areas grid container"
     data-LayoutContentKey="@Model.ContentKey"
     data-LayoutAlias="@Model.Content.ContentType.Alias"
     data-GridColumns="@Model.GridColumns">
    @foreach (var area in Model.Areas)
    {
        @await Html.GetPreviewBlockGridItemAreaHtmlAsync(area)
    }
</div>
```

### `area.cshtml` — Individual area

The area `<div>` gets `data-AreaAlias`. No `id` attribute because `BlockGridArea` has no `Key` property.

```html
<div class="area-@Model.ColumnSpan @Model.Alias bg-body"
     data-AreaAlias="@Model.Alias">
    @await Html.GetPreviewBlockGridItemsHtmlAsync(Model)
</div>
```

### Debug blocks

Each file includes a commented-out debug block (`@* ... *@`) showing all available properties at that hierarchy level. These are for development inspection only and produce zero HTML output when commented.

### Summary of attribute changes from pre-standardisation

| Old attribute | New attribute | File |
|---------------|---------------|------|
| (none) | `id="feature-@Model.ContentKey"` | `_Layout_Features.cshtml` |
| (none) | `data-FeatureContentKey="@Model.ContentKey"` | `_Layout_Features.cshtml` |
| (none) | `id="layout-@Model.ContentKey"` | `_Layout_Layouts.cshtml` |
| `data-block-alias` | `data-LayoutAlias="@Model.Content.ContentType.Alias"` | `_Layout_Layouts.cshtml` |
| (none) | `data-LayoutContentKey="@Model.ContentKey"` | `_Layout_Layouts.cshtml` |
| `data-bgimage` | `data-BackgroundImage="@backgroundImage?.MediaUrl()"` | `_Layout_Layouts.cshtml` |
| `data-ContentUdi` | `data-LayoutContentKey="@Model.ContentKey"` | `areas.cshtml` |
| `data-Content` | `data-LayoutAlias="@Model.Content.ContentType.Alias"` | `areas.cshtml` |
| `data-areas` | (removed) | `areas.cshtml` |
| (none) | `data-AreaAlias="@Model.Alias"` | `area.cshtml` |

### Transferring to another UmBootstrap-based project

Copy these 4 files from UmBootstrap into the target project, preserving paths:

1. `Views/Partials/blockgrid/Components/_Layout_Features.cshtml`
2. `Views/Partials/blockgrid/Components/_Layout_Layouts.cshtml`
3. `Views/Partials/blockgrid/areas.cshtml`
4. `Views/Partials/blockgrid/area.cshtml`

No other files or dependencies are involved. The changes are purely HTML attribute additions/renames with no logic changes.
