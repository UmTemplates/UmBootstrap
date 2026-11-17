---
title: GitHub Actions
---

Three automated workflows handle deployment tasks, each triggered by specific repository events. A fourth, manual workflow is broken and kept only for reference.

## Workflows

| Workflow | Trigger | Purpose | Key Secrets |
|----------|---------|---------|-------------|
| `RELEASE.yml` | Push to `main` | Deploy demo site to UmbHost | `SOLUTION_NAME`, `WEBSITE_NAME`, `SERVER_COMPUTER_NAME`, `USERNAME`, `PASSWORD` |
| `RELEASE_NUGET.yml` | Version tag push | Publish template to NuGet | None (Trusted Publishing) |
| `docs.yml` | Push to `docs/site` (when `docs/**` changes) | Deploy docs to GitHub Pages | Pages permissions (configured in workflow) |
| `RELEASE_NUGET_MANUAL.yml` | Manual only | Old manual publish | **Broken, do not use.** It builds `template-pack.csproj`, which does not exist |

All workflows can also be triggered manually via `workflow_dispatch`.

## RELEASE.yml — Demo Site Deployment

Triggered on every push to `main`. Builds the solution and deploys to UmbHost via Web Deploy.

**Secrets required:**
- `SOLUTION_NAME` — The solution file name
- `WEBSITE_NAME` — The IIS site name on UmbHost
- `SERVER_COMPUTER_NAME` — The UmbHost server address
- `USERNAME` — Web Deploy username
- `PASSWORD` — Web Deploy password

See [Demo Site Deployment](/UmBootstrap/maintenance/publishing/demo-site/) for details on how uSync handles content synchronisation during deployment.

## RELEASE_NUGET.yml — NuGet Publishing

Triggered when a version tag is pushed (e.g. `17.8.1`, `17.8.1.1`, `17.8.1-rc1`). Creating a GitHub Release creates the tag. Builds the template package using the tag as the version number and pushes to NuGet.org.

### Trusted Publishing

There is no NuGet API key. The workflow uses NuGet **Trusted Publishing**: GitHub proves to NuGet which repository and workflow is publishing, and NuGet hands back a key that lasts one hour.

This replaced the `NUGET_API_KEY` secret in November 2026, after the key expired and the 17.8.1 push failed with a 403.

The policy lives on nuget.org under **Account, Trusted Publishing**:

| Field | Value |
|-------|-------|
| Package owner | `dean.leigh` |
| Repository owner | `UmTemplates` |
| Repository | `UmBootstrap` |
| Workflow file | `RELEASE_NUGET.yml` |
| Package | `Umbraco.Community.Templates.UmBootstrap` |
| Scope | Push new packages and package versions |

If the workflow file is renamed, the policy must be updated to match, or publishing stops working.

The workflow needs `id-token: write` permission and the `nuget/login@v1` step.

See [NuGet Packaging](/UmBootstrap/maintenance/publishing/nuget/) for details on how the template package is configured.

## docs.yml — Documentation Deployment

Triggered on push to `docs/site` when files in the `docs/**` directory have changed. Pushing to `main` does not deploy the docs. Builds the Astro Starlight site and deploys to GitHub Pages using the artifact-based deployment method.

No secrets are required — GitHub Pages permissions are configured directly in the workflow.
