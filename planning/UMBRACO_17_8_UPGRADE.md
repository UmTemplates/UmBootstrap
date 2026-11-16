# Umbraco 17.8 Upgrade and Release

Bring UmBootstrap from Umbraco 17.5.3 to 17.8.1, move every package to its latest
17-line release, and publish it to NuGet.

Started 2026-11-16. Issue #335. Branch `feature/umbraco-17-8-upgrade`.

This is also the first upgrade to be written up as a reusable runbook. The
running order is adapted from Tailored Travel's `deployment/upgrading-umbraco.md`,
which was proven on its 17.7.0 and 17.8.0 upgrades.

## Why now

The July upgrade to 17.5.3 was merged to `main` but never tagged. NuGet still
serves **17.2.2**. Users installing the template today get a version four
minors behind.

## Target versions

All on the Umbraco 17 line. Every package also has an 18 line; do not take it.

| Package | From | To |
|---|---|---|
| Umbraco.Cms | 17.5.3 | **17.8.1** |
| Umbraco.AI | 17.1.1 | **17.8.0** |
| Umbraco.AI.Anthropic | 17.0.0 | **17.1.5** |
| Umbraco.AI.Prompt | 17.1.0 | **17.4.1** |
| Umbraco.Community.BlockPreview | 5.5.0 | **5.7.0** |
| Umbraco.Community.Contentment | 6.2.1 | **6.3.5** |
| Umbraco.Community.UmbNav | 4.1.8 | **4.1.10** |
| uSync | 17.3.6 | **17.6.2** |
| uSync.Complete | 17.3.11 | **17.7.2** |
| SixLabors.ImageSharp | 3.1.12 | **3.2.0** |

**ImageSharp must move.** Umbraco 17.8.1 depends on ImageSharp 3.2.0, so the
3.1.12 pin would fail restore as a downgrade. 3.2.0 also clears the open
high-severity Dependabot alerts. 4.x is still avoided (major version).

## Ordering constraints

- **CMS first.** Umbraco.AI.Core 17.8.0 requires `Umbraco.Cms.Core >= 17.5.0`.
- **The three AI packages move together.** Umbraco.AI 17.8.0 pins its
  sub-packages exactly, and Anthropic 17.1.5 requires AI.Core >= 17.8.0.
- **uSync last.** It touches content, so test it on a known-good CMS.

## Open questions

- [x] **Release tag number.** Always matches the Umbraco version: `17.8.1`.
- [x] **Template csproj package list.** Drift. It lists CMS, BlockPreview,
  Contentment, UmbNav, uSync and ImageSharp, but not the AI packages or
  uSync.Complete. It does not affect what users get (they get the Web csproj
  as template content), so bring it in line with the Web csproj in Phase 1.
- [x] **Stashed uSync content.** Led to a wider find: 50 Image blocks on 38
  pages rendered empty after the March property rename. Fixed first, in #332 /
  PR #334, merged to `develop`. That PR also re-exported content in the uSync
  17.3.6 format, which the July upgrade skipped. A uSync report is now clean,
  so any change after this upgrade is a real change.

---

## Phase 0: Before starting

- [x] Branch `feature/umbraco-17-8-upgrade` from `develop` (recreated after PR #334)
- [x] Open a GitHub issue and reference it in commits (#335)
- [ ] Read release notes for every version between From and To, for each package.
  Note breaking changes and anything that runs on first boot
- [ ] Stop the site (it locks `bin/`)
- [ ] Back up `Umbootstrap.Web/umbraco/Data/Umbraco.sqlite.db` with `/db-backup`.
  Folder: `Umbraco - Documents/UmBootstrap/2026/Backup SQL Databases`.
  A backup was taken earlier today, but the #332 import changed the database
  since, so take a fresh one
- [ ] Note current state: content tree, media, block previews, front end

## Phase 1: Umbraco CMS

- [ ] Bump `Umbraco.Cms` and `SixLabors.ImageSharp` in `Umbootstrap.Web.csproj`
- [ ] Bring `UmBootstrap.DotNet.Template.csproj` in line with the Web csproj
  (same packages, same versions)
- [ ] Dean: build and start, click **Upgrade** in the backoffice
- [ ] Check the log for upgrade errors
- [ ] Dean: restart once
- [ ] Smoke test: backoffice login, content tree, media, one block grid page
- [ ] Commit

## Phase 2: Umbraco AI

- [ ] Bump all three AI packages together
- [ ] Dean: build and start, watch for AI migrations
- [ ] Confirm the AI section loads (unverified in July)
- [ ] Commit

## Phase 3: Community packages

- [ ] Bump BlockPreview, Contentment, UmbNav in both csproj files
- [ ] Dean: build and start
- [ ] BlockPreview: previews render; layouts still ignored (unverified in July)
- [ ] Contentment: Navigation In Page picker populates from `FeatureBlockDataSource`
- [ ] UmbNav: menu renders front end and edits in the backoffice (unverified in July)
- [ ] Commit

## Phase 4: uSync

- [ ] Bump uSync and uSync.Complete in both csproj files
- [ ] Dean: build and start, then **restart once** (uSync.Complete skips its own
  setup while Umbraco is in upgrade mode)
- [ ] Open the uSync dashboard (unverified in July)
- [ ] Run a **report**, not an import. Expect no unexpected changes
- [ ] Run a clean export; review `git diff` on `uSync/v17/`
- [ ] Resolve the stashed `example-page-02/05` question
- [ ] Commit the version bump and the export churn **separately**

## Phase 5: Verification

- [ ] Every layout and every feature block renders, desktop and mobile
- [ ] Backoffice: content, media, block grid editing, block previews
- [ ] Merge to `develop`

## Phase 6: Documentation (docs worktree, `docs/site`)

Edit under `.worktrees/docs/` only. See `WORKTREES.md`.

- [ ] New page `maintenance/upgrading.md`: the reusable runbook, from this plan
- [ ] Update versions in `maintenance/packages/index.md`
- [ ] Clear the docs Dependabot alerts: astro (fixed in 7.4.7) and zod (4.6.6)
- [ ] Fix `publishing/github-actions.md` and `publishing/index.md`: `docs.yml`
  triggers on `docs/site`, not `main`
- [ ] Document `RELEASE_NUGET_MANUAL.yml`
- [ ] Add a post-release check to `publishing/index.md`
- [ ] Build locally, commit, push, confirm deploy

## Phase 7: Release

- [ ] Merge `develop` into `main`
- [ ] Confirm `RELEASE.yml` deployed the demo site, and the demo site works
- [ ] Tag `main` and push the tag
- [ ] Confirm `RELEASE_NUGET.yml` succeeded and NuGet shows the new version
- [ ] Post-release check: `dotnet new install` the published package, scaffold a
  test site, boot it, confirm uSync imports on first boot
- [ ] Marketplace picks it up within 24 hours (or force via the validate tool)

## Rollback

Each phase is its own commit, so `git revert` is clean for code. Database
migrations are one way: restore the Phase 0 backup.
