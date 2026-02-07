# UmBootstrap

## Project Overview

UmBootstrap is an Umbraco 17 starter kit distributed as a .NET template via NuGet.

- **Umbraco**: v17.1.0
- **BlockPreview**: v5.2.1 for block grid previews
- **ModelsBuilder**: SourceCodeAuto mode
- **uSync**: v17.0.2 for content/config synchronisation
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
├── docs/                         # MkDocs documentation (GitHub Pages)
└── .github/workflows/            # CI/CD workflows
```

## Umbraco Skills Marketplace

This project has access to 57 Umbraco backoffice extension skills and 8 testing skills via Claude Code. Use `/umbraco-backoffice` to see available skills for backoffice customisation.

## Planning Files

When actively working on a feature or architectural change, add the relevant planning file here for session startup:

<!-- Add active planning files here, e.g.:
- `planning/FEATURE_NAME.md` - Description of current work
-->

*No active planning files.*

## Git Branching Strategy

- **develop**: Main development branch
- **main**: Release branch (triggers deployments)
- Feature branches from `develop`
- PRs to `develop`, merge to `main` for release

## Build Instructions

```bash
# Build solution
dotnet build Umbootstrap.slnx

# Run website
dotnet run --project Umbootstrap.Web/Umbootstrap.Web.csproj

# Preview documentation locally
mkdocs serve
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

## Documentation

- **Source**: `docs/` folder
- **Config**: `mkdocs.yml`
- **Deployed to**: https://umtemplates.github.io/UmBootstrap/
- **Deployment**: Automatic on push to `main` when `docs/` or `mkdocs.yml` changes

## References

- Umbraco Docs: https://docs.umbraco.com/
- BlockPreview: https://github.com/rickbutterfield/Umbraco.Community.BlockPreview
- uSync: https://docs.jumoo.co.uk/usync/
- Bootstrap: https://getbootstrap.com/docs/
- UUI Storybook: https://uui.umbraco.com/
