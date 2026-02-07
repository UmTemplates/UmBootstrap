# BlockPreview

| | |
|---|---|
| **Package** | Umbraco.Community.BlockPreview |
| **Version** | 5.2.1 |
| **Source** | [GitHub](https://github.com/rickbutterfield/Umbraco.Community.BlockPreview) |

## What It Does

BlockPreview renders live previews of block grid and block list components directly in the Umbraco backoffice. Instead of seeing generic block placeholders, content editors see a rendered preview of each block using the same Razor partial views as the front end.

## How UmBootstrap Uses It

BlockPreview is configured **programmatically** in `Program.cs`. At startup, reflection is used to scan all ModelsBuilder-generated types and automatically exclude any whose alias starts with `"layout"` via `IgnoredContentTypes`:

```csharp
.AddBlockPreview(options =>
{
    var layoutAliases = typeof(Layout12).Assembly.GetTypes()
        .Where(t => t.Namespace == "Umbraco.Cms.Web.Common.PublishedModels")
        .Select(t => t.GetField("ModelTypeAlias",
            BindingFlags.Public | BindingFlags.Static)?.GetValue(null) as string)
        .Where(alias => alias != null && alias.StartsWith("layout"))
        .ToList();

    options.BlockGrid = new()
    {
        Enabled = true,
        IgnoredContentTypes = layoutAliases!,
        Stylesheets = ["/css/Index.css"]
    };
})
```

Layout elements (`layout12`, `layout66`, etc.) are automatically excluded — they only contain areas and don't need previews. All feature element types get previews automatically.

## Adding Previews for New Blocks

When you create a new feature element type:

1. Create the Razor partial view in `Views/Partials/blockgrid/`
2. That's it — BlockPreview will automatically include it

New layout types are also handled automatically as long as they follow the `layout*` naming convention.
