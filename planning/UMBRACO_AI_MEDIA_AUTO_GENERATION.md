# Plan: Auto-Generate AI Image Descriptions on Media Upload

## Context

UmBootstrap already has Umbraco AI working with manual prompts (property actions) for generating image descriptions and alt text. The next step is to auto-generate these fields when an image is uploaded, so editors get pre-populated values they can refine.

The design must be extensible — adding new AI-generated fields in future should be a config change, not a code change.

## Approach

**One AI call per upload** — batch all fields into a single prompt that returns JSON. This halves cost/latency vs separate calls per field.

**Config-driven fields** — field definitions (property alias, prompt, max length) live in `appsettings.json`. Adding a new field = adding one JSON entry.

**Synchronous** — runs inline during the upload. Haiku 4.5 responds in 1-3 seconds, acceptable for an editor action.

## Files to Create

All in `Umbootstrap.Web/AI/`:

### 1. `MediaAIOptions.cs` — Configuration POCO

```csharp
public class MediaAIOptions
{
    public const string SectionName = "Umbootstrap:MediaAI";
    public string ProfileAlias { get; set; } = "media-descriptions";
    public string MediaTypeAlias { get; set; } = "imageResponsive";
    public List<MediaAIFieldOptions> Fields { get; set; } = [];
}

public class MediaAIFieldOptions
{
    public string PropertyAlias { get; set; } = "";
    public string Prompt { get; set; } = "";
    public int MaxLength { get; set; }
}
```

### 2. `MediaAIService.cs` — AI interaction logic

- Resolves AI profile by alias via `IAIProfileService`
- Builds a single ChatMessage with image bytes (`DataContent`) + combined prompt (`TextContent`)
- Asks AI to return JSON with keys matching property aliases
- Parses response, truncates to MaxLength as safety net
- Returns `Dictionary<string, string>?` (null on failure)

### 3. `MediaAINotificationHandler.cs` — Notification handler

- Implements `INotificationAsyncHandler<MediaSavedNotification>`
- Guards: re-entrancy (static `ConcurrentDictionary`), media type check, skip if fields already populated
- Reads image bytes from `MediaFileManager.FileSystem`
- Calls `MediaAIService`, sets values, saves media
- All errors caught and logged — upload never fails due to AI

### 4. `MediaAIComposer.cs` — Registration

- Binds `MediaAIOptions` from config
- Registers `MediaAIService` as scoped
- Registers the notification handler
- Auto-discovered by `.AddComposers()`

## File to Modify

### `appsettings.json` — Add config section

```json
"Umbootstrap": {
  "MediaAI": {
    "ProfileAlias": "media-descriptions",
    "MediaTypeAlias": "imageResponsive",
    "Fields": [
      {
        "PropertyAlias": "mediaPropertyDescription",
        "Prompt": "Write a factual description of this image. Must be 125-155 characters.",
        "MaxLength": 155
      },
      {
        "PropertyAlias": "mediaPropertyAltText",
        "Prompt": "Write WCAG-compliant alt text for this image. Under 125 characters. Describe content and function concisely.",
        "MaxLength": 125
      }
    ]
  }
}
```

## Key Technical Notes

- **umbracoFile is ImageCropper JSON** — need to parse `{"src":"/media/..."}` to get the file path
- **Infinite loop prevention** — `ConcurrentDictionary<int, byte>` tracks media IDs being processed; re-entry from `Save()` is skipped
- **AI response format** — prompt asks for raw JSON, service strips markdown fencing if present
- **Image in ChatMessage** — use `DataContent` part in the user message (standard Microsoft.Extensions.AI approach)

## Implementation Order

- [ ] Create `MediaAIOptions.cs`
- [ ] Create `MediaAIService.cs`
- [ ] Create `MediaAINotificationHandler.cs`
- [ ] Create `MediaAIComposer.cs`
- [ ] Add config to `appsettings.json`
- [ ] Build and test

## Decisions

- **Keep backoffice prompts** — editors can re-generate via manual prompt buttons if they don't like the auto-generated text. The "Multiple Options" result type in prompts lets them pick from several options.
- **Log warning once** — if no AI profile is configured (e.g. fresh template install), log a single warning so the site owner knows AI is available but not set up.

## Verification

1. Build the solution — should compile cleanly
2. Upload a new `imageResponsive` image
3. Check that `mediaPropertyDescription` and `mediaPropertyAltText` are auto-populated
4. Upload another image with pre-filled fields — verify they are NOT overwritten
5. Check terminal for any errors during the process
