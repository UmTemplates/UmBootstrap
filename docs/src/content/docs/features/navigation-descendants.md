---
title: Navigation - Descendants
description: Displays a tree navigation of the current page's descendant pages.
---

The Navigation - Descendants feature renders a tree navigation showing the current page's child and descendant pages. It also includes a breadcrumb on mobile.

## Details

| Property | Value |
|---|---|
| Element type alias | `featureNavigationDescendants` |
| Display name | Navigation - Descendants |
| Component composition | `featureComponentNoConfiguration` |
| Settings type | `featureSettingsNavigation` |
| Uses shared layout | No (uses `_Layout.cshtml`) |

## How It Works

This is a **no-configuration feature** — it composes only `featureComponentNoConfiguration` and derives its content entirely from the page context. The view reads the current page's descendants and renders them as a hierarchical navigation tree.

### Responsive Behaviour

- **Desktop (md+)**: Shows a tree navigation (`d-none d-md-block`)
- **Mobile (below md)**: Shows a breadcrumb (`d-block d-md-none`)

### Sticky Positioning

Uses the `featureSettingsNavigation` settings type which includes an **Enable Sticky** toggle. When enabled, the nav becomes sticky using the same CSS `:has()` pattern as [Navigation - In Page](/UmBootstrap/features/navigation-in-page/).
