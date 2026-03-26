---
title: NuGet Packaging
---

UmBootstrap is a **dotnet project template**, not a traditional NuGet library package. This means it uses a different packaging model — the entire project is packed as template content that gets scaffolded when a user runs `dotnet new`.

## Template Configuration

The packaging is configured in `UmBootstrap.DotNet.Template.csproj`:

- **PackageType**: `Template`
- **PackageId**: `Umbraco.Community.Templates.UmBootstrap`
- **Version**: Set dynamically from the git tag (not hardcoded in the csproj)
- **Template content**: Everything in `Umbootstrap.Web/` is packed as template content
- **Template config**: `Umbootstrap.Web/.template.config/template.json` defines the template metadata

## Template Parameters

The template supports these parameters via `template.json`:

| Parameter | Purpose | Default |
|-----------|---------|---------|
| `ConnectionString` | Database connection string | *(empty — prompts Umbraco installer)* |
| `ConnectionStringProviderName` | Database provider | `Microsoft.Data.SqlClient` |

Ports are auto-generated to avoid conflicts.

## Template Exclusions

The `template.json` file excludes certain files that are part of the UmBootstrap development project but should not ship to end users:

```json
"exclude": [
    "umbraco/Logs/**",
    "umbraco/Data/**",
    "umbraco/Licenses/**",
    "appsettings.Production.json",
    "uSync/v17/usync.once"
]
```

- **`appsettings.Production.json`** — Contains uSync settings for the demo site deployment (see [Demo Site Deployment](/UmBootstrap/publishing/demo-site/))
- **`uSync/v17/usync.once`** — Triggers uSync import on the demo site (not needed by end users)

## Install Commands

```bash
dotnet new install Umbraco.Community.Templates.UmBootstrap
dotnet new umbootstrap -n MyWebsiteName
```

## What End Users Get

When a user scaffolds a new project, they receive:

- A complete Umbraco website with all document types, data types, templates, and content
- `appsettings.json` with `ImportOnFirstBoot: true` — uSync imports all content on first boot, then never again
- uSync remains installed as a package for the user's own sync/migration needs

## NuGet README

The NuGet package uses `assets/README_nuget.md` as its package description. This is a short summary with links to the full GitHub README and documentation site. It rarely needs updating.

See [READMEs](/UmBootstrap/publishing/readmes/) for details on how the three READMEs are managed.

## Useful Links

- [NuGet Package Page](https://www.nuget.org/packages/Umbraco.Community.Templates.UmBootstrap)
- [NuGet Template Documentation](https://learn.microsoft.com/en-us/nuget/create-packages/creating-a-package-template)
- [dotnet new Template Documentation](https://learn.microsoft.com/en-us/dotnet/core/tools/custom-templates)
