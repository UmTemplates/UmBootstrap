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

## User Setup (documentation to write)

1. Install a provider package (e.g. `dotnet add package Umbraco.AI.Anthropic`)
2. Add API key to `appsettings.json` or user secrets
3. In the Umbraco backoffice AI section, create a **Connection** referencing the API key with `$` prefix
4. Create a **Profile** targeting a model with vision capability
5. Create prompts for each field, scoped to the media type and property

---

## Chosen Approach: Per-Field Property Action Prompts

Editors click a button on an individual field to generate AI content for that specific property. This approach was chosen over a batch entity action because:

- **Full editor control** — each field is generated independently, the editor decides which to generate
- **No custom code** — uses Umbraco AI's built-in Prompt add-on, prompts configured entirely in the backoffice
- **Flexible** — adding/removing AI from a field is a backoffice config change, not a code change
- **Prompt refinement** — editors can tweak prompts in the Umbraco AI interface without touching code

### Prompt Templates

| Field | Prompt guidance |
|-------|----------------|
| `mediaPropertyDescription` | Longer description (1-2 sentences) for CMS editors, 125-155 characters |
| `mediaPropertyAltText` | Accessible alt text following WCAG guidelines, concise, under 125 characters |

### Prompt Configuration

- Prompts use `{{image:umbracoFile}}` syntax to pass the image to the AI — this is key for vision models
- Scoped to `imageResponsive` media type and specific properties
- IncludeEntityContext enabled
- See `UMBRACO_AI_BUGS.md` for full prompt instruction text and scope JSON backup

### Status

- [x] Install core NuGet packages (`Umbraco.AI` 1.6.0 + `Umbraco.AI.Prompt` 1.5.0)
- [x] Register Umbraco AI in Program.cs — NOT NEEDED, auto-discovers via composers
- [x] Run site and verify backoffice AI section appears
- [x] Install Anthropic provider (`Umbraco.AI.Anthropic` 1.2.2) for testing
- [x] Configure connection and profile (connection: Anthropic, profile: Media Descriptions, model: Haiku 4.5)
- [x] Create/configure prompts for description and alt text (title skipped — not needed)
- [x] Test end-to-end with image — working with `{{image:umbracoFile}}` syntax
- [x] Scope prompts to `imageResponsive` media type and specific properties
- [ ] Create alt text prompt (description prompt done, alt text still needed)
- [ ] Investigate prompt storage/export for shipping with the template
- [ ] Verify graceful degradation when no provider is installed
- [ ] Restore `$Anthropic:ApiKey` reference in connection (raw key was pasted for testing)
- [ ] Write user-facing documentation

---

## Explored & Discarded: Entity Action (Batch Generate All Fields)

### What We Built

A "Generate AI Metadata" button in the media item's three-dot entity actions menu that would populate all metadata fields in a single click.

### Architecture Explored

We explored two approaches for the backend:

#### Approach 1: Custom AI Service (built, then replaced)

- `MediaAIOptions.cs` — config POCO with per-media-type field definitions, prompts, and max lengths in `appsettings.json`
- `MediaAIService.cs` — loaded and resized the image with SixLabors.ImageSharp (max 768px wide), built a single ChatMessage with the image + combined prompt asking for JSON response, parsed the response and truncated to max lengths
- Used `IAIChatService` and `IAIProfileService` from Umbraco AI Core directly
- Single AI call per click — one image send, all fields returned as JSON (most token-efficient)
- Filename cleaning: stripped Unsplash IDs, photographer names, hyphens, extensions for use as an AI hint

#### Approach 2: Reuse Existing Prompts via IAIPromptService (built, replaced approach 1)

- Discovered that `IAIPromptService.ExecutePromptAsync(promptId, request)` is callable server-side
- `AIPromptExecutionRequest` takes `EntityId`, `EntityType`, `PropertyAlias`, `ContentTypeAlias`
- Used `GetPromptsAsync()` to discover all prompts, filtered by `Scope.AllowRules.ContentTypeAliases`
- Executed each matching prompt in sequence against the media item
- No custom prompt text needed — reused the same prompts the per-field buttons use
- Trade-off: image sent once per prompt (N x image tokens vs 1x for batched approach)

#### Frontend: Umbraco Backoffice Entity Action

- Plain JS in `App_Plugins/` failed — ES module imports (`@umbraco-cms/backoffice/*`) can't resolve without a bundler
- Scaffolded proper TypeScript/Vite project using `dotnet new umbraco-extension -n Umbootstrap.MediaAI`
- Entity action appeared correctly in the three-dot menu
- Confirmation dialog (`UMB_CONFIRM_MODAL`) and toast notifications (`UMB_NOTIFICATION_CONTEXT`) worked
- 401 Unauthorized on API call — needed `umbraco/management/api/v1/` route prefix for backoffice auth, not a custom route

### Why We Discarded It

1. **Only two fields to generate** — the overhead of an entity action, custom API controller, and TypeScript extension project wasn't justified for saving two clicks
2. **Per-field prompts already work well** — editors have full control, prompts are configured in the backoffice UI
3. **Write-back problem** — entity action saves via `IMediaService.Save()` server-side, but the editor has the media item open in the browser. They'd see stale data and overwrite the AI values when they hit save. Solutions (returning values to the frontend to set on the form, or forcing a page reload) added more complexity
4. **Token cost** — the prompt-reuse approach (approach 2) sends the image once per field. With only two fields that's 2x, but a batched approach (approach 1) would be 1x. Neither is significant for small volumes but matters at scale
5. **Not worth packaging** — every site will have different media types, fields, and prompt requirements. A package would be either too rigid or too abstract. The per-field prompt approach is inherently flexible without custom code

### Key Technical Learnings

These are worth documenting for future reference or an article:

#### Umbraco AI Prompt Add-on — Server-Side API

The Prompt add-on has a full server-side API that's not documented but discoverable from the XML docs:

```csharp
// Discover prompts
var prompts = await _promptService.GetPromptsAsync(cancellationToken);

// Filter by media type scope
var matching = prompts.Where(p => p.IsActive &&
    p.Scope?.AllowRules?.Any(r =>
        r.ContentTypeAliases?.Contains("imageResponsive") == true) == true);

// Execute a prompt
var request = new AIPromptExecutionRequest
{
    EntityId = mediaKey,        // GUID of the media item
    EntityType = "media",
    ContentTypeAlias = "imageResponsive",
    PropertyAlias = "mediaPropertyDescription"
};
var result = await _promptService.ExecutePromptAsync(prompt.Id, request, cancellationToken);
// result.Content = the generated text
```

Key interfaces: `IAIPromptService`, `AIPromptExecutionRequest`, `AIPromptExecutionResult`, `AIPrompt`, `AIPromptScope`, `AIPromptScopeRule`.

#### Umbraco Backoffice Entity Actions — Plain JS Won't Work

Entity actions registered in `umbraco-package.json` with an `api` property pointing to a plain `.js` file in `App_Plugins/` will fail because:
- The backoffice uses ES module imports like `@umbraco-cms/backoffice/entity-action`
- These are bare module specifiers that need a bundler (Vite) to resolve via import maps
- The error message is: *"Extension did not succeed creating an Element with Api... missing a JavaScript file via the 'element' or the 'js' property"*
- Solution: use `dotnet new umbraco-extension` to scaffold a proper TypeScript/Vite project

#### Umbraco Extension Template — Version Pinning

The `dotnet new umbraco-extension` template generates `.csproj` with `Version="*"` for Umbraco packages. When referenced as a project (not a NuGet package), this resolves to the latest version and can trigger an unwanted database upgrade. Pin versions to match the main project.

#### Management API Auth

Custom API controllers inheriting from `ManagementApiControllerBase` must use the `umbraco/management/api/v1/` route prefix for backoffice authentication to work. A custom route like `api/umbootstrap/...` returns 401 even with `[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]`.

---

## Open Questions

- How are prompts stored? Can they be shipped as files in the template (uSync, JSON, etc.) or do they need manual creation?
- Does uSync export Umbraco AI configuration (connections, profiles, prompts)?
- Do the core packages degrade gracefully when no provider is installed? (No errors, just no AI buttons?)

## Branch

`feature/umbraco-ai-media`
