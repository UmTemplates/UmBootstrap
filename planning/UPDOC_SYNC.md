# Sync UmBootstrap → UpDoc Test Site

## Context
UmBootstrap is the single source of truth for shared layouts, features, and SCSS. UpDoc's test site has drifted — missing the theme system, new SCSS partials, SlugHelper, and updated navigation views. This sync brings UpDoc up to date before the subsequent task of syncing UpDoc → Tailored Travel for client presentation.

**Approach**: Work through changes in small testable groups, lowest risk first. Decisions about divergent files (carousel, layout IDs, slug IDs) will be made during implementation by comparing side by side — not upfront.

## Pre-work
- [x] Create feature branch in UpDoc: `feature/sync-from-umbootstrap`
- [x] Verify UpDoc builds before starting (baseline)

## Step 1: New SCSS partials (additive, zero conflict) ✓
Copy these files from UmBootstrap — they don't exist in UpDoc yet:
- [x] `_anchors.scss` → `UpDoc.TestSite/SCSS/_anchors.scss`
- [x] `_layout.scss` → `UpDoc.TestSite/SCSS/_layout.scss`
- [x] `_sticky.scss` → `UpDoc.TestSite/SCSS/_sticky.scss`
- [x] Entire `themes/` folder → `UpDoc.TestSite/SCSS/themes/`

**No namespace or project-specific changes needed — pure CSS.**

## Step 2: Update index.scss ✓
- [x] Add imports for new partials (`_layout`, `_anchors`, `_sticky`)
- [x] Add theme imports (`themes/bootstrap`, `themes/umbraco`, `themes/ultraviolet`)
- [x] Remove inline CSS that's now covered by the new partials (navbar-height, sticky nav rules, scroll-margin-top, shadow utilities)
- [x] Fix `_overrides` import order to match UmBootstrap (after maps, not before)
- [x] **Compare side by side** before finalising — discuss any differences

**TEST: Rebuild SCSS, verify site renders, check sticky nav and scroll-margin.** ✓

## Step 3: Update existing SCSS partials (one at a time)
For each file, compare UmBootstrap vs UpDoc side by side and discuss before replacing:
- [x] `_card.scss` — UmBootstrap adds SVG theming
- [x] `_navbar.scss` — UmBootstrap adds dark mode toggler icons
- [x] `_nav.scss` — UmBootstrap adds mobile bottom bar for in-page nav
- [x] `_type.scss` — Lato removed from headings (now in theme system)
- [x] `_utilities.scss` — replaced with UmBootstrap version (RGB mixin, shadow utilities)
- [x] `_carousel.scss` — replaced with UmBootstrap version (commented out)
- [x] `_variables_overrides.scss` — replaced (removed list-group overrides, now in theme)
- [x] `_overrides.scss` — replaced with UmBootstrap version
- [x] `_variables.scss` — replaced (removed coral colours, mixin, Umbraco overrides — all now in theme system)

**TEST: Rebuild SCSS after each file, verify visuals.**

## Step 4: C# changes
- [x] Copy `SlugHelper.cs` to `UpDoc.TestSite/Helpers/` — namespace changed to `UpDoc.TestSite.Helpers`
- [x] `FeatureBlockDataSource.cs` — updated to skip untitled blocks (matching UmBootstrap)
- [x] `Program.cs` — already identical, no changes needed

**TEST: `dotnet build`. Run site. Test in-page nav data source in backoffice.**

## Step 5: View changes (highest risk, do last)
Compare each view side by side and discuss before changing:
- [x] `_Layout_Features.cshtml` — SlugHelper integration, anchor links, slug-based IDs
- [x] `_Layout_Layouts.cshtml` — removed layout ID to match UmBootstrap
- [x] `featureNavigationInPage.cshtml` — replaced with desktop/mobile dual nav (offcanvas)
- [x] `featureNavigationDescendants.cshtml` — already identical, no changes needed

**TEST: Full navigation test — anchor links, ScrollSpy, sticky nav, mobile offcanvas.** ✓

## Step 6: Final verification
- [x] Full visual check across all pages
- [ ] Mobile and desktop layouts
- [ ] Dark mode
- [x] Commit with clear message

## Key files
| Source (UmBootstrap) | Target (UpDoc) |
|---|---|
| `Umbootstrap.Web/SCSS/` | `UpDoc.TestSite/SCSS/` |
| `Umbootstrap.Web/Helpers/SlugHelper.cs` | `UpDoc.TestSite/Helpers/SlugHelper.cs` |
| `Umbootstrap.Web/DataSources/FeatureBlockDataSource.cs` | `UpDoc.TestSite/DataSources/FeatureBlockDataSource.cs` |
| `Umbootstrap.Web/Views/Partials/blockgrid/Components/` | `UpDoc.TestSite/Views/Partials/blockgrid/Components/` |

## Rules
- UmBootstrap is source of truth, but discuss divergences before overwriting
- UpDoc-specific files (travel views, coral colors) are NOT touched
- Namespace must be `UpDoc.TestSite`, not `Umbootstrap.Web`
- Small steps, test after each group, discuss before each decision
