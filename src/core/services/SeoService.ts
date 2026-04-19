import type { HreflangEntry, Locale, SeoMetadata } from '../domain/models';

interface BuildMetadataOptions {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageAlt: string;
  alternates?: HreflangEntry[];
}

export class SeoService {
  buildMetadata(opts: BuildMetadataOptions): SeoMetadata {
    return {
      title: opts.title,
      description: opts.description,
      canonical: opts.canonical,
      ogImage: opts.ogImage,
      ogImageAlt: opts.ogImageAlt,
      alternates: opts.alternates ?? [],
    };
  }

  buildCanonical(siteUrl: string, locale: Locale, path: string): string {
    const prefix = locale === 'es' ? '' : `/${locale}`;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${siteUrl}${prefix}${normalizedPath}`;
  }

  buildHreflang(siteUrl: string, path: string, availableLocales: Locale[]): HreflangEntry[] {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const entries: HreflangEntry[] = availableLocales.map((locale) => ({
      locale,
      url: locale === 'es' ? `${siteUrl}${normalizedPath}` : `${siteUrl}/${locale}${normalizedPath}`,
    }));
    // x-default always points to the default (es) version
    entries.push({ locale: 'x-default', url: `${siteUrl}${normalizedPath}` });
    return entries;
  }
}
