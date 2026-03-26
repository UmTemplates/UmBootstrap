---
title: Publishing & Releases
---

UmBootstrap is distributed across three platforms. This section documents the release process, how each platform is maintained, and the strategy for keeping everything in sync.

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

## Versioning

- The **git tag** is the single source of truth for the package version
- There is no version number in the csproj — the workflow passes `${{github.ref_name}}` to `dotnet build` and `dotnet pack`
- Tag format: `MAJOR.MINOR.PATCH` (e.g. `17.2.0`) or `MAJOR.MINOR.PATCH-prerelease` (e.g. `17.2.0-beta`)
- By convention, the major version aligns with the Umbraco major version
