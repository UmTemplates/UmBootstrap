---
title: uSync
---

| | |
|---|---|
| **Package** | uSync |
| **Version** | 17.6.2 |
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

## After an Umbraco upgrade: export, never import

Umbraco upgrades sometimes change built-in types. Umbraco 17.8 added Width and Height to the SVG media type.

After an upgrade, the database is right and the uSync files are out of date. Run a **Report**, then **Export**.

Importing would put the old definitions back and remove the new properties, on this site and on every new site created from the template.

See [Upgrading](/UmBootstrap/maintenance/upgrading/).

## uSync.Complete

| | |
|---|---|
| **Package** | uSync.Complete |
| **Version** | 17.7.2 |
| **Docs** | [docs.jumoo.co.uk](https://docs.jumoo.co.uk/) |

uSync.Complete is Jumoo's **commercial** add-on to uSync. It adds features such as publishing content between sites.

It installs on a **trial licence**. When the trial ends, the extra features stop, but free uSync keeps working. The first-boot import does not depend on it.

Whether uSync.Complete should stay in the template is still under review. New sites inherit it, and its trial expires on each of them.
