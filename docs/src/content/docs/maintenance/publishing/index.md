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

A release is a **GitHub Release**. Creating it creates the tag. The tag publishes to NuGet.

Claude Code can do every step below with the `gh` command line. There is no need to open the GitHub website.

### 1. Develop on `develop`

All work happens on feature branches. Merge PRs to `develop` when ready.

### 2. Merge `develop` into `main`, by PR

Open a PR from `develop` to `main` and merge it.

This runs **RELEASE.yml**, which builds the site and deploys the demo site to UmbHost.

**If the Umbraco version changed**, the demo site shows "Website is Under Maintenance" until someone logs in to the live backoffice and clicks **Upgrade**. Restart the server if it struggles afterwards.

Check the demo site loads before going further.

### 3. Create the GitHub Release

| Field | Value | Example |
|-------|-------|---------|
| Tag | The version, **no `v`** | `17.8.1` |
| Title | The version, **with a `v`** | `v17.8.1` |
| Target | `main` | |
| Notes | What's New, Fixes, Package Updates, Under the Hood | |
| Latest | Yes | |

End the notes with a Full Changelog link:

```
**Full Changelog**: https://github.com/UmTemplates/UmBootstrap/compare/17.2.2...17.8.1
```

From the command line:

```bash
gh release create 17.8.1 --target main --title "v17.8.1" --latest --notes-file release-notes.md
```

Or on the website: **Releases**, then **Draft a new release**, with the same values.

### 4. Watch the NuGet publish

The new tag runs **RELEASE_NUGET.yml**. It builds, packs, and pushes to NuGet.

```bash
gh run list --workflow RELEASE_NUGET.yml --limit 1
gh run watch <run id> --exit-status
```

Look for `Your package was pushed.` in the log.

NuGet then shows the version as **Validating** for 10 to 15 minutes, then **Listed**.

### 5. Check the published template

Once it is Listed, install it and scaffold a test site in a temporary folder:

```bash
dotnet new install Umbraco.Community.Templates.UmBootstrap@17.8.1
dotnet new umbootstrap -n UmBootstrapReleaseTest
```

Start it and confirm uSync imports the content on first boot.

### 6. Marketplace syncs automatically

The Umbraco Marketplace checks for updates on these intervals:

- **New packages**: every 24 hours (0400 UTC)
- **Package info refresh**: every 2 hours
- **Download counts**: every hour

No manual step is needed. You can force a sync with the [marketplace validation tool](https://marketplace.umbraco.com/validate).

## Versioning

The **tag** is the version. There is no version number in the csproj. The workflow passes the tag to `dotnet build` and `dotnet pack`.

The first three numbers always match the Umbraco version the release targets.

| Kind | Format | Example |
|------|--------|---------|
| Normal release | Umbraco version | `17.8.1` |
| Emergency fix, same Umbraco version | Add a fourth number, starting at 1 | `17.8.1.1` |
| Prerelease | Add a suffix | `17.8.1-rc1` |

Start the fourth number at **1**, never 0. NuGet treats `17.8.1.0` as `17.8.1`.

A NuGet version can never be reused or deleted, only unlisted. If a release goes wrong after NuGet has accepted it, fix it and publish the next fourth number.

## If the publish fails

**Nothing on NuGet yet?** The version number is still free. Fix the problem, then move the tag to the fixed commit. The release and its notes stay as they are:

```bash
git push origin :refs/tags/17.8.1
gh api -X PATCH repos/UmTemplates/UmBootstrap/releases/<release id> \
  -f tag_name=17.8.1 -f target_commitish=<new main commit> -F draft=false
```

Deleting the tag turns the release into a draft. The `PATCH` recreates the tag on the new commit and publishes the release again, which starts the NuGet publish again.

Get the release id with `gh api repos/UmTemplates/UmBootstrap/releases/tags/17.8.1 --jq .id` **before** deleting the tag.

**Already on NuGet?** Do not move the tag. Publish a fourth-number release instead.
