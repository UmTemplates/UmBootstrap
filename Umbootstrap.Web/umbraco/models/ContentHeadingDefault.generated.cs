//------------------------------------------------------------------------------
// <auto-generated>
//   This code was generated by a tool.
//
//    Umbraco.ModelsBuilder.Embedded v16.0.0+9812630
//
//   Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Linq.Expressions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Infrastructure.ModelsBuilder;
using Umbraco.Cms.Core;
using Umbraco.Extensions;

namespace Umbraco.Cms.Web.Common.PublishedModels
{
	// Mixin Content Type with alias "contentHeadingDefault"
	/// <summary>Page Properties</summary>
	public partial interface IContentHeadingDefault : IPublishedElement
	{
		/// <summary>Page Description</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		string PageDescription { get; }

		/// <summary>Page Thumbnail</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		global::Umbraco.Cms.Core.Models.MediaWithCrops PageThumbnail { get; }

		/// <summary>Page Title</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		string PageTitle { get; }

		/// <summary>Page Title Short</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		string PageTitleShort { get; }
	}

	/// <summary>Page Properties</summary>
	[PublishedModel("contentHeadingDefault")]
	public partial class ContentHeadingDefault : PublishedElementModel, IContentHeadingDefault
	{
		// helpers
#pragma warning disable 0109 // new is redundant
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		public new const string ModelTypeAlias = "contentHeadingDefault";
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public new static IPublishedContentType GetModelContentType(IPublishedContentTypeCache contentTypeCache)
			=> PublishedModelUtility.GetModelContentType(contentTypeCache, ModelItemType, ModelTypeAlias);
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static IPublishedPropertyType GetModelPropertyType<TValue>(IPublishedContentTypeCache contentTypeCache, Expression<Func<ContentHeadingDefault, TValue>> selector)
			=> PublishedModelUtility.GetModelPropertyType(GetModelContentType(contentTypeCache), selector);
#pragma warning restore 0109

		private IPublishedValueFallback _publishedValueFallback;

		// ctor
		public ContentHeadingDefault(IPublishedElement content, IPublishedValueFallback publishedValueFallback)
			: base(content, publishedValueFallback)
		{
			_publishedValueFallback = publishedValueFallback;
		}

		// properties

		///<summary>
		/// Page Description: This will appear in pages
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("pageDescription")]
		public virtual string PageDescription => GetPageDescription(this, _publishedValueFallback);

		/// <summary>Static getter for Page Description</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static string GetPageDescription(IContentHeadingDefault that, IPublishedValueFallback publishedValueFallback) => that.Value<string>(publishedValueFallback, "pageDescription");

		///<summary>
		/// Page Thumbnail: This will appear in navigation
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("pageThumbnail")]
		public virtual global::Umbraco.Cms.Core.Models.MediaWithCrops PageThumbnail => GetPageThumbnail(this, _publishedValueFallback);

		/// <summary>Static getter for Page Thumbnail</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static global::Umbraco.Cms.Core.Models.MediaWithCrops GetPageThumbnail(IContentHeadingDefault that, IPublishedValueFallback publishedValueFallback) => that.Value<global::Umbraco.Cms.Core.Models.MediaWithCrops>(publishedValueFallback, "pageThumbnail");

		///<summary>
		/// Page Title: This will appear in pages
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("pageTitle")]
		public virtual string PageTitle => GetPageTitle(this, _publishedValueFallback);

		/// <summary>Static getter for Page Title</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static string GetPageTitle(IContentHeadingDefault that, IPublishedValueFallback publishedValueFallback) => that.Value<string>(publishedValueFallback, "pageTitle");

		///<summary>
		/// Page Title Short: This will appear in navigation
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("pageTitleShort")]
		public virtual string PageTitleShort => GetPageTitleShort(this, _publishedValueFallback);

		/// <summary>Static getter for Page Title Short</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "16.0.0+9812630")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static string GetPageTitleShort(IContentHeadingDefault that, IPublishedValueFallback publishedValueFallback) => that.Value<string>(publishedValueFallback, "pageTitleShort");
	}
}
