using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Web.Common.PublishedModels;
using Umbraco.Community.BlockPreview;
using Umbraco.Community.BlockPreview.Extensions;

namespace Umbootstrap.Web.BlockPreviews;

public class BlockPreviewComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddBlockPreview(options =>
        {
            options.BlockGrid = new BlockWithStylesheetSettings
            {
                Enabled = true,
                ContentTypes =
                [
                    FeaturePageTitleDescription.ModelTypeAlias,
                    FeatureRichTextEditor.ModelTypeAlias,
                    FeatureImage.ModelTypeAlias,
                    FeatureInternalLinksChildren.ModelTypeAlias,
                    FeatureInternalLinks.ModelTypeAlias,
                    FeatureInternalLinksSlideshow.ModelTypeAlias,
                    FeatureNavigationDescendants.ModelTypeAlias,
                    FeatureInternalLinks.ModelTypeAlias,
                    FeatureFaqs.ModelTypeAlias,
                    FeatureTabs.ModelTypeAlias,
                    FeatureHtml.ModelTypeAlias,
                    FeatureCode.ModelTypeAlias,
                    FeatureFormContactUs.ModelTypeAlias
                ],
                Stylesheet = "/css/Index.css"
            };
            options.BlockList = new BlockWithStylesheetSettings
            {
                Enabled = false
            };
        });
    }
}