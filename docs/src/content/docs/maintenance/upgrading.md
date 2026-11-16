---
title: Upgrading Umbraco and Packages
description: The step-by-step runbook for upgrading UmBootstrap to a new Umbraco version and its packages to their latest releases.
---

This is the runbook for upgrading UmBootstrap. It was written from the 17.5.3 to 17.8.1 upgrade in November 2026, and adapted from Tailored Travel's runbook.

Follow it in order. Each phase is its own commit, so anything that breaks is easy to find and easy to revert.

When the upgrade is done, release it. See [Publishing & Releases](/UmBootstrap/maintenance/publishing/).

## Before you start

### Stay on the same major version

Every package now has two lines: one for Umbraco 17 and one for Umbraco 18. **Only take the line that matches the current Umbraco major version.**

Always pin exact versions. A bare `dotnet new install Umbraco.Templates` or an unpinned package update takes the newest line, which is the wrong major.

### Know the version number

The release version always matches the Umbraco version. Upgrading to Umbraco 17.8.1 means releasing UmBootstrap `17.8.1`.

## Phase 0: Prepare

1. **Branch.** Create `feature/umbraco-{version}-upgrade` from `develop`.
2. **Open an issue.** Reference it in every commit.
3. **Write a plan.** Copy the previous plan in `planning/` (for example `UMBRACO_17_8_UPGRADE.md`). List every package with its From and To versions.
4. **Read the release notes.** For every package, read every version between From and To. Note:
   - anything breaking
   - anything that runs on first boot (migrations, data fixes)
   - anything that changes a setting we rely on
5. **Stop the site.** It locks `bin/`.
6. **Back up the database.** Copy `Umbootstrap.Web/umbraco/Data/Umbraco.sqlite.db` with the site stopped. Use the `/db-backup` skill.
7. **Note the current state.** Content tree, media, block previews, front end. You need to know what "working" looked like.

## Phase 1: Umbraco CMS

The CMS goes first. Other packages often need a minimum CMS version.

1. Bump `Umbraco.Cms` in **both** csproj files:
   - `Umbootstrap.Web/Umbootstrap.Web.csproj` (the site)
   - `UmBootstrap.DotNet.Template.csproj` (the NuGet template)
2. Build in **Release** once: `dotnet build -c Release`. Both release workflows build Release, and some problems only show there.
3. Start the site. Log in to the backoffice and click **Upgrade**.
4. Check the log for upgrade errors.
5. **Restart once.** Some packages skip their own setup while Umbraco is in upgrade mode.
6. Smoke test: backoffice login, content tree, media, one block grid page.
7. Commit.

## Phase 2: Umbraco AI

The AI packages move **together**. `Umbraco.AI` pins its sub-packages to exact versions, so mismatched versions fail to restore.

1. Bump `Umbraco.AI`, `Umbraco.AI.Anthropic` and `Umbraco.AI.Prompt` in both csproj files.
2. Start the site. Watch the log for AI migrations.
3. Confirm the **AI** section loads in the backoffice.
4. Commit.

## Phase 3: Community packages

1. Bump BlockPreview, Contentment and UmbNav in both csproj files.
2. Start the site and check each one:
   - **BlockPreview:** feature blocks show previews. Layouts do not.
   - **Contentment:** the Navigation In Page picker lists the page's feature blocks. This uses our own `FeatureBlockDataSource`.
   - **UmbNav:** the menu renders on the front end and edits in the backoffice.
3. Commit.

## Phase 4: uSync

uSync goes **last**. It touches content, so test it on a CMS you already know works.

1. Bump `uSync` and `uSync.Complete` in both csproj files.
2. Start the site, then **restart once**.
3. Open the uSync dashboard and run a **Report**. Do not import.
4. Read the report. Any change listed is either:
   - **A real difference** between the database and the files. Investigate it.
   - **A change Umbraco made to a built-in type** during the upgrade. Export it.
5. Run a clean **Export**, then review `git diff` on `uSync/v17/`.
6. Commit the version bump. Commit any export changes **separately**, so format churn never hides a real change.

### Export built-in type changes, never import them

Umbraco upgrades sometimes change built-in types. In 17.8 it added Width and Height to the SVG media type.

The uSync files did not have them. If those files had been imported, the new properties would have been **removed**. And because new sites import on first boot, every new UmBootstrap site would have lost them too.

**After an upgrade, the database is right and the files are out of date. Export.**

## Phase 5: Verify

1. Crawl the whole site, desktop and mobile. Every layout, every feature block, every image.
2. Backoffice: content, media, block grid editing, block previews.
3. Final **Release** build with all packages. Aim for no warnings.
4. Merge to `develop` by PR.

## Things that have caught us out

### The template csproj is the NuGet dependency list

`UmBootstrap.DotNet.Template.csproj` lists the same packages as the site. They become the package dependencies shown on NuGet and the Umbraco Marketplace.

Keep the two csproj files identical. In July 2026 they had drifted: the template was missing the AI packages and uSync.Complete.

### The connection string lives in two places

The SQLite connection string in `appsettings.json` must match the `replaces` value in `Umbootstrap.Web/.template.config/template.json` **exactly**.

If they differ, `dotnet new` stops substituting the connection string, and new sites get ours.

Umbraco 17.8 removes `Cache=Shared` from SQLite connection strings at runtime. We removed it from both files.

### ImageSharp and the Six Labors licence

Umbraco 17.8 moved to ImageSharp 3.2.0, which checks for a Six Labors licence.

- A **direct** reference to ImageSharp 3.2.0 makes **Release** builds fail with "No Six Labors license found". Debug builds only warn, so it is easy to miss locally.
- Pinning the old 3.1.12 fails restore, because it is a downgrade.

The fix was to **remove the direct reference**. Umbraco brings ImageSharp in itself. Nothing in UmBootstrap uses it directly.

### The live demo site needs its own Upgrade click

Merging to `main` deploys the demo site. If the Umbraco version changed, umbootstrap.com shows "Website is Under Maintenance" until someone logs in to the live backoffice and clicks **Upgrade**.

Plan for it. Do it straight after the deploy finishes.

### Renaming a property loses its content

In March 2026 the Image feature's property was renamed from `image` to `featurePropertyFeatureImage`. The content still used the old alias, so 50 Image blocks on 38 pages rendered empty. Nobody noticed until this upgrade.

It was fixed with a script that renamed the alias in the uSync content files and restored the values from git history.

**After renaming any property, check the pages that use it.**

## Rollback

- **Code:** each phase is its own commit, so `git revert` is clean.
- **Database:** migrations only go one way. Restore the Phase 0 backup.

## History

| Date | From | To | Plan |
|------|------|----|------|
| July 2026 | 17.2.2 | 17.5.3 | `planning/UMBRACO_17_LTS_UPGRADE.md` (merged but never released) |
| November 2026 | 17.5.3 | 17.8.1 | `planning/UMBRACO_17_8_UPGRADE.md` |
