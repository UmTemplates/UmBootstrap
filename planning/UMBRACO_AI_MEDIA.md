# Umbraco AI — Media Image Descriptions

## Context

UmBootstrap's `Image - Responsive` media type has three metadata fields via compositions that editors currently populate manually:

- `mediaPropertyTitle` (TextBox) — from `mediaComponentMetadata`
- `mediaPropertyDescription` (TextArea) — from `mediaComponentMetadata`
- `mediaPropertyAltText` (TextArea) — from `mediaComponentImageMetadata`

Matt Brailsford's [Umbraco AI](https://mattbrailsford.dev/introducing-umbraco-ai) package provides a provider-agnostic AI integration layer for Umbraco. The **Prompt** add-on adds property actions to the backoffice — editors click a button on a field to generate AI content. This is ideal for auto-generating image title, description, and alt text from the uploaded image.

UmBootstrap is an open source .NET template — we can't assume a specific AI provider or that the user has an API key. The setup must be **provider-agnostic** and **optional**.

## Packages

### Shipped with the template

| Package | Version | Purpose |
|---------|---------|---------|
| `Umbraco.AI` | 1.6.0 | Core AI integration layer |
| `Umbraco.AI.Prompt` | 1.5.0 | Property action prompts in the backoffice |

### User installs (their choice of provider)

| Package | Version | Purpose |
|---------|---------|---------|
| `Umbraco.AI.Anthropic` | 1.2.2 | Anthropic Claude provider |
| `Umbraco.AI.OpenAI` | 1.1.3 | OpenAI GPT provider |
| `Umbraco.AI.Google` | — | Google Gemini provider |
| `Umbraco.AI.Amazon` | — | Amazon Bedrock provider |
| `Umbraco.AI.MicrosoftFoundry` | — | Azure AI Foundry provider |

All packages target .NET 10 / Umbraco 17. Source: [github.com/umbraco/Umbraco.AI](https://github.com/umbraco/Umbraco.AI)

## How Umbraco AI Works

The system has five layers:

1. **Providers** — NuGet packages for AI services (user's choice)
2. **Connections** — Authentication config for a provider. Keys use `$` prefix to reference appsettings rather than storing in the database
3. **Profiles** — Named configurations combining a connection with model settings (temperature, max tokens, system prompt)
4. **Contexts** — Additional knowledge injected into AI requests (static files or content queries)
5. **Prompts** (add-on) — Executable prompt templates attached as property actions, using Mustache syntax to reference property values

Built on **Microsoft.Extensions.AI** (`IChatClient`, `ChatMessage`, `ChatResponse`).

## Approach

Ship UmBootstrap with the core AI packages and pre-built prompt templates. The user adds their chosen provider package, configures a connection and profile, and the prompts are ready to use.

**What ships with the template:**
- `Umbraco.AI` + `Umbraco.AI.Prompt` NuGet packages
- Pre-built prompt templates for the three media fields
- Documentation on how to complete the setup

**What the user provides:**
- Their choice of AI provider package (Anthropic, OpenAI, Google, etc.)
- API key for their chosen provider
- Connection and profile configuration in the backoffice

## Prompt Templates

Three property action prompts, one per field:

| Field | Prompt guidance |
|-------|----------------|
| `mediaPropertyTitle` | Short descriptive title (5-10 words), no "Image of..." prefix |
| `mediaPropertyDescription` | Longer description (1-2 sentences) for CMS editors |
| `mediaPropertyAltText` | Accessible alt text following WCAG guidelines, concise, describes function and content |

Storage and format TBD — need to investigate how Umbraco AI stores/exports prompts and whether they can be shipped as files in the template.

## User Setup (documentation we need to write)

1. Install a provider package (e.g. `dotnet add package Umbraco.AI.Anthropic`)
2. Add API key to `appsettings.json` or user secrets
3. In the Umbraco backoffice AI section, create a **Connection** referencing the API key with `$` prefix
4. Create a **Profile** targeting a model with vision capability
5. Prompts should already be available — link them to the profile

## Open Questions

- Does Umbraco.AI.Prompt support image/vision context for media properties, or only text fields? Need to verify with the actual package.
- How are prompts stored? Can they be shipped as files in the template (uSync, JSON, etc.) or do they need manual creation?
- Does uSync export Umbraco AI configuration (connections, profiles, prompts)?
- What's the exact Program.cs registration method? (`.AddUmbracoAI()` or auto-discovered via composers?)
- Do the core packages degrade gracefully when no provider is installed? (No errors, just no AI buttons?)

## Branch

`feature/umbraco-ai-media`

## Status

- [ ] Install core NuGet packages (`Umbraco.AI` + `Umbraco.AI.Prompt`)
- [ ] Register Umbraco AI in Program.cs (if needed)
- [ ] Run site and verify backoffice AI section appears
- [ ] Install Anthropic provider (for our own testing)
- [ ] Configure connection and profile
- [ ] Create/configure prompts for title, description, alt text
- [ ] Test end-to-end with image upload
- [ ] Investigate prompt storage/export for shipping with the template
- [ ] Verify graceful degradation when no provider is installed
- [ ] Write user-facing documentation
