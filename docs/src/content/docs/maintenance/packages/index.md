---
title: Installed Packages
---

UmBootstrap runs on **Umbraco 17.8.1** and includes the following packages out of the box.

## Community packages

| Package | Version | Description |
|---------|---------|-------------|
| [BlockPreview](/UmBootstrap/maintenance/packages/block-preview/) | 5.7.0 | Live block previews in the backoffice |
| [Contentment](/UmBootstrap/maintenance/packages/contentment/) | 6.3.5 | Custom data sources and property editors |
| [UmbNav](/UmBootstrap/maintenance/packages/umbnav/) | 4.1.10 | Navigation menu builder |
| [uSync](/UmBootstrap/maintenance/packages/usync/) | 17.6.2 | Content and configuration synchronisation |
| [uSync.Complete](/UmBootstrap/maintenance/packages/usync/#usynccomplete) | 17.7.2 | Commercial add-on to uSync. Runs on a trial licence |

## Umbraco AI

| Package | Version | Description |
|---------|---------|-------------|
| [Umbraco.AI](/UmBootstrap/maintenance/packages/umbraco-ai/) | 17.8.0 | Core AI framework: connections, profiles, contexts |
| [Umbraco.AI.Anthropic](/UmBootstrap/maintenance/packages/umbraco-ai/) | 17.1.5 | Anthropic provider for Umbraco AI |
| [Umbraco.AI.Prompt](/UmBootstrap/maintenance/packages/umbraco-ai/) | 17.4.1 | Reusable prompts, surfaced as property actions |

These ship installed but **unconfigured**. No API key is included, and nothing happens until you add your own. See [Umbraco AI](/UmBootstrap/maintenance/packages/umbraco-ai/).

## Version lines track the Umbraco major version

Most of these packages publish a separate release line per Umbraco major version, and **the higher version number is not always the one you want**.

UmBootstrap targets Umbraco 17 LTS, so every package above is on its Umbraco 17 line:

| Package | Umbraco 17 (used here) | Umbraco 18 |
|---------|------------------------|------------|
| BlockPreview | 5.x | 6.x |
| Contentment | 6.x | 7.x |
| UmbNav | 4.x | 5.x |
| uSync and uSync.Complete | 17.x | 18.x |
| Umbraco.AI | 17.x | 18.x |

Taking "latest" from NuGet on any of these will pull the Umbraco 18 line and break the build against Umbraco 17. Check the package's dependency range before upgrading: the Umbraco 17 releases declare an upper bound of `[17.x, 18.0.0)`.

Automated dependency tools do not understand this distinction and will offer the wrong line.
