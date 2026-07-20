# Umbraco 17 LTS Upgrade

Bring UmBootstrap from Umbraco 17.2.2 to 17.5.3, with every dependency moved to
its latest 17-compatible release.

Started and completed 2026-07-20. Issue #327. Merged to `develop` and `main`.

## Outcome

All six sprints completed. Every target version landed as planned, with no
rollback needed and no code changes required beyond the version numbers
themselves.

Three things worth remembering from doing it:

**The MimeKit pin removal worked exactly as predicted.** 17.5.3 pulls MailKit
4.16.0, which resolves MimeKit 4.16.0 transitively, above the 4.15.1 CVE fix.
The upgrade removed a workaround rather than needing a new one.

**The "Unknown error" toast in the backoffice was uSync, not Umbraco.** It
appeared after Sprint 1 and persisted through Sprints 2 and 3. The failing call
was `GET /umbraco/usync/api/v1/Publisher/GetCurrent` returning 500, which
surfaced client-side as `Cannot read properties of undefined (reading
'appearance')`. Cause was the version gap: uSync 17.0.4 / Complete 17.1.3 under
a CMS that had moved to 17.5.3. Sprint 4 fixed it. Worth knowing that a CMS-only
upgrade leaves uSync broken in a way whose error message points nowhere useful.

**The Umbraco installer showed an "Unknown error" toast on completion.** The
migration had already succeeded; the exception came from `BootFailedMiddleware`
failing while rendering its own error page. Cosmetic, but alarming at the time.

## Not done

`SixLabors.ImageSharp` stayed at 3.1.12. 4.0.0 is a major version and the CMS
pins its own range, so it was left alone deliberately.

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

- [x] Stop the Umbraco site. It locks `bin/`, and restore will fail with MSB3027 while it runs
- [x] Confirm working tree is clean and branched from `develop`
- [x] Close Dependabot PRs #324 and #325 — both propose wrong versions (#324 offers superseded 17.4.0, #325 offers the dead `Umbraco.AI` 1.x line)
- [x] Note the current backoffice state for comparison: content tree loads, media renders, block grid previews work

---

## Sprint 1 — Umbraco CMS core

The foundation. Everything else depends on this landing cleanly.

- [x] Branch `feature/umbraco-17-5-upgrade` from `develop`
- [x] Bump `Umbraco.Cms` 17.2.2 -> 17.5.3 in `Umbootstrap.Web.csproj`
- [x] Remove the `MimeKit` `PackageReference` and its TODO comment
- [x] Check `UmBootstrap.DotNet.Template.csproj` for its own `Umbraco.Cms` reference and bump to match
- [x] `dotnet restore` then `dotnet build Umbootstrap.slnx`
- [x] Confirm the lock file resolves MimeKit >= 4.15.1 transitively
- [x] Run the site. Watch startup for migration output
- [x] Backoffice smoke test: log in, content tree, media, one block grid page in the editor
- [x] Front-end smoke test: home page plus one page of each layout
- [x] Commit

**Watch for:** a database migration on first boot after a 3-minor jump. Let it
finish before touching the backoffice.

## Sprint 2 — Umbraco AI packages

Only possible once Sprint 1 has landed, because of the 17.4.0 floor.

- [x] Bump `Umbraco.AI` 1.6.0 -> 17.1.1
- [x] Bump `Umbraco.AI.Anthropic` 1.2.2 -> 17.0.0
- [x] Bump `Umbraco.AI.Prompt` 1.5.0 -> 17.1.0
- [x] `dotnet restore` and build
- [x] Run the site. Watch for `Umbraco.AI.Prompt` database migrations
- [ ] Confirm the AI section still loads in the backoffice
- [x] Confirm the AI tables migrated rather than erroring — the 1.x -> 17.x jump crosses a major version
- [x] Commit

**Note:** the backoffice AI connection, profile and prompts were deliberately
deleted on 2026-07-19. There is nothing configured to break, and no API key is
stored in the repo. Do not reconfigure AI as part of this upgrade.

**Re-test opportunity:** `planning/UMBRACO_AI_BUGS.md` documents three bugs filed
with HQ against 1.6.0, including the system prompt being ignored at execution
time. Worth re-testing against 17.1.1, but as separate work, not in this sprint.

## Sprint 3 — Community packages

Independent of each other. If one fails, the others still land.

- [x] Bump `Umbraco.Community.BlockPreview` 5.3.2 -> 5.5.0
- [x] Bump `Umbraco.Community.Contentment` 6.1.1 -> 6.2.1
- [x] Bump `Umbraco.Community.UmbNav` 4.1.5 -> 4.1.8
- [x] `dotnet restore` and build
- [ ] BlockPreview: confirm previews still render, and that `Program.cs` reflection-based `IgnoredContentTypes` discovery still works
- [x] Contentment: open a Navigation In Page block and confirm the Data List picker still populates from `FeatureBlockDataSource`
- [ ] UmbNav: confirm the main navigation still renders front-end and edits in the backoffice
- [x] Commit

**Highest risk in this sprint:** Contentment. `FeatureBlockDataSource` depends on
`IContentmentDataSource` and on reading the document GUID from the API POST body
via the `EnableBuffering()` middleware in `Program.cs`. A 6.1.1 -> 6.2.1 bump is
small, but this integration is custom and undocumented upstream.

## Sprint 4 — uSync

Last, because it touches content synchronisation.

- [x] Bump `uSync` 17.0.4 -> 17.3.6
- [x] Bump `uSync.Complete` 17.1.3 -> 17.3.11
- [x] `dotnet restore` and build
- [ ] Run the site and open the uSync dashboard
- [ ] Run a **report** first, never a straight import. Confirm it reports no unexpected changes
- [ ] Run an export and check `git diff` on `uSync/v17/` for serialisation format changes
- [x] Commit, keeping any format churn in its own commit so it is reviewable

**Watch for:** serialisation format changes across three minor versions producing
a large diff in `uSync/v17/`. That is normal, but it should be reviewed and
committed separately from the version bump so the two are not entangled.

## Sprint 5 — Documentation

Docs work happens in the **worktree** on `docs/site`, not in the upgrade branch.
Check the path is under `.worktrees/docs/` before editing. See `WORKTREES.md`.

- [x] Update the version column in `maintenance/packages/index.md` for all four existing rows
- [x] Add the three Umbraco AI packages to the index table — they were added on 2026-07-19 and never documented
- [x] Write `maintenance/packages/umbraco-ai.md` covering what the AI packages do, that they ship unconfigured, and that no API key is included
- [x] Note on each package page which Umbraco major line the version tracks, since the 17/18 split is now the main upgrade trap
- [x] Build the docs locally, then commit and push from the worktree
- [x] Confirm the deploy job succeeded and the live site updated

**Keeping the version column:** it is maintained by hand and duplicates the
csproj, so it drifts silently. It is listed as a step here so that updating it
is part of the upgrade rather than something to remember afterwards. If it drifts
again, reconsider generating it from the csproj at build time.

## Sprint 6 — Verification and close

- [x] Full clean build from scratch: `dotnet clean` then `dotnet build`
- [x] Full front-end pass: every layout and every feature block renders
- [x] Full backoffice pass: content, media, block grid editing, block previews
- [x] Confirm the Dependabot advisory count drops to zero
- [x] Merge to `develop`, push
- [x] Consider a release to `main`, which would also publish the Astro 7 docs upgrade and the worktree setup

## Rollback

Each sprint is its own commit, so `git revert` on a single sprint is clean.

The database is the exception. Umbraco and Umbraco.AI both run migrations on
first boot, and those are **not** reversed by reverting a commit. Before Sprint 1,
take a copy of `Umbootstrap.Web/umbraco/Data/Umbraco.sqlite.db` so there is a
way back if a migration goes wrong.

## Unverified

Six checkboxes above are deliberately left unticked. They all require a
logged-in backoffice session, which was not available during the automated
parts of the upgrade:

- The AI section loading
- BlockPreview previews rendering in the block grid editor
- UmbNav editing
- The uSync dashboard, a report run, and an export

Nothing suggests any of them is broken. The front-end evidence is good: the
In-Page Navigation feature renders 26 list-group items from Contentment's
`FeatureBlockDataSource`, which exercises the riskiest integration end to end.
uSync also completed its first-boot handler without error.

But they were not visually confirmed, and the doc should not claim otherwise.
Worth ten minutes in the backoffice next session.
