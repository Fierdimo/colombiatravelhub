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
  'gyg-cartagena-food-tour': {
    id: 'gyg-cartagena-food-tour',
    provider: 'getyourguide',
    url: 'https://www.getyourguide.com/cartagena-l1050/cartagena-food-and-flavors-tour-t345678/?partner_id=YOUR_GYG_PARTNER_ID',
    label: 'Cartagena Food & Flavors Tour',
    description: "A 3-hour culinary journey through the Old City's best street food stalls, local markets, and hidden gems. Taste 8+ authentic Colombian dishes.",
    imageUrl: 'https://cdn.getyourguide.com/img/tour/6a0c3456cdef/CIExAg_720p.jpg',
    priceFrom: 38,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 530,
    duration: '3 horas',
    badge: 'popular',
    featured: false,
  },
  'gyg-cartagena-playa-blanca-snorkel': {
    id: 'gyg-cartagena-playa-blanca-snorkel',
    provider: 'getyourguide',
    url: 'https://www.getyourguide.com/cartagena-l1050/playa-blanca-snorkel-day-trip-t456789/?partner_id=YOUR_GYG_PARTNER_ID',
    label: 'Playa Blanca & Snorkel Day Trip',
    description: 'Full-day trip to Playa Blanca on Barú Island with snorkeling stop at a coral reef. White sand, turquoise water, fresh seafood lunch.',
    imageUrl: 'https://cdn.getyourguide.com/img/tour/6b1d4567defg/CIExAg_720p.jpg',
    priceFrom: 42,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 1850,
    duration: '9 horas',
    badge: 'bestPrice',
    featured: false,
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
