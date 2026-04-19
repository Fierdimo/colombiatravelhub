import type { Locale } from '../domain/models';

export type TranslationMap = Record<string, string>;

export interface ITranslationRepository {
  getTranslations(locale: Locale): TranslationMap;
}
