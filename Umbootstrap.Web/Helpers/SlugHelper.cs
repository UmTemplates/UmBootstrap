using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Umbootstrap.Web.Helpers;

public static partial class SlugHelper
{
    /// <summary>
    /// Generates a URL-safe slug for use as an HTML fragment identifier.
    /// Uses the title if available, otherwise falls back to the content type alias.
    /// Appends the first 4 characters of the content key GUID for collision resistance.
    /// </summary>
    public static string ToSlug(string? title, string alias, Guid contentKey)
    {
        var text = string.IsNullOrWhiteSpace(title) ? alias : title;
        var suffix = contentKey.ToString("N")[..4];

        var slug = StripDiacritics(text);
        slug = slug.ToLowerInvariant();
        slug = slug.Replace(' ', '-');
        slug = NonAlphanumericOrHyphen().Replace(slug, "");
        slug = ConsecutiveHyphens().Replace(slug, "-");
        slug = slug.Trim('-');

        return $"{slug}-{suffix}";
    }

    private static string StripDiacritics(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(normalized.Length);

        foreach (var c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex("[^a-z0-9-]")]
    private static partial Regex NonAlphanumericOrHyphen();

    [GeneratedRegex("-{2,}")]
    private static partial Regex ConsecutiveHyphens();
}
