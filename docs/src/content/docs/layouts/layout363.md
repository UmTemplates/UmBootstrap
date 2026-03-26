---
title: "Layout 3|6|3"
description: Three-column layout with tertiary, primary, and secondary areas.
---

A three-column layout splitting the page into tertiary (3), primary (6), and secondary (3) columns.

## Details

| Property | Value |
|---|---|
| Element type alias | `layout363` |
| Display name | Layout - 3 \| 6 \| 3 |
| Areas | 3 |
| Column split | 3 + 6 + 3 |

## Areas

| Alias | Desktop columns | Purpose |
|---|---|---|
| `tertiary` | 3 (lg) / 4 (md) | Side content — typically navigation |
| `primary` | 6 (lg) / 8 (md) | Main content area |
| `secondary` | 3 (lg) / 12 (md) | Supporting content — links, related items |

## Responsive Behaviour

- **Desktop (lg+)**: Three columns side by side (3 + 6 + 3)
- **Tablet (md)**: Tertiary and primary share a row (4 + 8), secondary drops to full width below
- **Mobile (below md)**: All areas stack to full width

## Usage

Use `layout363` for content pages that need sidebar navigation or supplementary content alongside the main body. This is the typical layout for documentation-style pages with a table of contents or in-page navigation.
