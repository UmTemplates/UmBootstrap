# Sync UpDoc Test Site → Tailored Travel

## Context
Dean is preparing Tailored Travel for a client presentation. The travel-specific document types, element types, and views currently only exist in UpDoc's test site. They need to be transferred to Tailored Travel, which already has the full UmBootstrap foundation (layouts, features, SCSS, SlugHelper, navigation).

**SCSS/CSS is completely OUT OF SCOPE** — Tailored Travel has its own custom theme and styling. Any SCSS changes must be handled separately in a dedicated session.

## DO NOT TOUCH:
- **All SCSS/CSS** — TT has its own theme, layout tweaks, and brand styling
- **Header/navbar views** — intentionally different (TT brand)
- **Any shared UmBootstrap types** — TT already has these

---

## Pre-work ✓
- [x] Create feature branch in Tailored Travel: `feature/updoc-travel-types`
- [x] Verify Tailored Travel builds and runs before starting
- [x] Export uSync baseline from Tailored Travel (snapshot before changes)
- [x] Run uSync export on UpDoc test site to generate config files
- [x] Verify uSync files appear in `UpDoc.TestSite/uSync/v17/`

## Step 1: Shared travel element types ✓
- [x] `featurerichtexteditoraccommodation.config`
- [x] `featurerichtexteditorfeatures.config`
- [x] `featurerichtexteditoritinery.config`
- [x] `featurerichtexteditorsights.config`
- [x] `featureFormContactUs` — already existed in TT, skipped
- [x] Views: all 4 RTE variant `.cshtml` files copied
- [x] uSync import verified — 4 new element types in backoffice
- [x] Committed: `da307b7`

## Step 2: Group Tour ✓
- [x] `contentgridgrouptour.config` (composition)
- [x] `BlockGridGroupTour.config` (data type)
- [x] `grouptour.config` + `grouptours.config` (document types)
- [x] Views: `groupTour.cshtml` + `groupTours.cshtml`
- [x] uSync import verified — 1 DataType + 3 DocTypes
- [x] Committed: `799a642`

## Step 3: Tailored Tour ✓
- [x] `tourorganiser.config` (element type)
- [x] `tourproperties.config` (composition with Organisers block list)
- [x] `featurepageorganisers.config` (element type)
- [x] `contentgridtailoredtour.config` (composition)
- [x] `BlockGridTailoredTour.config` + `TourPropertiesBlockList.config` (data types)
- [x] `tailoredtour.config` + `tailoredtours.config` (document types)
- [x] Views: `tailoredTour.cshtml`, `tailoredTours.cshtml`, `featurePageOrganisers.cshtml`
- [x] uSync import verified — 2 DataTypes + 8 DocTypes
- [x] Committed: `78a2e78`

## Step 4: Index Page ✓
- [x] `indexpage.config` (document type)
- [x] View: `indexPage.cshtml`
- [x] uSync import verified — 6 DocTypes (includes dependencies)
- [x] Committed: `3fbfe3f`

## Step 5: C# fix ✓
- [x] Fix FeatureBlockDataSource.cs group name: `"UmBootstrap"` → `"Tailored Travel"`
- [x] Committed: `e9e0e01`

## Step 6: Content, media, and blueprints (TODO)
- [ ] Decide whether to import PDFs/media from UpDoc
- [ ] Decide whether to import sample content or create fresh
- [ ] Check UpDoc blueprints — TT has 1, UpDoc had 2
- [ ] Import media first if needed (content may reference media items)

## Step 7: Final verification (TODO)
- [ ] Create a test Group Tour page — add content blocks, verify rendering
- [ ] Create a test Tailored Tour page — add organisers, verify rendering
- [ ] Test in-page navigation on tour pages
- [ ] Merge feature branch to develop, push

## Key paths
| Source (UpDoc) | Target (Tailored Travel) |
|---|---|
| `UpDoc.TestSite/uSync/v17/ContentTypes/` | `TailoredTravel.Web/uSync/v17/ContentTypes/` |
| `UpDoc.TestSite/uSync/v17/DataTypes/` | `TailoredTravel.Web/uSync/v17/DataTypes/` |
| `UpDoc.TestSite/Views/` | `TailoredTravel.Web/Views/` |
| `UpDoc.TestSite/Views/Partials/blockgrid/Components/` | `TailoredTravel.Web/Views/Partials/blockgrid/Components/` |

## Rules
- UpDoc is the source for travel-specific types; UmBootstrap is source of truth for shared infrastructure
- Namespace must be `TailoredTravel.Web`, not `UpDoc.TestSite`
- Do NOT touch ANY SCSS, CSS, themes, header, or navbar — all intentionally project-specific
- Any SCSS sync is a separate task requiring careful incremental review
- Small steps, test after each group, commit frequently
- uSync configs first, import, then add views (chicken-and-egg: views need ModelsBuilder types)
