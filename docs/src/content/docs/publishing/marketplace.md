---
title: Umbraco Marketplace
---

The [Umbraco Marketplace](https://marketplace.umbraco.com/package/umbraco.community.templates.umbootstrap) is where Umbraco users discover packages. The listing is controlled by two files in the repo root.

## umbraco-marketplace.json

Controls the listing metadata. Key fields to maintain:

| Field | Purpose | Notes |
|-------|---------|-------|
| `Title` | Display name on marketplace | Currently "UmBootstrap" |
| `VersionSpecificPackageIds` | Maps Umbraco versions to package IDs | Add a new entry for each major Umbraco version |
| `AuthorDetails` | Author info and contributors | `SyncContributorsFromRepository` auto-pulls from GitHub |
| `Screenshots` | Listing images | URLs to images (use raw GitHub URLs) |
| `DocumentationUrl` | Link to docs site | Points to the Starlight docs |
| `IssueTrackerUrl` | Link to issue tracker | Points to GitHub Issues |

## umbraco-marketplace-readme.md

Rendered as the package description on the marketplace. The marketplace checks for this file in the repo root — if not found, it falls back to the NuGet package README.

### Marketplace README Requirements

The marketplace README has specific constraints:

- It must include a warning that the **marketplace install buttons don't support `dotnet new` template packages** — users must follow the CLI or Visual Studio instructions instead
- Keep it in sync with `README.md` (the GitHub version), adding marketplace-specific warnings where needed
- Images must use absolute URLs (raw GitHub URLs from the `develop` branch)

See [READMEs](/UmBootstrap/publishing/readmes/) for the full picture of how the three READMEs are managed.

## Sync Intervals

The marketplace checks for updates automatically:

| Check | Interval |
|-------|----------|
| New packages | Every 24 hours (0400 UTC) |
| Package info refresh | Every 2 hours |
| Download counts | Every 1 hour |

No manual step is needed after publishing to NuGet.

## Validation

Use the [marketplace validation tool](https://marketplace.umbraco.com/validate) to:
- Check your `umbraco-marketplace.json` is valid before publishing
- Force a sync if you don't want to wait for the automatic interval

## Useful Links

- [UmBootstrap Marketplace Listing](https://marketplace.umbraco.com/package/umbraco.community.templates.umbootstrap)
- [Marketplace Validation Tool](https://marketplace.umbraco.com/validate)
- [Marketplace Documentation](https://docs.umbraco.com/umbraco-dxp/marketplace/listing-your-package)
