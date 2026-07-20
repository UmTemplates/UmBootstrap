---
title: Umbraco AI
---

UmBootstrap ships three Umbraco AI packages, installed but unconfigured.

| Package | Version | What it does |
|---------|---------|--------------|
| Umbraco.AI | 17.1.1 | Core framework: connections, profiles, contexts, guardrails |
| Umbraco.AI.Anthropic | 17.0.0 | Anthropic provider |
| Umbraco.AI.Prompt | 17.1.0 | Reusable prompts, surfaced as property actions in the backoffice |

## Nothing happens until you configure it

**No API key ships with UmBootstrap**, and none is stored in the repository. The packages sit dormant until you add your own credentials in the backoffice.

That is deliberate. The capability is there if you want it, and it costs you nothing if you do not.

The one footprint they do have: each package creates its own database tables on first boot, whether or not you use them. Harmless, but worth knowing they are there.

## Setting it up

Everything is configured in the backoffice under the **AI** section, not in `appsettings.json`.

1. **Connections** — add a connection and paste in your provider API key
2. **Profiles** — set the model, temperature, token limit and system prompt
3. **Prompts** — write reusable prompts that appear as property actions on fields

Store the API key using [.NET User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) rather than `appsettings.json`, so it stays out of source control.

## A worked example: image alt text

The natural fit for a starter kit is generating alt text and descriptions for media.

The `Image - Responsive` media type has three properties ready for it:

| Property | Alias | Group |
|----------|-------|-------|
| Alt Text | `mediaPropertyAltText` | Accessibility |
| Title | `mediaPropertyTitle` | CMS |
| Description | `mediaPropertyDescription` | CMS |

With a prompt configured against each, an editor uploads an image and generates accessible alt text in one click, rather than leaving the field empty.

That last point matters more than the convenience. An image without alt text is invisible to screen readers and to search engines. Anything that makes writing it easier makes it more likely to happen.

## Version line

The AI packages renumbered to track the Umbraco major version. The old `1.x` line is no longer maintained.

- **17.x** targets Umbraco 17 — used here
- **18.x** targets Umbraco 18

`Umbraco.AI` 17.x requires `Umbraco.Cms.Core` 17.4.0 or later, so it cannot be installed on an older Umbraco 17 patch.
