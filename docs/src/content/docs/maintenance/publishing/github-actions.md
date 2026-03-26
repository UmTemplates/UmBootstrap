---
title: GitHub Actions
---

Three automated workflows handle deployment tasks, each triggered by specific repository events.

## Workflows

| Workflow | Trigger | Purpose | Key Secrets |
|----------|---------|---------|-------------|
| `RELEASE.yml` | Push to `main` | Deploy demo site to UmbHost | `SOLUTION_NAME`, `WEBSITE_NAME`, `SERVER_COMPUTER_NAME`, `USERNAME`, `PASSWORD` |
| `RELEASE_NUGET.yml` | Semver tag push | Publish template to NuGet | `NUGET_API_KEY` |
| `docs.yml` | Push to `main` (when `docs/**` changes) | Deploy docs to GitHub Pages | Pages permissions (configured in workflow) |

All workflows can also be triggered manually via `workflow_dispatch`.

## RELEASE.yml — Demo Site Deployment

Triggered on every push to `main`. Builds the solution and deploys to UmbHost via Web Deploy.

**Secrets required:**
- `SOLUTION_NAME` — The solution file name
- `WEBSITE_NAME` — The IIS site name on UmbHost
- `SERVER_COMPUTER_NAME` — The UmbHost server address
- `USERNAME` — Web Deploy username
- `PASSWORD` — Web Deploy password

See [Demo Site Deployment](/UmBootstrap/publishing/demo-site/) for details on how uSync handles content synchronisation during deployment.

## RELEASE_NUGET.yml — NuGet Publishing

Triggered when a semver tag is pushed (e.g. `17.2.0`, `17.2.0-beta`). Builds the template package using the tag as the version number and pushes to NuGet.org.

**Secrets required:**
- `NUGET_API_KEY` — API key for NuGet.org

See [NuGet Packaging](/UmBootstrap/publishing/nuget/) for details on how the template package is configured.

## docs.yml — Documentation Deployment

Triggered on push to `main` when files in the `docs/**` directory have changed. Builds the Astro Starlight site and deploys to GitHub Pages using the artifact-based deployment method.

No secrets are required — GitHub Pages permissions are configured directly in the workflow.
