---
title: Demo Site Deployment
---

The UmBootstrap demo site is a live Umbraco website hosted on UmbHost. It showcases all the features, layouts, and content included in the starter kit. When changes are merged to `main`, the site is automatically deployed via the `RELEASE.yml` GitHub Actions workflow.

## The Problem

UmBootstrap uses [uSync](/UmBootstrap/maintenance/packages/usync/) to serialise Umbraco content and configuration to flat files. These files need to be imported into the database when the demo site is deployed. However, the approach must differ between the demo site and end users who install UmBootstrap via `dotnet new`:

| Scenario | Requirement |
|----------|-------------|
| **End users** (`dotnet new`) | Import content once on first boot, then never again |
| **Demo site** (UmbHost) | Import content on every deployment, but not on restarts |

## uSync Import Mechanisms

uSync provides three separate mechanisms for controlling imports:

### ImportOnFirstBoot

A one-time migration that runs when Umbraco is first installed. Once it has fired, enabling it on an already-running site has no effect.

```json
"uSync": {
    "Settings": {
        "ImportOnFirstBoot": true
    }
}
```

This is configured in `appsettings.json` and is what **end users** get. It imports all uSync content on the very first boot, setting up the complete starter kit, and never runs again.

### ImportAtStartup

Imports uSync content every time Umbraco boots. Takes a group value: `"All"`, `"Settings"`, `"Content"`, or `"None"`.

```json
"uSync": {
    "Settings": {
        "ImportAtStartup": "All"
    }
}
```

On its own, this would reimport everything on every restart — which is too aggressive. It is used in combination with the once/stop file mechanism below.

### Once and Stop Files

Control files that gate the `ImportAtStartup` behaviour:

- **`usync.once`** — When present in the uSync folder, uSync performs an import at startup, then renames the file to `usync.stop`
- **`usync.stop`** — When present, uSync skips the import even if `ImportAtStartup` is enabled

This creates a one-import-per-deployment flow:

1. Deploy the site with a `usync.once` file
2. On startup, uSync imports and renames the file to `usync.stop`
3. Subsequent restarts skip imports due to the stop file
4. Next deployment includes a fresh `usync.once`, overwriting the stop file

Reference: [uSync Once/Stop Files Documentation](https://docs.jumoo.co.uk/usync/uSync/guides/once/)

## How UmBootstrap Implements This

### For End Users (dotnet new template)

`appsettings.json` contains only the first-boot setting:

```json
"uSync": {
    "Settings": {
        "ImportOnFirstBoot": true
    }
}
```

No `ImportAtStartup`, no once file, no stop file. Clean and safe — content imports once, uSync stays installed for the user's own needs.

### For the Demo Site (UmbHost)

Two additional files handle deployment imports, both **excluded from the dotnet new template**:

**`appsettings.Production.json`** — Enables startup imports in the Production environment only:

```json
{
    "uSync": {
        "Settings": {
            "ImportAtStartup": "All"
        }
    }
}
```

**.NET configuration layering** means this merges on top of `appsettings.json` at runtime. The Production environment is set automatically on UmbHost.

**`uSync/v17/usync.once`** — An empty file that triggers one import per deployment. After import, uSync renames it to `usync.stop`, preventing imports on subsequent restarts.

### Template Exclusions

Both files are excluded from the `dotnet new` template in `.template.config/template.json`:

```json
"exclude": [
    "umbraco/Logs/**",
    "umbraco/Data/**",
    "umbraco/Licenses/**",
    "appsettings.Production.json",
    "uSync/v17/usync.once"
]
```

## Configuration Files Summary

| File | Ships to End Users | Purpose |
|------|-------------------|---------|
| `appsettings.json` | Yes | `ImportOnFirstBoot: true` — one-time setup |
| `appsettings.Production.json` | No | `ImportAtStartup: "All"` — enables per-deployment import |
| `uSync/v17/usync.once` | No | Triggers one import, then becomes `usync.stop` |

:::caution
If `ImportAtStartup` is enabled without a stop file mechanism, uSync will reimport everything on every restart. This could overwrite content changes made in the backoffice. The once/stop file pattern prevents this.
:::

## Troubleshooting

### Content not updating after deployment

Check that:
1. `appsettings.Production.json` exists and contains `"ImportAtStartup": "All"`
2. The `usync.once` file is present in `uSync/v17/` in the deployed output
3. The `ASPNETCORE_ENVIRONMENT` is set to `Production` on UmbHost

### Content reimporting on every restart

This would happen if:
- The `usync.once` file is not being renamed to `usync.stop` after import
- The deployment is overwriting the `usync.stop` file with a fresh `usync.once` on every restart (this should only happen on deployment, not restarts)
