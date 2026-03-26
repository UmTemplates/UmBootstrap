---
title: Contentment
description: Contentment provides custom data sources and property editors used by several UmBootstrap features.
---

[Contentment](https://github.com/leekelleher/umbraco-contentment) is a community package that provides custom data sources and property editors. UmBootstrap uses it for features that need dynamic data pickers.

## Version

UmBootstrap uses **Contentment v6.1.1**.

## How It's Used

### Data List with Custom Data Source

The [Navigation - In Page](/UmBootstrap/features/navigation-in-page/) feature uses a Contentment Data List with a custom `FeatureBlockDataSource` (C# class implementing `IContentmentDataSource`). This data source scans all block grid properties on the current page and returns feature blocks as selectable items in an Item Picker.

### Request Body Buffering

Contentment's API sends the current document's GUID in the POST request body. To read this, `Program.cs` includes `EnableBuffering()` middleware for Contentment API paths:

```csharp
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/umbraco/management/api/v1/contentment"))
    {
        context.Request.EnableBuffering();
    }
    await next();
});
```

### Data Source Registration

Custom data sources are registered by their fully qualified type name:

```
Namespace.ClassName, AssemblyName
```

For example: `Umbootstrap.Web.DataSources.FeatureBlockDataSource, Umbootstrap.Web`

## Known Limitations

- `IContentmentContentContext.GetCurrentContentId()` returns `0` in Umbraco 17 (the API sends a GUID, not an integer ID). The workaround is to read the document GUID from the POST request body.
- The Item Picker does not currently render group headings, though `DataListItem.Group` is populated ready for when it does.

## Links

- [Contentment on GitHub](https://github.com/leekelleher/umbraco-contentment)
- [Contentment on NuGet](https://www.nuget.org/packages/Umbraco.Community.Contentment)
