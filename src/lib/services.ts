/**
 * Composition root — wires concrete adapters to services.
 * Pages and layouts import from here; they never import adapters directly.
 *
 * affiliateService is lazy-initialised because the adapters use async factories
 * that may call external APIs at build time. Use `getAffiliateService()` in pages.
 */
import { AstroContentAdapter } from '../adapters/content/AstroContentAdapter';
import { FileTranslationAdapter } from '../adapters/i18n/FileTranslationAdapter';
import { CivitatisAdapter } from '../adapters/affiliates/CivitatisAdapter';
import { GetYourGuideAdapter } from '../adapters/affiliates/GetYourGuideAdapter';
import { ContentService } from '../core/services/ContentService';
import { AffiliateService } from '../core/services/AffiliateService';
import { SeoService } from '../core/services/SeoService';
import { I18nService } from '../core/services/I18nService';

export const contentService = new ContentService(new AstroContentAdapter());

export const seoService = new SeoService();

export const i18nService = new I18nService(new FileTranslationAdapter());

// ---------------------------------------------------------------------------
// Affiliate service — async singleton (adapters may fetch from APIs at build)
// ---------------------------------------------------------------------------
let _affiliateService: AffiliateService | null = null;

export async function getAffiliateService(): Promise<AffiliateService> {
  if (_affiliateService) return _affiliateService;

  const [civitatis, gyg] = await Promise.all([
    CivitatisAdapter.create(),
    GetYourGuideAdapter.create(),
  ]);

  _affiliateService = new AffiliateService([civitatis, gyg]);
  return _affiliateService;
}
