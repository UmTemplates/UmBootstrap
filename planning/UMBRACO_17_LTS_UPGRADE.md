# Umbraco 17 LTS Upgrade

Bring UmBootstrap from Umbraco 17.2.2 to 17.5.3, with every dependency moved to
its latest 17-compatible release.

Started 2026-07-20.

## Scope decision: 17 LTS, not 18

The literal latest Umbraco is 18.0.2. We are deliberately staying on **17.5.3**,
the newest release of the **LTS** line.

Every community package now publishes two lines, one per Umbraco major. Taking
the highest version number of any of them would drag the whole project onto 18.

| Package | 17-compatible (target) | 18 line (avoid) |
|---|---|---|
| BlockPreview | 5.5.0 | 6.1.0 |
| Contentment | 6.2.1 | 7.0.1 |
| UmbNav | 4.1.8 | 5.0.0 |
| uSync | 17.3.6 | 18.0.2 |
| uSync.Complete | 17.3.11 | 18.0.2 |
| Umbraco.AI | 17.1.1 | 18.1.1 |
| Umbraco.AI.Anthropic | 17.0.0 | 18.0.0 |
| Umbraco.AI.Prompt | 17.1.0 | 18.1.0 |

## Target versions

| Package | From | To | Note |
|---|---|---|---|
| Umbraco.Cms | 17.2.2 | **17.5.3** | Clears XSS advisory (GHSA in backoffice confirmation dialog) |
| Umbraco.AI | 1.6.0 | **17.1.1** | Requires Cms.Core >= 17.4.0 |
| Umbraco.AI.Anthropic | 1.2.2 | **17.0.0** | Clears config-disclosure advisory |
| Umbraco.AI.Prompt | 1.5.0 | **17.1.0** | |
| Umbraco.Community.BlockPreview | 5.3.2 | **5.5.0** | Requires Cms.Api.Common [17.3.0, 18.0.0) |
| Umbraco.Community.Contentment | 6.1.1 | **6.2.1** | Requires Cms.Api.Management [17.0.0, 18.0.0) |
| Umbraco.Community.UmbNav | 4.1.5 | **4.1.8** | |
| uSync | 17.0.4 | **17.3.6** | |
| uSync.Complete | 17.1.3 | **17.3.11** | |
| MimeKit | 4.15.1 | **remove pin** | See below |
| SixLabors.ImageSharp | 3.1.12 | **hold at 3.1.12** | 4.0.0 is a major bump; CMS pins its own range |

### The MimeKit pin can go

The pin exists because MimeKit 4.14.0 carried CVE-2026-30227, fixed in 4.15.1.

MimeKit is pulled transitively by MailKit, which the CMS depends on:

| | MailKit | resolves MimeKit |
|---|---|---|
| Umbraco 17.2.2 | 4.14.1 | 4.14.0 (vulnerable) |
| Umbraco 17.5.3 | 4.16.0 | 4.16.0 (fixed) |

So 17.5.3 resolves above the fix on its own. Remove the `PackageReference` and
its TODO comment. Confirm after restore that the lock file resolves MimeKit
>= 4.15.1 transitively.

## Ordering constraint

The order is not arbitrary. **AI 17.x hard-requires `Umbraco.Cms.Core >= 17.4.0`**,
so the CMS must move first or the restore fails.

Sprints 3 and 4 are independent of each other and could run in either order.
uSync is deliberately last: it touches content synchronisation, and it is worth
having a known-good CMS underneath before testing an import.

## Before starting

- [ ] Stop the Umbraco site. It locks `bin/`, and restore will fail with MSB3027 while it runs
- [ ] Confirm working tree is clean and branched from `develop`
- [ ] Close Dependabot PRs #324 and #325 — both propose wrong versions (#324 offers superseded 17.4.0, #325 offers the dead `Umbraco.AI` 1.x line)
- [ ] Note the current backoffice state for comparison: content tree loads, media renders, block grid previews work

---

## Sprint 1 — Umbraco CMS core

The foundation. Everything else depends on this landing cleanly.

- [ ] Branch `feature/umbraco-17-5-upgrade` from `develop`
- [ ] Bump `Umbraco.Cms` 17.2.2 -> 17.5.3 in `Umbootstrap.Web.csproj`
- [ ] Remove the `MimeKit` `PackageReference` and its TODO comment
- [ ] Check `UmBootstrap.DotNet.Template.csproj` for its own `Umbraco.Cms` reference and bump to match
- [ ] `dotnet restore` then `dotnet build Umbootstrap.slnx`
- [ ] Confirm the lock file resolves MimeKit >= 4.15.1 transitively
- [ ] Run the site. Watch startup for migration output
- [ ] Backoffice smoke test: log in, content tree, media, one block grid page in the editor
- [ ] Front-end smoke test: home page plus one page of each layout
- [ ] Commit

**Watch for:** a database migration on first boot after a 3-minor jump. Let it
finish before touching the backoffice.

## Sprint 2 — Umbraco AI packages

Only possible once Sprint 1 has landed, because of the 17.4.0 floor.

- [ ] Bump `Umbraco.AI` 1.6.0 -> 17.1.1
- [ ] Bump `Umbraco.AI.Anthropic` 1.2.2 -> 17.0.0
- [ ] Bump `Umbraco.AI.Prompt` 1.5.0 -> 17.1.0
- [ ] `dotnet restore` and build
- [ ] Run the site. Watch for `Umbraco.AI.Prompt` database migrations
- [ ] Confirm the AI section still loads in the backoffice
- [ ] Confirm the AI tables migrated rather than erroring — the 1.x -> 17.x jump crosses a major version
- [ ] Commit

**Note:** the backoffice AI connection, profile and prompts were deliberately
deleted on 2026-07-19. There is nothing configured to break, and no API key is
stored in the repo. Do not reconfigure AI as part of this upgrade.

**Re-test opportunity:** `planning/UMBRACO_AI_BUGS.md` documents three bugs filed
with HQ against 1.6.0, including the system prompt being ignored at execution
time. Worth re-testing against 17.1.1, but as separate work, not in this sprint.

## Sprint 3 — Community packages

Independent of each other. If one fails, the others still land.

- [ ] Bump `Umbraco.Community.BlockPreview` 5.3.2 -> 5.5.0
- [ ] Bump `Umbraco.Community.Contentment` 6.1.1 -> 6.2.1
- [ ] Bump `Umbraco.Community.UmbNav` 4.1.5 -> 4.1.8
- [ ] `dotnet restore` and build
- [ ] BlockPreview: confirm previews still render, and that `Program.cs` reflection-based `IgnoredContentTypes` discovery still works
- [ ] Contentment: open a Navigation In Page block and confirm the Data List picker still populates from `FeatureBlockDataSource`
- [ ] UmbNav: confirm the main navigation still renders front-end and edits in the backoffice
- [ ] Commit

**Highest risk in this sprint:** Contentment. `FeatureBlockDataSource` depends on
`IContentmentDataSource` and on reading the document GUID from the API POST body
via the `EnableBuffering()` middleware in `Program.cs`. A 6.1.1 -> 6.2.1 bump is
small, but this integration is custom and undocumented upstream.

## Sprint 4 — uSync

Last, because it touches content synchronisation.

- [ ] Bump `uSync` 17.0.4 -> 17.3.6
- [ ] Bump `uSync.Complete` 17.1.3 -> 17.3.11
- [ ] `dotnet restore` and build
- [ ] Run the site and open the uSync dashboard
- [ ] Run a **report** first, never a straight import. Confirm it reports no unexpected changes
- [ ] Run an export and check `git diff` on `uSync/v17/` for serialisation format changes
- [ ] Commit, keeping any format churn in its own commit so it is reviewable

**Watch for:** serialisation format changes across three minor versions producing
a large diff in `uSync/v17/`. That is normal, but it should be reviewed and
committed separately from the version bump so the two are not entangled.

## Sprint 5 — Documentation

Docs work happens in the **worktree** on `docs/site`, not in the upgrade branch.
Check the path is under `.worktrees/docs/` before editing. See `WORKTREES.md`.

- [ ] Update the version column in `maintenance/packages/index.md` for all four existing rows
- [ ] Add the three Umbraco AI packages to the index table — they were added on 2026-07-19 and never documented
- [ ] Write `maintenance/packages/umbraco-ai.md` covering what the AI packages do, that they ship unconfigured, and that no API key is included
- [ ] Note on each package page which Umbraco major line the version tracks, since the 17/18 split is now the main upgrade trap
- [ ] Build the docs locally, then commit and push from the worktree
- [ ] Confirm the deploy job succeeded and the live site updated

**Keeping the version column:** it is maintained by hand and duplicates the
csproj, so it drifts silently. It is listed as a step here so that updating it
is part of the upgrade rather than something to remember afterwards. If it drifts
again, reconsider generating it from the csproj at build time.

## Sprint 6 — Verification and close

- [ ] Full clean build from scratch: `dotnet clean` then `dotnet build`
- [ ] Full front-end pass: every layout and every feature block renders
- [ ] Full backoffice pass: content, media, block grid editing, block previews
- [ ] Confirm the Dependabot advisory count drops to zero
- [ ] Merge to `develop`, push
- [ ] Consider a release to `main`, which would also publish the Astro 7 docs upgrade and the worktree setup

## Rollback

Each sprint is its own commit, so `git revert` on a single sprint is clean.

The database is the exception. Umbraco and Umbraco.AI both run migrations on
first boot, and those are **not** reversed by reverting a commit. Before Sprint 1,
take a copy of `Umbootstrap.Web/umbraco/Data/Umbraco.sqlite.db` so there is a
way back if a migration goes wrong.
