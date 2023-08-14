using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Umbootstrap.Web.Extensions
{
    public static class PublishedContentExtensions
    {
        public static Dictionary<string, string> GetBlocksWithGroupNames(this IPublishedContent contentItem, string gridAlias)
        {
            var blocks = new Dictionary<string, string>();

            var contentProperty = contentItem.Properties.FirstOrDefault(x => x.Alias == gridAlias);
            if (contentProperty == null) return blocks;

            var config = contentProperty.PropertyType.DataType.Configuration as BlockGridConfiguration;
            if (config == null || config.BlockGroups == null) return blocks;

            var blockGroupDictionary = config.BlockGroups.ToDictionary(item => item.Key.ToString(), item => item.Name);

            foreach (var item in config.Blocks)
            {
                blocks.Add(item.ContentElementTypeKey.ToString(), blockGroupDictionary.GetValue(item.GroupKey));
            }

            return blocks;
        }
    }
}
