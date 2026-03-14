# Navigation Enhancements

**STATUS:** Planning

## Overview

Enhancements to fragment IDs, anchor linking, and navigation positioning across the block grid system. Builds on the human-readable slug IDs implemented in `feature/human-readable-fragment-ids`.

---

## 1. Hover Hash Links

**Goal:** Show a clickable `#` link on feature block headings so users can easily copy/share the anchor URL.

- [ ] Add a `#` or chain icon that appears on hover next to the feature title heading
- [ ] The link href points to the block's own slug ID (e.g. `#introduction-a1b2`)
- [ ] Clicking it updates the browser URL with the fragment
- [ ] CSS: hidden by default, visible on `:hover` of the heading
- [ ] Accessible: appropriate `aria-label` on the anchor
- [ ] Consider whether this belongs in `_Layout_Features.cshtml` (all features) or is opt-in via settings

**Notes:**
- No client-side slug generation needed — the `id` is already in the DOM, the link just references it
- Future native share (Web Share API) would read the fragment from `window.location.hash`

---

## 2. Table of Contents Feature

**Goal:** A new `featureTableOfContents` block that renders an inline, collapsible list of titled feature blocks on the page.

- [ ] New element type `featureTableOfContents`
- [ ] Collapsible on all screen sizes (not just mobile like in-page nav)
- [ ] Auto-generates from all titled feature blocks on the page (no manual picker)
- [ ] Sits inline with content flow (typically in the main content area)
- [ ] Could reuse `SlugHelper` and `FeatureBlockDataSource` logic

**Difference from in-page nav:**
| | In-Page Nav | Table of Contents |
|---|---|---|
| Position | Sidebar (sticky) | Inline with content |
| Collapse | Mobile only | Any screen size |
| Content | Editor-picked blocks | Auto-generated from titled blocks |
| Use case | Persistent navigation | Overview/summary |

---

## 3. Context-Aware Sticky Positioning

**Goal:** The in-page nav behaves differently based on which column it's placed in.

- [ ] **Left column**: sticky top (current behaviour — nav at top, content flows below)
- [ ] **Right column on desktop**: sticky top (stays visible while scrolling main content)
- [ ] **Right column on mobile**: sticky bottom (like a fixed footer bar, since right column drops to bottom of page)

**Approach options:**
1. **CSS-only with area classes** — use `area-*` or column span classes to infer position and apply different sticky rules
2. **Editor setting** — toggle on the nav block settings ("Sticky position: top / bottom")
3. **JavaScript** — detect which area the nav is in and adjust positioning dynamically

**Challenge:** Right column goes to bottom on mobile. Sticky top is useless there since the user has already scrolled past all content. Sticky bottom gives mobile users persistent access to navigation.

---

## 4. Picker Enhancements

### 4a. Show/Hide Untitled Blocks

- [ ] Add a toggle to `featureSettingsNavigation`: "Include untitled blocks"
- [ ] When enabled, `FeatureBlockDataSource` returns all feature blocks (using alias as fallback name)
- [ ] When disabled (default), only blocks with a `featurePropertyFeatureTitle` appear
- [ ] This replaces the current hardcoded title filtering in the DataSource

### 4b. Future: Custom Property Editor

- [ ] If Contentment picker limitations become blocking, consider a custom property editor
- [ ] Would allow inline filtering, grouping, and more control over the picker UX
- [ ] Not in scope for immediate work

---

## Dependencies

- Human-readable slug IDs (Sprint 1 — done)
- `SlugHelper.cs` static helper (done)
- `[data-FeatureContentKey]` CSS selector (done)
