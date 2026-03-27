# Plan: AI-Powered Media Metadata Generation

## Context

UmBootstrap already has Umbraco AI working with manual prompts (property actions) for generating image descriptions and alt text. The next step is a one-click "Generate AI Metadata" entity action that populates all metadata fields at once — title, description, alt text — and renames the media node.

The design must be:
- **Extensible** — adding new fields or media types is a config change, not code
- **Editor-controlled** — a button click, not automatic on upload
- **Context-aware** — uses the original filename as a hint alongside the image

## Approach

**Entity action, not notification handler** — editor uploads an image, sees it, clicks "Generate AI Metadata" from the entity actions menu (three dots, top-right). This avoids notification handler complexity (re-entrancy, mid-save failures) and keeps the editor in control.

**One AI call per click** — batch all fields into a single prompt that returns JSON. Halves cost/latency vs separate calls.

**Config-driven per media type** — each media type has its own field definitions in `appsettings.json`. Adding a new media type or field = adding a JSON entry.

**Filename as context** — the original filename (cleaned of hyphens, underscores, photographer credits, stock photo IDs) is passed to the AI as a hint alongside the image.

**Node rename** — the AI-generated title (sanitised) replaces the ugly filename as the media node name.

## What Gets Generated

For `imageResponsive`:

| Field | Source | Notes |
|-------|--------|-------|
| Node name | AI title (sanitised) | Replaces filename in tree/cards |
| `mediaPropertyTitle` | AI-generated | Proper title with punctuation |
| `mediaPropertyDescription` | AI-generated | 125-155 characters |
| `mediaPropertyAltText` | AI-generated | WCAG-compliant, under 125 chars |

## Files to Create

### C# (backend) — `Umbootstrap.Web/AI/`

#### 1. `MediaAIOptions.cs` — Configuration POCO

```csharp
public class MediaAIOptions
{
    public const string SectionName = "Umbootstrap:MediaAI";
    public string ProfileAlias { get; set; } = "media-descriptions";
    public List<MediaAIMediaTypeOptions> MediaTypes { get; set; } = [];
}

public class MediaAIMediaTypeOptions
{
    public string Alias { get; set; } = "";
    public bool RenameNode { get; set; } = true;
    public List<MediaAIFieldOptions> Fields { get; set; } = [];
}

public class MediaAIFieldOptions
{
    public string PropertyAlias { get; set; } = "";
    public string Prompt { get; set; } = "";
    public int MaxLength { get; set; }
}
```

#### 2. `MediaAIService.cs` — AI interaction logic

- Resolves AI profile by alias via `IAIProfileService`
- Cleans the filename (strip hyphens, underscores, stock photo noise) for use as a hint
- Builds a single ChatMessage with image bytes (`DataContent`) + combined prompt (`TextContent`) including filename hint
- Asks AI to return JSON with keys matching property aliases, plus a `title` key
- Parses response, truncates to MaxLength as safety net
- Returns `Dictionary<string, string>?` (null on failure)

#### 3. `MediaAIComposer.cs` — Registration

- Binds `MediaAIOptions` from config
- Registers `MediaAIService` as scoped
- Auto-discovered by `.AddComposers()`

### Backoffice extension (frontend) — entity action

#### 4. Entity action: "Generate AI Metadata"

- Custom Umbraco backoffice entity action for media items
- Appears in the entity actions menu (three dots, top-right)
- On click: calls a custom API endpoint that triggers `MediaAIService`
- Shows a loading state while AI processes
- Refreshes the media item view after completion
- Only appears on media types that have config in `MediaAI.MediaTypes`

#### 5. Custom API controller

- Receives the media item ID
- Reads the image, calls `MediaAIService`
- Updates the media properties and optionally renames the node
- Returns the results so the UI can refresh

## File to Modify

### `appsettings.json` — Add config section

```json
"Umbootstrap": {
  "MediaAI": {
    "ProfileAlias": "media-descriptions",
    "MediaTypes": [
      {
        "Alias": "imageResponsive",
        "RenameNode": true,
        "Fields": [
          {
            "PropertyAlias": "mediaPropertyTitle",
            "Prompt": "Write a short descriptive title for this image, 5-10 words. Do not prefix with 'Image of'.",
            "MaxLength": 100
          },
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
    ]
  }
}
```

## Key Technical Notes

- **Image size limit** — Anthropic API has a 5MB limit. Use an existing ImageCropper crop (e.g. 768x432) or resize with SixLabors.ImageSharp (already in the project) before sending to the API
- **umbracoFile is ImageCropper JSON** — need to parse `{"src":"/media/...","crops":[...]}` to get the file path and available crops
- **AI response format** — prompt asks for raw JSON, service strips markdown fencing if present
- **Image in ChatMessage** — use `DataContent` part in the user message (standard Microsoft.Extensions.AI approach)
- **Filename cleaning** — strip hyphens, underscores, common stock photo patterns (unsplash IDs, photographer names after last hyphen group), file extensions
- **Node rename sanitisation** — strip special characters (apostrophes, accents, commas) from AI title before setting as node name
- **No re-entrancy concerns** — entity action is a deliberate user click via API, not a notification handler
- **Existing property actions kept** — editors can still regenerate individual fields via the per-field prompt buttons

## Implementation Order

- [ ] Create `MediaAIOptions.cs`
- [ ] Create `MediaAIService.cs`
- [ ] Create `MediaAIComposer.cs`
- [ ] Create custom API controller
- [ ] Create backoffice entity action (Lit/TypeScript)
- [ ] Add config to `appsettings.json`
- [ ] Build and test

## Decisions

- **Entity action, not auto-on-upload** — editor clicks a button after seeing the image. Safer, simpler, editor stays in control.
- **Keep backoffice property action prompts** — editors can re-generate individual fields if they don't like the AI output.
- **Log warning once** — if no AI profile is configured (e.g. fresh template install), log a single warning so the site owner knows AI is available but not set up.
- **Multi-media-type support** — config supports different field sets per media type. Adding a new media type = adding a JSON entry.
- **Filename as AI hint** — the original filename (cleaned) is passed to the AI as context alongside the image.
- **Node rename** — AI-generated title (sanitised) replaces the filename as the media node name.

## Verification

1. Build the solution — should compile cleanly
2. Upload a new `imageResponsive` image
3. Click "Generate AI Metadata" from entity actions menu
4. Check that title, description, alt text are populated and node is renamed
5. Verify existing values are overwritten (this is a deliberate action, not auto)
6. Check terminal for any errors during the process
7. Test with a media type not in the config — entity action should not appear
