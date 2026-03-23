# UmBootstrap

## Project Overview

UmBootstrap is an Umbraco 17 starter kit distributed as a .NET template via NuGet.

- **Umbraco** (check csproj for current version)
- **BlockPreview** for block grid previews
- **ModelsBuilder**: SourceCodeAuto mode
- **uSync** for content/config synchronisation
- **Contentment** for custom data sources
- **UmbNav** for navigation
- **Frontend**: Bootstrap + SCSS

## Project Structure

```
UmBootstrap/
├── Umbootstrap.slnx              # Solution file
├── Umbootstrap.Web/              # Main Umbraco website
│   ├── Views/                    # Razor views
│   │   ├── Partials/blockgrid/   # Block grid components
│   │   └── Partials/blocklist/   # Block list components
│   ├── umbraco/Models/           # Generated ModelsBuilder classes
│   ├── uSync/v17/                # uSync configuration files
│   └── appsettings.json          # App configuration inc. BlockPreview
├── planning/                     # Architectural decisions and design docs
├── docs/                         # Astro Starlight documentation (GitHub Pages)
└── .github/workflows/            # CI/CD workflows
```

## Planning Files

When actively working on a feature or architectural change, add the relevant planning file here for session startup:

<!-- Add active planning files here, e.g.:
- `planning/FEATURE_NAME.md` - Description of current work
-->

- `planning/SCSS_COLOUR_REFACTOR.md` - SCSS colour system refactoring and Bootstrap workflow fixes

## Build Instructions

```bash
# Build solution
dotnet build Umbootstrap.slnx

# Run website
dotnet run --project Umbootstrap.Web/Umbootstrap.Web.csproj

# Preview documentation locally
cd docs && npm run dev
```

## Element Type Naming Convention

| Type | Pattern | Examples |
|------|---------|----------|
| Layouts | `layout{columns}` | `layout12`, `layout48`, `layout66`, `layout84` |
| Features | `feature{Name}` | `featureRichTextEditor`, `featureImage`, `featureFaqs` |

- **Layouts**: Container elements with areas (don't need block previews)
- **Features**: Content blocks (need block previews)

## BlockPreview Configuration

BlockPreview is configured **programmatically** in `Program.cs` using reflection to auto-discover layout types. Any element type whose `ModelTypeAlias` starts with `"layout"` is automatically added to `IgnoredContentTypes`. This means new feature types get previews automatically, and new layout types are excluded automatically.

No `appsettings.json` configuration is needed for BlockPreview.

## Architecture Documentation

**IMPORTANT**: Before asking the user how something works, read the project documentation first. The `docs/src/content/docs/` folder contains detailed architecture docs:

- `block-grid/layouts.md` — How layouts work, area configuration, responsive breakpoints, rendering pipeline
- `block-grid/features.md` — How features work, composition pattern, shared layout, creating new features
- `packages/block-preview.md` — BlockPreview configuration

**Key fact**: Block grid area responsive breakpoints (`g-col-*` classes) are configured in the **Umbraco backoffice UI** on the Block Grid DataType — not in code, CSS, or SCSS. Do not search the codebase for these classes.

## Documentation Site

- **Framework**: Astro Starlight
- **Source**: `docs/` folder
- **Config**: `docs/astro.config.mjs`
- **Deployed to**: https://umtemplates.github.io/UmBootstrap/
- **Deployment**: Automatic on push to `main` when `docs/**` changes (GitHub Actions artifact-based)
