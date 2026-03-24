# Responsive Image Media Type

## Context
UmBootstrap needs a custom media type with named crops that match Bootstrap's column grid. This enables responsive `<picture>` elements with `srcset` and WebP support across all projects. Currently images are rendered at fixed sizes with no responsive delivery.

## Custom Media Type: "Responsive Image"

### Properties
- **Image file** — Umbraco Image Cropper with named crops (see below)
- **Alt text** — accessibility description of what's visually in the image
- **Title** — display name / caption
- **Description** — content description for display on pages (different from alt text)

### Named Crops
Matched to Bootstrap's 12-column CSS Grid within `container-xxl` (max-width: 1320px at xxl):

| Crop Name | Intended Use | Width | Notes |
|-----------|-------------|-------|-------|
| `3-col` | Quarter width (sidebar, card thumb) | TBD | ~330px at xxl container |
| `6-col` | Half width (two-column layout) | TBD | ~660px at xxl container |
| `9-col` | Three-quarter width | TBD | ~990px at xxl container |
| `12-col` | Full container width | TBD | ~1320px at xxl container |

**Open question:** Do we need crops with fixed aspect ratios, or just widths? Cards might want 3:2, banners might want 21:9, general content might be free-form.

### Container widths reference (Bootstrap 5 `container-xxl`)
- Below 1400px: fluid (100% minus padding)
- At 1400px+: max-width 1320px
- Grid gap: 1.5rem (24px) by default

### Column pixel widths at max container (1320px, 12 cols, 24px gap)
- 3 cols: ~308px
- 6 cols: ~642px
- 9 cols: ~976px
- 12 cols: ~1320px

These are approximate — actual values depend on grid gap and padding. Need to verify by inspecting the rendered grid.

## Rendering: `<picture>` Partial

A reusable partial view that takes an image and outputs responsive markup:

```html
<picture>
    <source srcset="
        @crop12col&format=webp 1320w,
        @crop9col&format=webp 976w,
        @crop6col&format=webp 642w,
        @crop3col&format=webp 308w"
        sizes="(max-width: 400px) 308px, (max-width: 800px) 642px, (max-width: 1200px) 976px, 1320px"
        type="image/webp" />
    <img src="@crop12col"
        srcset="
            @crop12col 1320w,
            @crop9col 976w,
            @crop6col 642w,
            @crop3col 308w"
        sizes="(max-width: 400px) 308px, (max-width: 800px) 642px, (max-width: 1200px) 976px, 1320px"
        alt="@altText"
        width="1320" height="TBD"
        loading="lazy" />
</picture>
```

## Alt Text vs Title vs Description
- **Alt text**: "Red and white striped arches inside a grand mosque with columns stretching into the distance" — what you *see*
- **Title**: "The Mezquita" — the name
- **Description**: "The Mezquita-Catedral of Córdoba, originally built as a mosque in 784 AD, is one of the finest examples of Moorish architecture in Spain" — what it *is*

## Implementation Steps
- [ ] Verify actual pixel widths by inspecting the rendered Bootstrap grid
- [ ] Create the Image Cropper data type with named crops
- [ ] Create the "Responsive Image" media type with all properties
- [ ] Create reusable `<picture>` partial view
- [ ] Update `featureImage.cshtml` to use the new partial
- [ ] Test with real images at different viewport sizes
- [ ] Document in UmBootstrap docs site

## Architecture: Compositions (not flat properties)

Use the same composition pattern as document types. Media types support compositions in Umbraco 17.

### Compositions
- **Media Metadata** — alt text, description, credit, copyright (reusable across Image, Video, PDF)
- **Media Tagging** — country, region, tags (reusable across all media types)

### Media Type: "Responsive Image"
- Composes: Media Metadata + Media Tagging
- Own properties: Image Cropper (with named crops), Width (auto), Height (auto)
- Organised in **tabs**, not flat property lists

### Reference: Designing Libraries (Umbraco 10)
Existing implementation with flat properties (no compositions, no tabs):
- `wImgAltText` — Alt Text (wTextarea 3 rows)
- `wImgDescription` — Description (wTextarea 3 rows)
- `wImgCredit` — Credit (Textstring)
- `wImgCopyright` — Copyright (Textstring)
- `umbracoFile` — Image (Image Cropper, mandatory)
- `umbracoWidth` — Width (Label integer, auto)
- `umbracoHeight` — Height (Label integer, auto)

**Problems with this approach**: no tabs, no compositions, not reusable, properties dumped in flat list. We will improve on this.

## Reference: Sprott Banner Implementation
Uses the full `<picture>` pattern with named crops.

### Banner-specific crops (wider aspect ratio ~2.67:1)
- `banner-3-cols` — 370w
- `banner-6-cols` — 770w
- `banner-9-cols` — 1170w
- `banner-12-cols` — 1570w (1570×589)

### Key patterns
- **`<picture>`** with `<source type="image/webp">` + `<img>` fallback
- **`&format=webp`** appended to crop URLs for WebP conversion via Umbraco's image processor
- **`GetAltText()`** extension method reads alt text from the media item
- **`GetCropUrl(namedCrop)`** for named crops, `GetCropUrl(width:, height:)` for ad-hoc sizes
- **Mobile image support**: separate `ImageSmall` property for a completely different image on mobile
- **Fallback chain**: custom banners → blog parent → page bg image → legacy → site default
- **Explicit `width` and `height`** on `<img>` (1570×589) to prevent layout shift

### Two crop sets needed
1. **Content crops** (16:9 aspect ratio) — for images within content areas
   - Content-3-col: 380 × 214
   - Content-6-col: 776 × 437
   - Content-9-col: 1172 × 659
   - Content-12-col: 1568 × 882
   - Social: 1200 × 630

2. **Banner crops** (wider aspect ratio) — for hero banners/headers
   - Banner-3-col: ~370 × TBD
   - Banner-6-col: ~770 × TBD
   - Banner-9-col: ~1170 × TBD
   - Banner-12-col: ~1570 × 589

### Rendering approach
- `<figure>` wrapper when caption is needed
- `<picture>` with `<source>` for WebP format
- `<img>` fallback with srcset for original format
- `<figcaption>` for caption/credit when available
- `loading="lazy"` for below-the-fold images

## Future Considerations
- Aspect ratio crops (banner 21:9, card 3:2, square 1:1)
- Country/Region tags on media (see Tailored Travel MEDIA_ARCHITECTURE.md)
- Tag management package
- Image carousel feature (new feature type)
