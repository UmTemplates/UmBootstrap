# Navigation - In Page Feature

**STATUS:** IMPLEMENTED (renamed from "Jump List")

## Overview

A "Navigation - In Page" feature block (`featureNavigationInPage`) that lets editors build a table-of-contents linking to specific feature blocks on the page. Uses a Contentment Data List with a custom `FeatureBlockDataSource` to let editors pick from feature blocks on the current page.

## Naming History

Renamed from "Jump List" to "Navigation - In Page" to align with the project's feature naming convention (alongside `featureNavigationDescendants` for the left nav).

| Old Name | New Name |
|----------|----------|
| `featureJumpList` | `featureNavigationInPage` |
| `featureComponentJumpList` | `featureComponentNavigationInPage` |
| `featurePropertyJumpListItems` | `featurePropertyNavigationInPageItems` |
| `Feature Component - Jump List Items - Data List` | `Feature Component - Navigation In Page Items - Data List` |
| `featureJumpList.cshtml` | `featureNavigationInPage.cshtml` |

## Element Type Structure

```
featureNavigationInPage (main feature block)
  Compositions:
    - featureComponentNavigationInPage
        -> featurePropertyNavigationInPageItems (Contentment Data List)
            -> FeatureBlockDataSource (custom C# data source)
            -> Item Picker (list editor)
```

## Implementation

### Contentment Data List
- Custom `FeatureBlockDataSource.cs` reads block grid via GUID from API request body
- `Program.cs` has `EnableBuffering()` middleware for Contentment API paths
- Block grid property alias is `contentGrid`

### View
- `featureNavigationInPage.cshtml` renders a card with list-group nav links
- Links to `#feature-{ContentKey}` anchors on feature blocks
- Renders directly (no `_Layout_Features.cshtml` wrapper)

## Remaining Work

### Sticky Positioning
- Make the navigation sticky within its layout area
- Add CSS offset (`top: 5rem`) to clear the fixed navbar
- Consider whether this belongs on a layout variant (`layout363sticky`) or on the feature itself

### Collapse/Expand
- Add Bootstrap collapse component support
- Toggle visibility of the nav list

### Picker Filtering
- Filter which feature blocks appear in the Contentment picker
