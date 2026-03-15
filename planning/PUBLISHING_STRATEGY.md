# Publishing Strategy

**STATUS**: ACTIVE

## Overview

UmBootstrap is published to three platforms: GitHub (source), NuGet (installable template), and Umbraco Marketplace (discovery). This document captures the publishing strategy, maintenance decisions, and how the three platforms interrelate.

## Three README Strategy

We maintain three separate READMEs, each tailored for its platform:

1. **`README.md`** (repo root) — GitHub landing page. Full install guide (CLI + Visual Studio), contributor info, link to Starlight docs site. This is what GitHub renders on the repository page.

2. **`assets/README_nuget.md`** — NuGet.org package page. Intentionally short — just a summary and links to GitHub/docs. Referenced by `PackageReadmeFile` in the csproj.

3. **`umbraco-marketplace-readme.md`** (repo root) — Umbraco Marketplace package page. Nearly identical to the GitHub README but includes a warning banner about marketplace install buttons not supporting `dotnet new` templates.

### Maintenance

When install instructions or features change:
- Update `README.md` first
- Sync changes to `umbraco-marketplace-readme.md` (keep the marketplace-specific warning banner)
- `assets/README_nuget.md` rarely needs updating — only if the summary or links change

## Marketplace JSON Maintenance

`umbraco-marketplace.json` fields to update per major Umbraco version release:

- **`VersionSpecificPackageIds`** — Add new entry with the Umbraco major version number
- **`Description`** — Update if the project description changes
- **`Screenshots`** — Add/update screenshots for new features

The marketplace auto-syncs from NuGet and GitHub. No manual publish step is needed.

## Asset Management

All assets in `assets/` are referenced via raw GitHub URLs from the `develop` branch. This means:

- Assets must exist on `develop` before they're visible to NuGet/marketplace
- Renaming or moving assets breaks external references until URLs are updated
- The icon (`icon_nuget_umbootstrap.png`) is referenced by both the csproj and marketplace JSON

## Release Workflow

1. Develop on feature branches, merge PRs to `develop`
2. When ready to release, merge `develop` → `main`
3. Push to `main` triggers: demo site deploy (UmbHost) + docs deploy (GitHub Pages, if docs changed)
4. Create semver tag on `main` (e.g. `git tag 17.2.0 && git push origin 17.2.0`)
5. Tag triggers NuGet publish workflow
6. Marketplace auto-syncs within 2-24 hours

## Versioning

- Git tag = package version (no version in csproj)
- **UmBootstrap version aligns exactly with the Umbraco CMS version it targets** (e.g. UmBootstrap 17.2.2 targets Umbraco 17.2.2)
- This is critical because UmBootstrap is a starter kit — all dependent packages (BlockPreview, uSync, Contentment, UmbNav) must be compatible with the specific Umbraco version, and the version number communicates this immediately to users
- When Umbraco releases a new version and UmBootstrap upgrades to it, the UmBootstrap version number matches
- Pre-release tags supported (e.g. `17.2.0-beta`)

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-10 | Remove v13 from VersionSpecificPackageIds | No longer publishing v13 releases |
| 2026-03-10 | Remove Wholething RelatedPackages | Not v17 compatible |
| 2026-03-10 | Point DocumentationUrl to Starlight docs | Proper docs site exists at umtemplates.github.io |
| 2026-03-10 | Change PackageReadmeFile to README_nuget.md | NuGet should show the short readme, not the full GitHub one |
| 2026-03-10 | Maintain three separate READMEs | Each platform has different needs; Claude can keep them in sync |
| 2026-03-15 | Align UmBootstrap version with Umbraco CMS version | Starter kit must track Umbraco version exactly — dependent packages have version-specific compatibility, and users need to know at a glance which Umbraco version the kit targets |
