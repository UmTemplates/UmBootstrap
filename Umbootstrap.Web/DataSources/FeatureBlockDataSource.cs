using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Web;
using Umbraco.Community.Contentment.DataEditors;
using Umbraco.Community.Contentment.Services;
using Umbraco.Extensions;

namespace Umbootstrap.Web.DataSources;

public sealed class FeatureBlockDataSource : IContentmentDataSource
{
    private readonly IContentmentContentContext _contentContext;
    private readonly IUmbracoContextAccessor _umbracoContextAccessor;
    private readonly ILogger<FeatureBlockDataSource> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FeatureBlockDataSource(
        IContentmentContentContext contentContext,
        IUmbracoContextAccessor umbracoContextAccessor,
        ILogger<FeatureBlockDataSource> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _contentContext = contentContext;
        _umbracoContextAccessor = umbracoContextAccessor;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    public string Name => "Feature Blocks";

    public string Description => "Lists feature blocks on the current page.";

    public string Icon => "icon-anchor";

    public string Group => "UmBootstrap";

    public IEnumerable<ContentmentConfigurationField> Fields => [];

    public Dictionary<string, object>? DefaultValues => default;

    public OverlaySize OverlaySize => OverlaySize.Small;

    public IEnumerable<DataListItem> GetItems(Dictionary<string, object> config)
    {
        // Log everything in the config dictionary to see what Contentment passes us
        foreach (var kvp in config)
            _logger.LogInformation("FeatureBlockDataSource config: {Key}={Value} (type={Type})", kvp.Key, kvp.Value, kvp.Value?.GetType().Name);

        if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
        {
            _logger.LogWarning("FeatureBlockDataSource: no UmbracoContext available");
            return [];
        }

        var content = ResolveCurrentContent(umbracoContext);
        if (content is null)
            return [];

        var blockGrid = content.Value<BlockGridModel>("contentGrid");
        if (blockGrid is null)
        {
            _logger.LogWarning("FeatureBlockDataSource: no blockGrid on page {Name}", content.Name);
            return [];
        }

        var features = new List<DataListItem>();
        CollectFeatureBlocks(blockGrid, features);
        _logger.LogInformation("FeatureBlockDataSource: found {Count} feature blocks on {Page}", features.Count, content.Name);
        return features;
    }

    private IPublishedContent? ResolveCurrentContent(IUmbracoContext umbracoContext)
    {
        // Try Contentment's context first (works when integer ID is available)
        var contentId = _contentContext.GetCurrentContentId(out _);
        if (contentId is > 0)
        {
            var byId = umbracoContext.Content?.GetById(contentId.Value);
            if (byId is not null)
                return byId;
        }

        // Fallback: read the document GUID from the Contentment API request body
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is null)
            return null;

        // The request body has already been read by the framework, so check if it was buffered
        if (httpContext.Items.TryGetValue("contentment:id", out var idObj) && idObj is string idStr)
        {
            if (Guid.TryParse(idStr, out var key))
                return umbracoContext.Content?.GetById(key);
        }

        // Try reading from request body (Contentment posts { id: "guid", ... })
        try
        {
            httpContext.Request.Body.Position = 0;
            using var reader = new StreamReader(httpContext.Request.Body, leaveOpen: true);
            var body = reader.ReadToEndAsync().GetAwaiter().GetResult();
            httpContext.Request.Body.Position = 0;

            if (!string.IsNullOrEmpty(body))
            {
                using var doc = JsonDocument.Parse(body);
                if (doc.RootElement.TryGetProperty("id", out var idProp))
                {
                    var guidStr = idProp.GetString();
                    _logger.LogInformation("FeatureBlockDataSource: extracted id={Id} from request body", guidStr);
                    if (Guid.TryParse(guidStr, out var key))
                        return umbracoContext.Content?.GetById(key);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "FeatureBlockDataSource: failed to read request body");
        }

        return null;
    }

    private static void CollectFeatureBlocks(BlockGridModel grid, List<DataListItem> items)
    {
        foreach (var block in grid)
        {
            var alias = block.Content.ContentType.Alias;

            if (alias.StartsWith("feature", StringComparison.OrdinalIgnoreCase))
            {
                var title = block.Content.Value<string>("featurePropertyFeatureTitle");
                items.Add(new DataListItem
                {
                    Name = !string.IsNullOrWhiteSpace(title) ? title : alias,
                    Value = block.ContentKey.ToString(),
                });
            }

            foreach (var area in block.Areas)
            {
                foreach (var nested in area)
                {
                    var nestedAlias = nested.Content.ContentType.Alias;

                    if (nestedAlias.StartsWith("feature", StringComparison.OrdinalIgnoreCase))
                    {
                        var nestedTitle = nested.Content.Value<string>("featurePropertyFeatureTitle");
                        items.Add(new DataListItem
                        {
                            Name = !string.IsNullOrWhiteSpace(nestedTitle) ? nestedTitle : nestedAlias,
                            Value = nested.ContentKey.ToString(),
                        });
                    }
                }
            }
        }
    }
}
