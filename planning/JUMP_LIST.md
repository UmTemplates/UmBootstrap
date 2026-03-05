# Jump List Feature

**STATUS:** DRAFT

## Overview

A "Jump List" feature block (`featureJumpList`) that lets editors build a sticky table-of-contents linking to specific feature blocks on the page. Uses `<details>`/`<summary>` HTML elements for a collapsible list of anchor links.

## Background

Long pages with multiple feature blocks need a way for users to jump to specific sections. This is common on documentation sites, landing pages, and content-heavy pages.

### Dependencies

- **Prerequisite**: Block Grid Data Attributes naming consistency (see `planning/BLOCK_GRID_DATA_ATTRIBUTES.md`) must be completed first. The jump list relies on feature blocks having `id="feature-{ContentKey}"` attributes for anchor linking.

## Design

### Editor Experience (Phased)

- **Phase 1 (this plan)**: Block List with manual Label + Anchor ID textboxes (simple, transferable)
- **Phase 2 (future)**: Custom property editor that browses blocks on the current page for a polished picker UX. Could also be contributed as an enhancement to Umbraco's Multi URL Picker (PR/proposal)

### Anchor linking

Jump list items link to `#feature-{ContentKey}` anchors on feature blocks. The `id` and `data-FeatureContentKey` attributes are added by the data attributes work (see prerequisite above).

### Element type structure

```
featureJumpList (main feature block)
  Compositions:
    - featureComponentFeatureTitle
    - featureComponentFeatureDescription
    - featureComponentFeatureSummary
    - featureComponentJumpList
        -> featurePropertyJumpListItems (Block List)
            -> featureComponentJumpListItem
                -> featurePropertyJumpListItemLabel (TextBox)
                -> featurePropertyJumpListItemAnchor (TextBox)
```

### HTML output

```html
<section id="feature-{ContentKey}" data-FeatureContentKey="{ContentKey}" class="feature-item featureJumpList">
  <!-- header from _Layout_Features.cshtml -->
  <details class="jump-list" open>
    <summary>On this page</summary>
    <nav aria-label="Jump to section">
      <ul>
        <li><a href="#feature-{targetKey}">Label</a></li>
        ...
      </ul>
    </nav>
  </details>
  <!-- footer from _Layout_Features.cshtml -->
</section>
```

## Implementation

### Sprint 1: Jump List Item Element Type (uSync configs)

**Goal**: Create the element type for individual jump list entries.

**Create 3 files**:
1. `uSync/v17/ContentTypes/featurecomponentjumplistitem.config` - Element type `featureComponentJumpListItem`
   - Properties: `featurePropertyJumpListItemLabel` (TextBox), `featurePropertyJumpListItemAnchor` (TextBox)
   - Pattern: `featurecomponentfaq.config`

2. `uSync/v17/ContentTypes/featurecomponentjumplist.config` - Composition `featureComponentJumpList`
   - Property: `featurePropertyJumpListItems` (Block List pointing to DataType below)
   - Pattern: `featurecomponentfaqs.config`

3. `uSync/v17/DataTypes/FeatureComponentJumpListItemsBlockList.config` - Block List DataType
   - Single allowed block: `featureComponentJumpListItem`
   - Pattern: `FeatureComponentFAQsFAQsBlockList.config`

**Test**: uSync import, verify element types in backoffice.

### Sprint 2: featureJumpList Element Type + Block Grid Registration

**Goal**: Create the main feature block and register it in the block grid.

**Create**: `uSync/v17/ContentTypes/featurejumplist.config`
- Compositions: featureComponentFeatureTitle, featureComponentFeatureDescription, featureComponentFeatureSummary, featureComponentJumpList
- Pattern: `featurefaqs.config`

**Modify**: `ContentGridDefaultContentBlockGrid.config`
- Add featureJumpList block entry (allowAtRoot: false, allowInAreas: true, Feature Blocks group)

**Test**: uSync import, verify featureJumpList appears in block grid editor.

### Sprint 3: Razor View

**Goal**: Render the jump list with `<details>`/`<summary>` and anchor links.

**Create**: `Views/Partials/blockgrid/Components/featureJumpList.cshtml`
- Uses `_Layout_Features.cshtml` layout
- Iterates Block List items, renders `<details>`/`<summary>` with `<nav>` + `<ul>` of anchor links
- Pattern: `featureFAQs.cshtml`

**Test**: Add block in backoffice, add items with matching anchor IDs, verify rendering and navigation.

### Sprint 4: Block List Preview

**Goal**: Show meaningful preview of jump list items in backoffice editor.

**Create**: `Views/Partials/blocklist/Components/featureComponentJumpListItem.cshtml`
- Shows label and anchor target in preview

**Test**: Verify items show label + anchor in backoffice block list editor.

### Sprint 5: CSS Sticky Behavior + Styling

**Goal**: Sticky positioning and visual styling.

**Create**: `SCSS/_jump-list.scss`
- `.jump-list` styles for details/summary
- `.featureJumpList` sticky positioning (uses alias class already on `<section>`)
- `[id^="feature-"]` scroll-margin-top for offset when jumping

**Modify**: `SCSS/index.scss` - Add `@import "_jump-list"`

**Test**: Compile SCSS, verify sticky on scroll, verify scroll offset on anchor navigation.

## Sprint Dependencies

```
Data Attributes work (prerequisite) ────────────────────┐
Sprint 1 (item type) -> Sprint 2 (main type) -> Sprint 3 (view) -> Sprint 5 (CSS)
                      -> Sprint 4 (preview)
```

Sprints 1 and the data attributes work are independent and can run in parallel.

## Transferability

Each sprint produces discrete files that can be copied to another UmBootstrap-based project:
- Sprint 1: 3 uSync configs (copy + import)
- Sprint 2: 1 uSync config + merge block grid config
- Sprint 3: 1 cshtml
- Sprint 4: 1 cshtml
- Sprint 5: 1 scss + 1 import line

## Modified Files

| Sprint | Files Created | Files Modified |
|--------|--------------|----------------|
| 1 | 3 uSync configs | 0 |
| 2 | 1 uSync config | 1 (Block Grid DataType) |
| 3 | 1 cshtml | 0 |
| 4 | 1 cshtml | 0 |
| 5 | 1 scss | 1 (index.scss) |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Editor doesn't know what anchor ID to use | Phase 2 custom picker will solve this. For Phase 1, editors inspect page source or use devtools. |
| Anchor IDs change if blocks are recreated | ContentKey is stable for the lifetime of a block instance. Only changes if the block is deleted and re-added. |
| Multiple jump lists on same page | Each is independent - no conflict. |
