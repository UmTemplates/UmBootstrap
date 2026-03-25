# Responsive Image Media Type → Tailored Travel

## Context
The Image - Responsive media type is built and tested in UmBootstrap. It needs to be transferred to Tailored Travel so images can be uploaded with metadata and responsive crops for the client presentation.

## What needs to go across

### uSync files from UmBootstrap → Tailored Travel
**Media Types (3 files):**
- `mediacomponentmetadata.config` — base metadata composition (Title, Description)
- `mediacomponentimagemetadata.config` — image metadata composition (Alt Text, Credit, Copyright)
- `imageresponsive.config` — the Image - Responsive media type
- `folder.config` — updated with Image - Responsive in allowed children

**Data Types (2 files):**
- `ImageCropperResponsive.config` — Image Cropper with 5 named crops
- `FeatureComponentImageMediaPicker.config` — media picker accepting Image + Image - Responsive + SVG

**Document Type changes:**
- `featurecomponentimage.config` — updated property alias from `image` to `featurePropertyFeatureImage`

### Views to update
- `featureImage.cshtml` (blockgrid) — property alias changed
- `featureImage.cshtml` (blocklist) — property alias changed

### Generated models
- Will regenerate on restart after uSync import

## Steps

### Pre-work
- [ ] Merge `feature/responsive-image-media-type` to develop in UmBootstrap
- [ ] Push UmBootstrap develop
- [ ] Create feature branch in Tailored Travel: `feature/responsive-image-media-type`

### Step 1: Copy uSync files (configs only, no views)
- [ ] Copy MediaTypes: `mediacomponentmetadata.config`, `mediacomponentimagemetadata.config`, `imageresponsive.config`
- [ ] Copy updated `folder.config`
- [ ] Copy DataTypes: `ImageCropperResponsive.config`, `FeatureComponentImageMediaPicker.config`
- [ ] Copy updated `featurecomponentimage.config` (Feature Component - Image)

### Step 2: Import via uSync
- [ ] Start Tailored Travel
- [ ] Import Settings in uSync dashboard
- [ ] Verify: Media Types → Media Components folder with both compositions
- [ ] Verify: Image - Responsive media type exists
- [ ] Verify: Data Types → Image Cropper - Responsive with 5 crops
- [ ] Verify: Feature Component - Image has new `featurePropertyFeatureImage` property

### Step 3: Update views
- [ ] Copy `featureImage.cshtml` (blockgrid) from UmBootstrap
- [ ] Copy `featureImage.cshtml` (blocklist) from UmBootstrap

### Step 4: Test
- [ ] Restart site
- [ ] Upload an Image - Responsive in media library — verify crops show
- [ ] Pick it on an Image feature block — verify it renders
- [ ] Verify existing standard images still work
- [ ] Commit

## Crop sizes (base-16, 16:9 ratio)
| Crop | Width | Height |
|---|---|---|
| Content 3 Col | 384 | 216 |
| Content 6 Col | 768 | 432 |
| Content 9 Col | 1152 | 648 |
| Content 12 Col | 1536 | 864 |
| Social | 1200 | 630 |

## Notes
- DO NOT touch Tailored Travel's SCSS/CSS — out of scope
- Namespace in views is already generic (no project-specific namespace needed for featureImage)
- The `<picture>` partial for responsive rendering is a separate follow-up task
- Existing images on standard Image type will continue to work
