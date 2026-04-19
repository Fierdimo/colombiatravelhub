/**
 * Viator Affiliate Adapter
 *
 * Comportamiento en build time:
 *  - Si VIATOR_API_KEY + VIATOR_PARTNER_ID están en el entorno → llama a la API
 *    de Viator y obtiene productos reales (precios, imágenes y ratings actualizados).
 *  - Si no → usa los productos curados hardcodeados (datos de referencia).
 *
 * En ambos casos, VIATOR_PARTNER_ID se inyecta en las URLs de afiliado
 * para que el tracking de comisiones funcione.
 *
 * Registro: https://www.viator.com/partner
 */
import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../../core/domain/models';
import { fetchViatorProducts } from '../../lib/affiliateFetch';

/** Destination IDs on the Viator platform */
const VIATOR_DESTINATION_IDS: Partial<Record<DestinationSlug, string>> = {
  cartagena: '5177',
  medellin: '317',
  bogota: '316',
  'san-andres': '5223',
};

/** Curated fallback products — used when API keys are not yet configured */
function buildFallbackLinks(pid: string): Record<string, AffiliateLink> {
  const u = (path: string) =>
    `https://www.viator.com/tours/Cartagena/${path}?pid=${pid}&mcid=42383&medium=link`;

  return {
    'viator-cartagena-ciudad-amurallada': {
      id: 'viator-cartagena-ciudad-amurallada',
      provider: 'viator',
      url: u('Walking-Tour-of-the-Walled-City/d5177-5849CTGWALK'),
      label: 'Tour a pie por la Ciudad Amurallada',
      description:
        'Explora el corazon colonial de Cartagena con un guia experto. Murallas, Torre del Reloj, Getsemani y palacetes de colores en 3 horas.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/2e/2a/cd.jpg',
      priceFrom: 22,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 2340,
      duration: '3 horas',
      badge: 'popular',
      featured: true,
    },
    'viator-cartagena-islas-rosario': {
      id: 'viator-cartagena-islas-rosario',
      provider: 'viator',
      url: u('Rosario-Islands-Boat-Trip/d5177-15281P4'),
      label: 'Excursion a las Islas del Rosario',
      description:
        'Lancha rapida desde el Muelle de los Pegasos. Snorkel, playa paradisiaca y almuerzo incluido. El Caribe en su maxima expresion.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/03/1d/a6.jpg',
      priceFrom: 45,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 1870,
      duration: '7 horas',
      badge: 'bestPrice',
      featured: true,
    },
    'viator-cartagena-sunset-sailing': {
      id: 'viator-cartagena-sunset-sailing',
      provider: 'viator',
      url: u('Sunset-Sailing-Cruise/d5177-6736SUNSET'),
      label: 'Velero al Atardecer en la Bahia',
      description:
        'Navega la Bahia de Cartagena mientras el sol se pone sobre las murallas coloniales. Bebidas incluidas.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/2e/ab/c8.jpg',
      priceFrom: 48,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 980,
      duration: '2 horas',
      badge: 'new',
      featured: true,
    },
    'viator-cartagena-tayrona': {
      id: 'viator-cartagena-tayrona',
      provider: 'viator',
      url: u('Tayrona-National-Park-Day-Trip/d5177-42819P1'),
      label: 'Excursion al Parque Tayrona',
      description:
        'Un dia completo en el Parque Nacional Tayrona. Selva tropical, playas virgenes y avistamiento de vida silvestre.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/f3/c4/ee.jpg',
      priceFrom: 85,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 540,
      duration: 'Dia completo',
      featured: false,
    },
    'viator-cartagena-food-tour': {
      id: 'viator-cartagena-food-tour',
      provider: 'viator',
      url: u('Cartagena-Street-Food-Tour/d5177-73890P3'),
      label: 'Tour Gastronomico por Cartagena',
      description:
        'Prueba los sabores autenticos del Caribe colombiano: arepas de huevo, carimaniolas, ceviche costeno y mas en mercados locales.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/11/c1/2a/b5.jpg',
      priceFrom: 35,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 620,
      duration: '3 horas',
      badge: 'popular',
      featured: true,
    },
    'viator-cartagena-getsemani-night': {
      id: 'viator-cartagena-getsemani-night',
      provider: 'viator',
      url: u('Getsemani-Street-Art-Night-Tour/d5177-55102P7'),
      label: 'Noche en Getsemani: Arte Urbano y Cultura',
      description:
        'El barrio mas trendy de Cartagena cobra vida de noche. Murales, musica en vivo, cocteleria artesanal.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0d/4f/9a/12.jpg',
      priceFrom: 25,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 410,
      duration: '3 horas',
      badge: 'new',
      featured: false,
    },
    'viator-cartagena-castillo-san-felipe': {
      id: 'viator-cartagena-castillo-san-felipe',
      provider: 'viator',
      url: u('Castillo-San-Felipe-Guided-Tour/d5177-61234P2'),
      label: 'Castillo San Felipe de Barajas: Tour Guiado',
      description:
        'Explora la fortaleza mas poderosa jamas construida por Espana en America. Tuneles secretos, canones y vistas panoramicas.',
      imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/10/b2/3c/a1.jpg',
      priceFrom: 28,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 1240,
      duration: '2 horas',
      featured: false,
    },
  };
}

export class ViatorAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'viator';

  private constructor(
    private readonly links: Record<string, AffiliateLink>,
    private readonly featuredByDestination: Partial<Record<DestinationSlug, AffiliateLink[]>>,
  ) {}

  /**
   * Async factory. When VIATOR_API_KEY and VIATOR_PARTNER_ID are set, fetches
   * real product data from the Viator Partner API at build time.
   * Falls back to hardcoded curated products when keys are absent.
   */
  static async create(): Promise<ViatorAdapter> {
    const apiKey = import.meta.env.VIATOR_API_KEY as string | undefined;
    const partnerId =
      (import.meta.env.VIATOR_PARTNER_ID as string | undefined) ?? 'YOUR_VIATOR_PID';

    if (apiKey && partnerId !== 'YOUR_VIATOR_PID') {
      const cartagenaLinks = await fetchViatorProducts(
        apiKey,
        VIATOR_DESTINATION_IDS.cartagena!,
        partnerId,
        24,
      );
      if (cartagenaLinks.length > 0) {
        const linksMap: Record<string, AffiliateLink> = {};
        cartagenaLinks.forEach((l) => {
          linksMap[l.id] = l;
        });
        return new ViatorAdapter(linksMap, { cartagena: cartagenaLinks });
      }
    }

    const fallback = buildFallbackLinks(partnerId);
    const featured = Object.values(fallback).filter((l) => l.featured);
    return new ViatorAdapter(fallback, { cartagena: featured });
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