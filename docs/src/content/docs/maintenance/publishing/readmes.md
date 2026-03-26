---
title: READMEs
---

UmBootstrap maintains three separate README files, each tailored for its platform and audience.

## Overview

| File | Platform | Purpose | Update Frequency |
|------|----------|---------|------------------|
| `README.md` | GitHub | Full install guide, contributor info, docs link | When install process or features change |
| `assets/README_nuget.md` | NuGet | Short summary with links to GitHub and docs | Rarely — just a pointer to full docs |
| `umbraco-marketplace-readme.md` | Marketplace | Same as GitHub but with marketplace-specific warnings | In sync with `README.md` |

## When to Update Each

### README.md (GitHub)

This is the primary README. Update it when:
- The installation process changes
- New features are added that users should know about
- Contributor guidelines change
- Links to docs or external resources change

### assets/README_nuget.md (NuGet)

This is deliberately short — it points users to the GitHub README and documentation site. It rarely needs updating unless:
- The GitHub repo URL changes
- The documentation site URL changes
- The project description fundamentally changes

See [NuGet Packaging](/UmBootstrap/publishing/nuget/) for how this file is referenced in the template csproj.

### umbraco-marketplace-readme.md (Marketplace)

Keep this in sync with the GitHub README, but it must include an additional warning:

> The marketplace install buttons don't support `dotnet new` template packages — users must follow the CLI or Visual Studio instructions.

See [Umbraco Marketplace](/UmBootstrap/publishing/marketplace/) for marketplace-specific requirements.

## Image Assets

The `assets/` folder contains files used by NuGet and the marketplace:

| File | Used By | Purpose |
|------|---------|---------|
| `icon_nuget_umbootstrap.png` | NuGet + Marketplace | Package icon |
| `README_nuget.md` | NuGet | Short package description |
| `installation-vs-01.png` to `04.png` | GitHub + Marketplace READMEs | Visual Studio installation screenshots |

### Image URL Convention

Images are referenced via raw GitHub URLs from the `develop` branch:

```
https://raw.githubusercontent.com/UmTemplates/UmBootstrap/develop/assets/filename.png
```

:::caution
Renaming, moving, or deleting files in `assets/` on `develop` will break these references on the marketplace and in READMEs until the URLs are updated.
:::
