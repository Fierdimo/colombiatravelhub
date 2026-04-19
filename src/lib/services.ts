/**
 * Composition root — wires concrete adapters to services.
 * Pages and layouts import from here; they never import adapters directly.
 */
import { AstroContentAdapter } from '../adapters/content/AstroContentAdapter';
import { FileTranslationAdapter } from '../adapters/i18n/FileTranslationAdapter';
import { ViatorAdapter } from '../adapters/affiliates/ViatorAdapter';
import { CivitatisAdapter } from '../adapters/affiliates/CivitatisAdapter';
import { GetYourGuideAdapter } from '../adapters/affiliates/GetYourGuideAdapter';
import { ContentService } from '../core/services/ContentService';
import { AffiliateService } from '../core/services/AffiliateService';
import { SeoService } from '../core/services/SeoService';
import { I18nService } from '../core/services/I18nService';

export const contentService = new ContentService(new AstroContentAdapter());

export const affiliateService = new AffiliateService([
  new ViatorAdapter(),
  new CivitatisAdapter(),
  new GetYourGuideAdapter(),
]);

export const seoService = new SeoService();

export const i18nService = new I18nService(new FileTranslationAdapter());
