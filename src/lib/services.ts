/**
 * Composition root — wires concrete adapters to services.
 * Pages and layouts import from here; they never import adapters directly.
 *
 * affiliateService is lazy-initialised because the adapters use async factories
 * that may call external APIs at build time. Use `getAffiliateService()` in pages.
 *
 * Affiliate keys are resolved at build time via Firebase Remote Config.
 * EnvConfigAdapter is used as a fallback for local development when Firebase
 * credentials are not configured. Affiliate adapters return null when their key
 * is absent — those providers are silently omitted from every page.
 */
import { AstroContentAdapter } from '../adapters/content/AstroContentAdapter';
import { FileTranslationAdapter } from '../adapters/i18n/FileTranslationAdapter';
import { CivitatisAdapter } from '../adapters/affiliates/CivitatisAdapter';
import { GetYourGuideAdapter } from '../adapters/affiliates/GetYourGuideAdapter';
import { ViatorAdapter } from '../adapters/affiliates/ViatorAdapter';
import { FirebaseRemoteConfigAdapter } from '../adapters/config/FirebaseRemoteConfigAdapter';
import { EnvConfigAdapter } from '../adapters/config/EnvConfigAdapter';
import { ContentService } from '../core/services/ContentService';
import { AffiliateService } from '../core/services/AffiliateService';
import { SeoService } from '../core/services/SeoService';
import { I18nService } from '../core/services/I18nService';
import type { IAffiliateRepository } from '../core/ports/IAffiliateRepository';

export const contentService = new ContentService(new AstroContentAdapter());

export const seoService = new SeoService();

export const i18nService = new I18nService(new FileTranslationAdapter());

// ---------------------------------------------------------------------------
// Affiliate service — async singleton (adapters may fetch from APIs at build)
// ---------------------------------------------------------------------------
let _affiliateService: AffiliateService | null = null;

export async function getAffiliateService(): Promise<AffiliateService> {
  if (_affiliateService) return _affiliateService;

  // Firebase Remote Config is the primary source of affiliate keys.
  // Falls back to env vars when FIREBASE_* credentials are not set (local dev).
  const config = (await FirebaseRemoteConfigAdapter.create()) ?? new EnvConfigAdapter();

  const results = await Promise.all([
    CivitatisAdapter.create(config),
    GetYourGuideAdapter.create(config),
    ViatorAdapter.create(config),
  ]);

  // Filter out providers whose keys were not configured
  const activeAdapters = results.filter((a): a is IAffiliateRepository => a !== null);

  _affiliateService = new AffiliateService(activeAdapters);
  return _affiliateService;
}
