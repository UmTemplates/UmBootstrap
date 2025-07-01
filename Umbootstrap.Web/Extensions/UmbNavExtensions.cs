//using Umbraco.Cms.Core.Models.PublishedContent;
//using Umbraco.Community.UmbNav.Core.Models;

//namespace Umbootstrap.Web.Extensions;

//public static class UmbNavExtensions
//{
//    public static bool IsActive(this UmbNavItem item,
//        IPublishedContent? currentPage, int minLevel)
//    {
//        var contentKey = item.ContentKey ?? item.Content?.Key;
        
//        if (contentKey is null || currentPage is null) return false;
        
//        var key = currentPage.Key;
        
//        if (contentKey.Value == key)
//        {
//            return true;
//        }

//        if (currentPage.Level > minLevel)
//        {
//            return currentPage.Ancestors().Any(x => x.Level >= minLevel
//            && x.Key == contentKey.GetValueOrDefault());
//        }
        
//        return false;
//    }
//}