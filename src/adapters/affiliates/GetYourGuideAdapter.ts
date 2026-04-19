import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider } from '../../core/domain/models';

/**
 * GetYourGuide Affiliate Program — https://affiliate.getyourguide.com
 * Reemplaza YOUR_GYG_PARTNER_ID en cada URL con tu Partner ID de GYG.
 * GYG tiene excelente cobertura en Colombia y widgets embebibles.
 */
const GYG_LINKS: Record<string, AffiliateLink> = {
  'gyg-cartagena-walking-tour': {
    id: 'gyg-cartagena-walking-tour',
    provider: 'getyourguide',
    url: 'https://www.getyourguide.com/cartagena-l1050/cartagena-old-city-walking-tour-t123456/?partner_id=YOUR_GYG_PARTNER_ID',
    label: 'Walking Tour Cartagena Antigua',
    description: 'El tour más valorado de Cartagena en GetYourGuide. Grupos pequeños, guía certificado y acceso a lugares que no aparecen en las guías convencionales.',
    imageUrl: 'https://cdn.getyourguide.com/img/tour/5e8a1234abcd/CIExAg_720p.jpg',
    priceFrom: 20,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 3100,
    duration: '2.5 horas',
    badge: 'popular',
    featured: true,
  },
  'gyg-cartagena-catamaran': {
    id: 'gyg-cartagena-catamaran',
    provider: 'getyourguide',
    url: 'https://www.getyourguide.com/cartagena-l1050/catamaran-rosario-islands-t234567/?partner_id=YOUR_GYG_PARTNER_ID',
    label: 'Catamarán a las Islas del Rosario',
    description: 'El catamarán más lujoso que zarpa hacia las Islas del Rosario. Barra libre, snorkel y almuerzo gourmet. Cancelación gratuita.',
    imageUrl: 'https://cdn.getyourguide.com/img/tour/5f9b2345bcde/CIExAg_720p.jpg',
    priceFrom: 65,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 740,
    duration: '8 horas',
    badge: 'bestPrice',
    featured: true,
  },
};

export class GetYourGuideAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'getyourguide';

  getLinkById(id: string): AffiliateLink | null {
    return GYG_LINKS[id] ?? null;
  }

  getLinksByIds(ids: string[]): AffiliateLink[] {
    return ids.flatMap((id) => {
      const link = this.getLinkById(id);
      return link ? [link] : [];
    });
  }
}
