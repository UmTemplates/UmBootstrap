# Sync UmBootstrap → UpDoc Test Site

## Context
UmBootstrap is the single source of truth for shared layouts, features, and SCSS. UpDoc's test site has drifted — missing the theme system, new SCSS partials, SlugHelper, and updated navigation views. This sync brings UpDoc up to date before the subsequent task of syncing UpDoc → Tailored Travel for client presentation.

**Approach**: Work through changes in small testable groups, lowest risk first. Decisions about divergent files (carousel, layout IDs, slug IDs) will be made during implementation by comparing side by side — not upfront.

## Pre-work
- [ ] Create feature branch in UpDoc: `feature/sync-from-umbootstrap`
- [ ] Verify UpDoc builds before starting (baseline)

## Step 1: New SCSS partials (additive, zero conflict)
Copy these files from UmBootstrap — they don't exist in UpDoc yet:
- [ ] `_anchors.scss` → `UpDoc.TestSite/SCSS/_anchors.scss`
- [ ] `_layout.scss` → `UpDoc.TestSite/SCSS/_layout.scss`
- [ ] `_sticky.scss` → `UpDoc.TestSite/SCSS/_sticky.scss`
- [ ] Entire `themes/` folder → `UpDoc.TestSite/SCSS/themes/`

**No namespace or project-specific changes needed — pure CSS.**

## Step 2: Update index.scss
- [ ] Add imports for new partials (`_layout`, `_anchors`, `_sticky`)
- [ ] Add theme imports (`themes/bootstrap`, `themes/umbraco`, `themes/ultraviolet`)
- [ ] Remove inline CSS that's now covered by the new partials (navbar-height, sticky nav rules, scroll-margin-top, shadow utilities)
- [ ] Fix `_overrides` import order to match UmBootstrap (after maps, not before)
- [ ] **Compare side by side** before finalising — discuss any differences

**TEST: Rebuild SCSS, verify site renders, check sticky nav and scroll-margin.**

## Step 3: Update existing SCSS partials (one at a time)
For each file, compare UmBootstrap vs UpDoc side by side and discuss before replacing:
- [ ] `_card.scss` — UmBootstrap adds SVG theming
- [ ] `_navbar.scss` — UmBootstrap adds dark mode toggler icons
- [ ] `_nav.scss` — UmBootstrap adds mobile bottom bar for in-page nav
- [ ] `_type.scss` — discuss Lato font handling (theme vs hardcoded)
- [ ] `_utilities.scss` — UmBootstrap has RGB custom property generation; UpDoc has shade maps. Merge carefully.
- [ ] `_carousel.scss` — discuss: is carousel used in UpDoc?
- [ ] `_variables_overrides.scss` — compare and discuss
- [ ] `_overrides.scss` — compare and discuss

**DO NOT TOUCH: `_variables.scss`** — UpDoc's coral/brand colors are site-specific.

**TEST: Rebuild SCSS after each file, verify visuals.**

## Step 4: C# changes
- [ ] Copy `SlugHelper.cs` to `UpDoc.TestSite/Helpers/` — change namespace to `UpDoc.TestSite.Helpers`
- [ ] Compare `FeatureBlockDataSource.cs` side by side — discuss untitled block handling difference
- [ ] `Program.cs` — compare, likely no changes needed

**TEST: `dotnet build`. Run site. Test in-page nav data source in backoffice.**

## Step 5: View changes (highest risk, do last)
Compare each view side by side and discuss before changing:
- [ ] `_Layout_Features.cshtml` — SlugHelper integration, anchor links, ID scheme. Discuss GUID vs slug.
- [ ] `_Layout_Layouts.cshtml` — UpDoc has layout ID that UmBootstrap doesn't. Discuss.
- [ ] `featureNavigationInPage.cshtml` — major difference (collapse vs offcanvas). Compare and discuss.
- [ ] `featureNavigationDescendants.cshtml` — compare for any drift

**TEST: Full navigation test — anchor links, ScrollSpy, sticky nav, mobile offcanvas.**

## Step 6: Final verification
- [ ] Full visual check across all pages
- [ ] Mobile and desktop layouts
- [ ] Dark mode
- [ ] Commit with clear message

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
