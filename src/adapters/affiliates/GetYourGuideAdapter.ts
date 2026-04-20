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
import type { IConfigRepository } from '../../core/ports/IConfigRepository';
import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../../core/domain/models';

// Real verified GYG product URLs for Cartagena, Colombia (location: cartagena-l362)
// Confirmed via https://www.getyourguide.com/cartagena-l362/ on 2026-04-19
function buildFallbackLinks(partnerId: string): Record<string, AffiliateLink> {
  // cartagena-l362 = Cartagena, Colombia
  const u = (slug: string) =>
    `https://www.getyourguide.com/cartagena-l362/${slug}/?partner_id=${partnerId}`;
  // Bolivar department tours (some Rosario Island tours use this location ID)
  const uB = (slug: string) =>
    `https://www.getyourguide.com/bolivar-l578/${slug}/?partner_id=${partnerId}`;

  return {
    'gyg-cartagena-walking-tour': {
      id: 'gyg-cartagena-walking-tour',
      provider: 'getyourguide',
      // t622656 confirmed real: Cartagena: Panoramic City Tour, Monuments, Walls, Castle
      url: u('cartagena-city-tour-and-the-most-emblematic-places-t622656'),
      label: 'Tour Panorámico: Murallas, Castillo y Monumentos',
      description:
        'Descubre la Ciudad Amurallada, el Castillo San Felipe y los monumentos icónicos de Cartagena a bordo de una chiva tradicional con guía certificado.',
      imageUrl: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=395,height=400/tour_img/e23eed97974b169633e274504e44c4d417dd04268d3148b5e162bfa6f8c128ce.jpg',
      priceFrom: 15,
      currency: 'USD',
      rating: 3.9,
      reviewCount: 752,
      duration: '3.5-4 horas',
      badge: 'popular',
      featured: true,
    },
    'gyg-cartagena-catamaran': {
      id: 'gyg-cartagena-catamaran',
      provider: 'getyourguide',
      // t506338 confirmed real: Cartagena: 6-Stop Rosario Islands Snorkel, Aquarium, & Lunch
      url: u('cartagena-6-stop-rosario-islands-snorkel-aquarium-lunch-t506338'),
      label: 'Islas del Rosario: 6 Paradas, Snorkel y Almuerzo',
      description:
        'Excursión completa en lancha rápida a las Islas del Rosario. Snorkel, acuario, almuerzo incluido y visita a la mansión de Pablo Escobar. Cancelación gratuita.',
      imageUrl: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=395,height=400/tour_img/18cd039cf052a34c5a60b157c153d9818730973bc51d0c3b606c9f9cac97926f.jpg',
      priceFrom: 65,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 1266,
      duration: '7 horas',
      badge: 'popular',
      featured: true,
    },
    'gyg-cartagena-sunset-boat': {
      id: 'gyg-cartagena-sunset-boat',
      provider: 'getyourguide',
      // t591367 confirmed real: 2-hour tour in Cartagena Sunset View in party boat
      url: u('2-hour-tour-in-cartagena-sunset-view-in-party-boat-t591367'),
      label: 'Crucero al Atardecer en Cartagena',
      description:
        'Navega la bahía de Cartagena al atardecer en un barco fiesta. Bebidas incluidas, música y las mejores vistas del skyline colonial desde el agua.',
      imageUrl: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=395,height=400/tour_img/ad9f03d558c6199cc67eb4e2e0648a941bf2a2d0d7edf688ce3884736a97e360.jpeg',
      priceFrom: 22,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 480,
      duration: '2 horas',
      badge: 'bestPrice',
      featured: true,
    },
    'gyg-cartagena-playa-blanca': {
      id: 'gyg-cartagena-playa-blanca',
      provider: 'getyourguide',
      // t1279979 confirmed real: Cartagena: Playa Blanca Barú Tour with Lunch, Guide and Pick-Up
      url: u('cartagena-playa-blanca-baru-tour-with-lunch-guide-and-hotel-pick-up-t1279979'),
      label: 'Playa Blanca Barú: Excursión con Almuerzo',
      description:
        'Visita la playa más espectacular del Caribe colombiano. Arena blanca, aguas turquesas, almuerzo y transporte desde tu hotel incluidos.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-playa-blanca-589x392.jpg',
      priceFrom: 42,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 920,
      duration: '8 horas',
      badge: 'bestPrice',
      featured: true,
    },
    // Keep old IDs as aliases pointing to real products (backward compat)
    'gyg-cartagena-walking-tour-old': {
      id: 'gyg-cartagena-walking-tour-old',
      provider: 'getyourguide',
      url: uB('cartagena-5-must-see-rosario-islands-highlights-with-lunch-t497946'),
      label: 'Islas del Rosario: 5 Lugares Imperdibles con Almuerzo',
      description:
        'Los 5 rincones más espectaculares de las Islas del Rosario en una sola excursión. Incluye almuerzo típico y snorkel.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-islas-rosario-589x392.jpg',
      priceFrom: 55,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 630,
      duration: '8 horas',
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
   * Async factory. Reads GYG_PARTNER_ID from the config repository.
   * Returns null when the partner ID is not configured — GYG links are skipped entirely.
   * Note: GYG's activities search API requires Technology Partner status.
   * Live products are shown via the GYGWidget.astro component instead.
   */
  static async create(config: IConfigRepository): Promise<GetYourGuideAdapter | null> {
    const partnerId = await config.get('gyg_partner_id');
    if (!partnerId) return null;

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

  getAllLinks(destination: DestinationSlug): AffiliateLink[] {
    if (destination !== 'cartagena') return [];
    return Object.values(this.links);
  }
}