import type { ITranslationRepository, TranslationMap } from '../../core/ports/ITranslationRepository';
import type { Locale } from '../../core/domain/models';
import { es } from '../../i18n/translations/es';
import { en } from '../../i18n/translations/en';
import { pt } from '../../i18n/translations/pt';

const TRANSLATIONS: Record<Locale, TranslationMap> = {
  es,
  en,
  pt,
};

export class FileTranslationAdapter implements ITranslationRepository {
  getTranslations(locale: Locale): TranslationMap {
    return TRANSLATIONS[locale] ?? TRANSLATIONS['es'];
  }
}
