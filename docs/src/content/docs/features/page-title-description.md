---
title: Page Title & Description
description: Displays the current page's title and description — no editor input needed.
---

The Page Title and Description feature reads the current page's title and description properties and displays them. It requires no editor input — the content comes from the page itself.

## Details

| Property | Value |
|---|---|
| Element type alias | `featurePageTitleDescription` |
| Display name | Page Title and Description |
| Component composition | (reads from page properties) |
| Settings type | `featureSettings` |
| Uses shared layout | Yes (`_Layout_Features.cshtml`) |

## How It Works

This feature does not have a content-specific composition. Instead, the Razor view reads the current page's `Name` and description properties directly. This means:

- Editors don't need to re-enter the page title in the block
- The title and description automatically stay in sync with the page
- Useful as a hero or header block at the top of a page
