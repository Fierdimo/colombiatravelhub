/**
 * localizeAffiliateUrl
 *
 * Rewrites affiliate URLs to include the visitor's locale so the destination
 * page renders in the correct language.
 *
 * Supported transformations:
 *
 * GetYourGuide — inserts locale path segment after the hostname:
 *   getyourguide.com/cartagena-l362/...  →  getyourguide.com/es-es/cartagena-l362/...
 *
 * Civitatis — replaces the language path segment:
 *   civitatis.com/es/cartagena-de-indias/...  →  civitatis.com/en/cartagena-de-indias/...
 *
 * Viator — appends a `language` query parameter:
 *   viator.com/search?text=...  →  viator.com/search?text=...&language=es
 *
 * Returns the original URL unchanged when no transformation applies.
 */
import type { Locale } from '../core/domain/models';

/** Maps our app locale to the GYG locale path segment */
const GYG_LOCALE: Record<Locale, string> = {
  es: 'es-es',
  en: 'en-us',
  pt: 'pt-br',
};

/** Maps our app locale to the Civitatis language path segment */
const CIVITATIS_LOCALE: Record<Locale, string> = {
  es: 'es',
  en: 'en',
  pt: 'pt',
};

/** Maps our app locale to the Viator language query value */
const VIATOR_LOCALE: Record<Locale, string> = {
  es: 'es',
  en: 'en',
  pt: 'pt',
};

export function localizeAffiliateUrl(url: string, locale: Locale): string {
  try {
    const parsed = new URL(url);
    const { hostname } = parsed;

    // ── GetYourGuide ────────────────────────────────────────────────────────
    if (hostname.includes('getyourguide.com')) {
      const seg = GYG_LOCALE[locale];
      // Only insert if there's no locale segment already (e.g. /es-es/ or /en-us/)
      if (!parsed.pathname.match(/^\/[a-z]{2}-[a-z]{2}\//)) {
        parsed.pathname = `/${seg}${parsed.pathname}`;
      }
      return parsed.toString();
    }

    // ── Civitatis ───────────────────────────────────────────────────────────
    if (hostname.includes('civitatis.com')) {
      const targetLang = CIVITATIS_LOCALE[locale];
      // Civitatis URL structure: /es/destination/slug/
      // Replace the first path segment (language code)
      parsed.pathname = parsed.pathname.replace(/^\/[a-z]{2}\//, `/${targetLang}/`);
      return parsed.toString();
    }

    // ── Viator ──────────────────────────────────────────────────────────────
    if (hostname.includes('viator.com')) {
      const lang = VIATOR_LOCALE[locale];
      if (!parsed.searchParams.has('language')) {
        parsed.searchParams.set('language', lang);
      }
      return parsed.toString();
    }
  } catch {
    // Malformed URL — return as-is
  }

  return url;
}
