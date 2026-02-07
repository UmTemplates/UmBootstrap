using System.Reflection;
using Umbraco.Cms.Web.Common.PublishedModels;
using Umbraco.Community.BlockPreview.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
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
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();


app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();