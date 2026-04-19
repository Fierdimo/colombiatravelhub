import type { ITranslationRepository } from '../ports/ITranslationRepository';
import type { Locale } from '../domain/models';
import { LOCALES, DEFAULT_LOCALE } from '../../i18n/locales';

export class I18nService {
  constructor(private readonly repo: ITranslationRepository) {}

  useTranslations(locale: Locale): (key: string) => string {
    const dict = this.repo.getTranslations(locale);
    const fallback = this.repo.getTranslations(DEFAULT_LOCALE);
    return (key: string): string => dict[key] ?? fallback[key] ?? key;
  }

  getLocaleFromUrl(url: URL): Locale {
    const [, first] = url.pathname.split('/');
    if ((LOCALES as readonly string[]).includes(first)) {
      return first as Locale;
    }
    return DEFAULT_LOCALE;
  }

  getLocalizedPath(path: string, locale: Locale): string {
    if (locale === DEFAULT_LOCALE) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${normalizedPath}`;
  }
}
