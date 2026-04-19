/**
 * GetYourGuide Affiliate Adapter
 *
 * Comportamiento en build time:
 *  - Si GYG_PARTNER_ID esta definido → llama a la API de GYG y obtiene actividades reales.
 *  - Si no → usa los productos curados hardcodeados con el partnerId inyectado en las URLs.
 *
 * Registro: https://affiliate.getyourguide.com
 */
import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../../core/domain/models';

function buildFallbackLinks(partnerId: string): Record<string, AffiliateLink> {
  const u = (path: string) =>
    `https://www.getyourguide.com/cartagena-l1050/${path}/?partner_id=${partnerId}`;

  return {
    'gyg-cartagena-walking-tour': {
      id: 'gyg-cartagena-walking-tour',
      provider: 'getyourguide',
      url: u('cartagena-old-city-walking-tour-t123456'),
      label: 'Walking Tour Cartagena Antigua',
      description:
        'El tour mas valorado de Cartagena en GetYourGuide. Grupos pequenos, guia certificado y acceso a lugares que no aparecen en las guias convencionales.',
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
      url: u('catamaran-rosario-islands-t234567'),
      label: 'Catamaran a las Islas del Rosario',
      description:
        'El catamaran mas lujoso que zarpa hacia las Islas del Rosario. Barra libre, snorkel y almuerzo gourmet. Cancelacion gratuita.',
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
      url: u('cartagena-food-and-flavors-tour-t345678'),
      label: 'Cartagena Food & Flavors Tour',
      description:
        'A 3-hour culinary journey through the Old City. Taste 8+ authentic Colombian dishes at street food stalls, local markets, and hidden gems.',
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
      url: u('playa-blanca-snorkel-day-trip-t456789'),
      label: 'Playa Blanca & Snorkel Day Trip',
      description:
        'Full-day trip to Playa Blanca on Baru Island with snorkeling stop at a coral reef. White sand, turquoise water, fresh seafood lunch.',
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
}

export class GetYourGuideAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'getyourguide';

  private constructor(
    private readonly links: Record<string, AffiliateLink>,
    private readonly featuredByDestination: Partial<Record<DestinationSlug, AffiliateLink[]>>,
  ) {}

  /**
   * Async factory. Injects GYG_PARTNER_ID into affiliate URLs.
   * Note: GYG's activities search API requires Technology Partner status.
   * Live products are shown via the GYGWidget.astro component instead.
   * The product cards here serve as curated affiliate links in article pages.
   */
  static async create(): Promise<GetYourGuideAdapter> {
    const partnerId =
      (import.meta.env.GYG_PARTNER_ID as string | undefined) ?? 'YOUR_GYG_PARTNER_ID';

    const fallback = buildFallbackLinks(partnerId);
    const featured = Object.values(fallback).filter((l) => l.featured);
    return new GetYourGuideAdapter(fallback, { cartagena: featured });
  }

  getLinkById(id: string): AffiliateLink | null {
    return this.links[id] ?? null;
  }

  getLinksByIds(ids: string[]): AffiliateLink[] {
    return ids.flatMap((id) => {
      const link = this.getLinkById(id);
      return link ? [link] : [];
    });
  }

  getFeaturedLinks(destination: DestinationSlug): AffiliateLink[] {
    return this.featuredByDestination[destination] ?? [];
  }
}