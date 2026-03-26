---
title: "Layout 3|9"
description: Two-column layout with a narrow sidebar and wide main area.
---

A two-column layout with a narrow sidebar (3) and a wide main area (9).

## Details

| Property | Value |
|---|---|
| Element type alias | `layout39` |
| Display name | Layout - 3 \| 9 |
| Areas | 2 |
| Column split | 3 + 9 |

## Areas

| Alias | Desktop columns | Purpose |
|---|---|---|
| (sidebar) | 3 (lg) / 4 (md) | Sidebar — navigation, filters, links |
| (main) | 9 (lg) / 8 (md) | Primary content area |

## Responsive Behaviour

- **Desktop (lg+)**: Two columns (3 + 9)
- **Tablet (md)**: Sidebar narrows slightly (4 + 8)
- **Mobile (below md)**: Both areas stack to full width

## Usage

Use `layout39` when you need a sidebar alongside main content but don't need a secondary column on the right. Simpler alternative to `layout363` when only one sidebar is needed.
