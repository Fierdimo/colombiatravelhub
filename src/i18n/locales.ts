import type { Locale } from '../core/domain/models';

export const LOCALES = ['es', 'en'] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = 'es';
