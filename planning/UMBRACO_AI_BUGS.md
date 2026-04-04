# Umbraco AI — Bugs & Database Recovery

## GitHub Issue

Filed on [umbraco/Umbraco.AI](https://github.com/umbraco/Umbraco.AI) — persistence/display bugs on SQLite.

## Environment

| Package | Version |
|---------|---------|
| Umbraco.AI | 1.6.0 |
| Umbraco.AI.Prompt | 1.5.0 |
| Umbraco.AI.Anthropic | 1.2.2 |
| Umbraco.Cms | 17.2.2 |
| Database | SQLite |

## Bugs Found

### 1. Profile system prompt not persisting (intermittent)

- The "Media Descriptions" profile had a system prompt entered and saved via the backoffice UI
- The database stored it as `null`: `"systemPromptTemplate":null`
- Full Settings JSON: `{"temperature":0.3,"maxTokens":300,"systemPromptTemplate":null,"contextIds":[],"guardrailIds":[]}`
- Profile table: `umbracoAIProfile`
- Profile ID: `0A752E99-5E9B-44D5-B254-678F973BC89A`
- Profile alias: `media-descriptions`
- **Update**: After clean build, re-entering a system prompt DOES persist (tested with "hello world" and pirate prompt — both saved correctly). The original loss may have been caused by a specific action/sequence.

### 2. Alt text prompt not displaying in backoffice UI

- Two prompts exist in `umbracoAIPrompt` table
- `generate-image-description` (row 1) — displays correctly in UI
- `generate-image-alt-text` (row 2) — does NOT display in UI despite `IsActive = 1`
- Both prompts were fully functional before the issue — they successfully generated content via property action buttons
- Clean build + restart did NOT fix this

### 3. Profile system prompt not applied at execution time

- System prompt set to pirate speak test: `"You are a pirate. Always respond in pirate speak, starting every response with \"Arrr!\""`
- Confirmed persisted in database: `"systemPromptTemplate": "You are a pirate..."`
- Executed the description prompt on a media image — response was normal descriptive text with NO pirate speak
- **Second test**: Changed system prompt to `Always prefix your response with "Welcome to Tailored Travel!" followed by a line break.` — confirmed persisted in DB and displayed in UI
- Executed description prompt on Ely Cathedral image — response was a normal description with no "Welcome to Tailored Travel!" prefix
- **Conclusion**: The `systemPromptTemplate` on the profile is stored and displayed correctly but is completely ignored when executing prompts via the Prompt add-on. Confirmed with two separate tests (pirate speak and Tailored Travel prefix).

## Prompt Data Backup

### generate-image-description

- **ID**: `F777A194-31A7-4F03-ABF8-12B8E2D38711`
- **Name**: Generate Image Description (presumed — truncated in DB browser)
- **Version**: 6
- **IncludeEntityContext**: 1
- **DisplayMode**: 0
- **Scope**:
```json
{
  "allowRules": [
    {
      "propertyEditorUiAliases": null,
      "propertyAliases": ["mediaPropertyDescription"],
      "contentTypeAliases": ["imageResponsive"]
    }
  ],
  "denyRules": []
}
```
- **Instructions**:
```
{{image:umbracoFile}}

Look at the image above and write a factual description of it as if being described in a tourist destination sightseeing Description.
The description must be no less than 125 characters and no more than 155 characters
Return only the description text, nothing else.
```

### generate-image-alt-text

- **ID**: `FE9F8608-6F32-412F-BEEF-C5E88C7FE67D`
- **Name**: Generate Image Alt Text
- **Version**: 2
- **IncludeEntityContext**: 1
- **DisplayMode**: 0
- **Scope**:
```json
{
  "allowRules": [
    {
      "contentTypeAliases": ["imageResponsive"],
      "propertyAliases": ["mediaPropertyAltText"],
      "propertyEditorUiAliases": [
        "Umb.PropertyEditorUi.TextBox",
        "Umb.PropertyEditorUi.TextArea",
        "Umb.PropertyEditorUi.Tiptap",
        "Umb.PropertyEditorUi.MarkdownEditor"
      ]
    }
  ],
  "denyRules": []
}
```
- **Instructions**:
```
{{image:umbracoFile}}

Look at the image above and write concise alt text for it following WCAG accessibility guidelines. Describe the content and function of the image. Do not start with "Image of" or "Photo of". Keep it under 125 characters. Return only the alt text, nothing else.
```

## Recovery Plan

### Step 1: Back up description prompt instructions
```sql
SELECT Alias, Name, Description, Instructions FROM umbracoAIPrompt WHERE Alias = 'generate-image-description';
```
Copy the Instructions content and add it to this file above.

### Step 2: Delete the orphaned alt text prompt
1. **Stop Umbraco** first
2. Run:
```sql
DELETE FROM umbracoAIPrompt WHERE Alias = 'generate-image-alt-text';
```
3. Restart Umbraco

### Step 3: Recreate alt text prompt via backoffice UI
Use the backed-up data above to recreate the prompt through the normal UI.

### Step 4: Re-enter the profile system prompt
The system prompt was lost (`null`). Re-enter it via the backoffice profile editor.
Note: This may not persist due to the same bug. Monitor after saving.

## Relevant GitHub Issues

| Issue | Title | Relevance |
|-------|-------|-----------|
| [#85](https://github.com/umbraco/Umbraco.AI/issues/85) | OpenAI API Key failed to decrypt on app pool recycle | Data Protection key loss — could affect encrypted fields |
| [#89](https://github.com/umbraco/Umbraco.AI/issues/89) | SQLite Migration Failures | SQLite-specific table creation failures (not our issue — tables exist) |
| [#75](https://github.com/umbraco/Umbraco.AI/issues/75) | Cannot change connection alias | Known persistence bug (fixed) |
| [#24](https://github.com/umbraco/Umbraco.AI/issues/24) | Prompts require browser refresh | UI caching issue |

## SQL Queries for Investigation

```sql
-- View all profiles
SELECT * FROM umbracoAIProfile;

-- View profile settings (check systemPromptTemplate)
SELECT Settings FROM umbracoAIProfile;

-- View all prompts
SELECT * FROM umbracoAIPrompt;

-- Compare prompt scopes
SELECT Alias, Scope FROM umbracoAIPrompt;

-- Check prompt display properties
SELECT Alias, DisplayMode, Version, IsActive FROM umbracoAIPrompt;
```

## Database Tables (Umbraco AI)

All `umbracoAI*` tables exist and migrations ran successfully:
- `umbracoAIAuditLog`
- `umbracoAIConnection`
- `umbracoAIContext`
- `umbracoAIContextResource`
- `umbracoAIEntityVersion`
- `umbracoAIGuardrail`
- `umbracoAIGuardrailRule`
- `umbracoAIProfile`
- `umbracoAIPrompt`
- `umbracoAISettings`
- `umbracoAITest`
- `umbracoAITestRun`
- `umbracoAITestTranscript`
- `umbracoAIUsageRecord`
- `umbracoAIUsageStatisticsDaily`
- `umbracoAIUsageStatisticsHourly`
