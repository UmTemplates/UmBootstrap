# uSync

| | |
|---|---|
| **Package** | uSync |
| **Version** | 17.0.2 |
| **Source** | [GitHub](https://github.com/KevinJump/uSync) |
| **Docs** | [docs.jumoo.co.uk/usync](https://docs.jumoo.co.uk/usync/) |

## What It Does

uSync serialises Umbraco configuration and content to disk as files. This allows document types, data types, templates, content, and other Umbraco settings to be stored in source control and shared across environments.

## How UmBootstrap Uses It

UmBootstrap uses uSync to ship the starter kit's content and configuration. The sync files live in `uSync/v17/` and are imported automatically on first boot:

```json
{
  "uSync": {
    "Settings": {
      "ImportOnFirstBoot": true
    }
  }
}
```

This means when a new project is created from the template, all document types, data types, content, and media are set up automatically without manual configuration.

## What Gets Synced

The `uSync/v17/` folder contains:

- **ContentTypes** — Document types and element types
- **DataTypes** — Property editor configurations
- **Content** — Sample pages and content
- **Media** — Uploaded media items
- **MediaTypes** — Media type definitions
- **Templates** — Razor view registrations
- **Languages** — Language configurations
