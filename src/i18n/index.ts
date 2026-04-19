import type { Locale } from '../core/domain/models';
import { LOCALES, DEFAULT_LOCALE } from './locales';
import { es } from './translations/es';
import { en } from './translations/en';

const translations: Record<Locale, Record<string, string>> = {
  es,
  en,
};

/** Returns a translation function bound to the given locale. Falls back to the key if not found. */
export function useTranslations(locale: Locale) {
  const dict = translations[locale] ?? translations[DEFAULT_LOCALE];
  return function t(key: string): string {
    return dict[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
  };
}

/** Derives the locale from a URL pathname. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if ((LOCALES as readonly string[]).includes(first)) {
    return first as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns a localized path.
 * The default locale ('es') has no prefix → '/cartagena/tours'
 * Other locales get a prefix   → '/en/cartagena/tours'
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}
