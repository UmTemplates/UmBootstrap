---
title: Umbraco MCP Server
---

The [Umbraco MCP Server](https://www.npmjs.com/package/@anthropic-ai/umbraco-mcp) (`@umbraco-cms/mcp-dev`) provides AI assistants with direct access to the Umbraco backoffice API. It enables reading and writing documents, document types, data types, and media without manual backoffice interaction.

## Setup

The MCP server requires a running Umbraco instance and an API user with appropriate permissions.

```json
// .mcp.json (project root, gitignored)
{
  "mcpServers": {
    "umbraco-mcp": {
      "command": "umbraco",
      "args": ["--baseUrl", "https://localhost:44395", "--clientId", "your-client-id", "--clientSecret", "your-secret"],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

**Important**: Umbraco must be running before starting Claude Code. If the site is down at startup, the MCP server fails and won't reconnect mid-session.

## Common Operations

### Reading Documents

Use `get-document-by-id` to fetch a document's full structure including block grid content, settings, layout, and metadata.

### Updating Block Properties

The `update-block-property` tool updates individual properties within block grid blocks without sending the entire JSON payload.

```
update-block-property(
  documentId: "<document-guid>",
  propertyAlias: "contentGrid",
  updates: [{
    contentKey: "<settings-block-key>",
    blockType: "settings",
    properties: [{
      alias: "featureSettingsEnableSticky",
      value: true
    }]
  }]
)
```

**Limitation**: This tool validates the property against the block's **current** `contentTypeKey`. If the block still uses an old element type that doesn't have the property, the call fails with "Property does not exist on Element Type". See [Migrating Block Settings Types](#migrating-block-settings-types) below.

### Updating Full Documents

Use `update-document` when you need to change block-level metadata (like `contentTypeKey`) that `update-block-property` can't modify. This requires sending the complete document payload.

**Always** read the document first with `get-document-by-id`, modify only what's needed, and send everything else back unchanged.

### Publishing

After any content update via MCP, the document enters a `PublishedPendingChanges` state. You must explicitly publish:

```
publish-document(
  id: "<document-guid>",
  data: { publishSchedules: [{ culture: null, schedule: null }] }
)
```

## Migrating Block Settings Types

When you change a feature's settings type in the Block Grid DataType configuration (e.g. from `featureSettings` to `featureSettingsNavigation`), **existing content blocks keep their old `contentTypeKey`**. The new type only applies when a block is opened and saved in the backoffice.

### The Problem

`update-block-property` validates properties against the block's current type. If you try to set a property that exists on the new type but not the old one, it fails.

### Solution: `update-document` with Type Swap

For each document:

1. **Read** the full document with `get-document-by-id`
2. **Find** the target settings block in `settingsData` by its key
3. **Change** its `contentTypeKey` from the old type to the new type
4. **Add** the new property value to the block's `values` array
5. **Save** with `update-document` (send the complete document)
6. **Publish** with `publish-document`

This was used to migrate all navigation blocks from `featureSettings` (`ec9f83f9`) to `featureSettingsNavigation` (`e85bbfdf`) across 38 pages.

### Bulk Updates

For large-scale migrations, the process can be automated by:
- Using subagents to process pages in parallel batches
- Each subagent reads a batch of documents, modifies the settings blocks, saves, and publishes
- The full migration of 38 pages took approximately 20 minutes via MCP

## Key Learnings

### Value Types Matter

MCP validates property values against the property editor type. A `Umbraco.TrueFalse` property requires a boolean (`true`/`false`), not a string (`"1"`/`"0"`).

### uSync Import Does Not Detect CDATA Changes

Editing JSON inside `<![CDATA[...]]>` blocks in uSync XML files and running an import does **not** push changes to the database. uSync likely checksums the whole CDATA value rather than deep-comparing JSON structures. Use MCP for runtime content changes; use uSync XML editing only for initial template setup (new installs).

### uSync Export Captures MCP Changes

After making changes via MCP, run a uSync **Export Everything** to capture the database state back to XML files. This ensures the template's uSync files stay in sync with what MCP wrote.

### Block Grid Settings Architecture

Each block in a block grid has:
- A **content entry** in `contentData` (the block's visible content)
- A **settings entry** in `settingsData` (editor configuration like colours, visibility)
- A **layout entry** in `Layout` that links `contentKey` to `settingsKey`

The `contentTypeKey` on a settings entry determines which element type it uses. Changing this key is how you migrate blocks from one settings type to another.
