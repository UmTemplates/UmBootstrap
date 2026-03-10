---
title: Publishing & Releases
---

UmBootstrap is distributed across three platforms. This page documents the release process, how each platform is maintained, and the strategy for keeping everything in sync.

## Distribution Channels

| Platform | Purpose | URL |
|----------|---------|-----|
| **GitHub** | Source code, issues, contributor workflow | [github.com/UmTemplates/UmBootstrap](https://github.com/UmTemplates/UmBootstrap) |
| **NuGet** | Installable `dotnet new` template package | [nuget.org/packages/Umbraco.Community.Templates.UmBootstrap](https://www.nuget.org/packages/Umbraco.Community.Templates.UmBootstrap) |
| **Umbraco Marketplace** | Discovery and listing for Umbraco users | [marketplace.umbraco.com](https://marketplace.umbraco.com/package/umbraco.community.templates.umbootstrap) |

## Release Process

Follow these steps for each release:

### 1. Develop on `develop` branch

All feature work happens on `develop` via feature branches. Merge PRs to `develop` when ready.

### 2. Merge `develop` into `main`

This triggers two automated workflows:
- **RELEASE.yml** — Builds and deploys the demo site to UmbHost
- **docs.yml** — Deploys documentation to GitHub Pages (only if `docs/**` files changed)

### 3. Create a semver tag on `main`

```bash
git tag 17.2.0
git push origin 17.2.0
```

This triggers **RELEASE_NUGET.yml** which:
1. Builds the template package with the tag as the version
2. Packs the NuGet package
3. Pushes to NuGet.org

**Pre-release versions** are also supported (e.g. `17.2.0-beta`).

### 4. Marketplace syncs automatically

The Umbraco Marketplace checks for updates on these intervals:
- **New packages**: Every 24 hours (0400 UTC)
- **Package info refresh**: Every 2 hours
- **Download counts**: Every 1 hour

No manual step is needed. You can force a sync via the [marketplace validation tool](https://marketplace.umbraco.com/validate).

## GitHub Actions Workflows

| Workflow | Trigger | Purpose | Key Secrets |
|----------|---------|---------|-------------|
| `RELEASE.yml` | Push to `main` | Deploy demo site to UmbHost | `SOLUTION_NAME`, `WEBSITE_NAME`, `SERVER_COMPUTER_NAME`, `USERNAME`, `PASSWORD` |
| `RELEASE_NUGET.yml` | Semver tag push | Publish template to NuGet | `NUGET_API_KEY` |
| `docs.yml` | Push to `main` (when `docs/**` changes) | Deploy docs to GitHub Pages | Pages permissions (configured in workflow) |

All workflows can also be triggered manually via `workflow_dispatch`.

## Three READMEs

Each platform has its own README, tailored for its audience:

| File | Platform | Purpose | Update frequency |
|------|----------|---------|------------------|
| `README.md` | GitHub | Full install guide, contributor info, docs link | When install process or features change |
| `assets/README_nuget.md` | NuGet | Short summary with links to GitHub and docs | Rarely — just a pointer to full docs |
| `umbraco-marketplace-readme.md` | Marketplace | Same as GitHub but with marketplace-specific warnings | In sync with `README.md` |

The marketplace README includes a warning that the marketplace install buttons don't support `dotnet new` template packages — users must follow the CLI/Visual Studio instructions instead.

## NuGet Packaging

UmBootstrap is a **dotnet project template**, not a traditional NuGet library package. The packaging is configured in `UmBootstrap.DotNet.Template.csproj`:

- **PackageType**: `Template`
- **PackageId**: `Umbraco.Community.Templates.UmBootstrap`
- **Version**: Set dynamically from the git tag (not hardcoded in the csproj)
- **Template content**: Everything in `Umbootstrap.Web/` is packed as template content
- **Template config**: `Umbootstrap.Web/.template.config/template.json` defines the template metadata

### Template parameters

The template supports these parameters via `template.json`:

| Parameter | Purpose | Default |
|-----------|---------|---------|
| `ConnectionString` | Database connection string | *(empty — prompts Umbraco installer)* |
| `ConnectionStringProviderName` | Database provider | `Microsoft.Data.SqlClient` |

Ports are auto-generated to avoid conflicts.

### Install command

```bash
dotnet new install Umbraco.Community.Templates.UmBootstrap
dotnet new umbootstrap -n MyWebsiteName
```

## Umbraco Marketplace

The marketplace listing is controlled by two files in the repo root:

### `umbraco-marketplace.json`

Controls the listing metadata. Key fields to maintain:

| Field | Purpose | Notes |
|-------|---------|-------|
| `Title` | Display name on marketplace | Currently "UmBootstrap" |
| `VersionSpecificPackageIds` | Maps Umbraco versions to package IDs | Add a new entry for each major Umbraco version |
| `AuthorDetails` | Author info and contributors | `SyncContributorsFromRepository` auto-pulls from GitHub |
| `Screenshots` | Listing images | URLs to images (use raw GitHub URLs) |
| `DocumentationUrl` | Link to docs site | Points to the Starlight docs |
| `IssueTrackerUrl` | Link to issue tracker | Points to GitHub Issues |

### `umbraco-marketplace-readme.md`

Rendered as the package description on the marketplace. The marketplace checks for this file in the repo root — if not found, it falls back to the NuGet package README.

### Validation

Use the [marketplace validation tool](https://marketplace.umbraco.com/validate) to check your `umbraco-marketplace.json` before publishing.

## Assets

The `assets/` folder contains files used by NuGet and the marketplace:

| File | Used by | Purpose |
|------|---------|---------|
| `icon_nuget_umbootstrap.png` | NuGet + Marketplace | Package icon |
| `README_nuget.md` | NuGet | Short package description |
| `installation-vs-01.png` to `04.png` | GitHub + Marketplace READMEs | Visual Studio installation screenshots |

**Important**: Images are referenced via raw GitHub URLs from the `develop` branch:
```
https://raw.githubusercontent.com/UmTemplates/UmBootstrap/develop/assets/filename.png
```

Renaming, moving, or deleting files in `assets/` on `develop` will break these references on the marketplace and in READMEs until the URLs are updated.

## Versioning

- The **git tag** is the single source of truth for the package version
- There is no version number in the csproj — the workflow passes `${{github.ref_name}}` to `dotnet build` and `dotnet pack`
- Tag format: `MAJOR.MINOR.PATCH` (e.g. `17.2.0`) or `MAJOR.MINOR.PATCH-prerelease` (e.g. `17.2.0-beta`)
- By convention, the major version aligns with the Umbraco major version
