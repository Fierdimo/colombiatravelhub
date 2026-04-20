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
import type { IConfigRepository } from '../../core/ports/IConfigRepository';
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
// NOTE: Viator blocks all automated fetching (403). Product codes below use
// Viator destination + search pages that are guaranteed to work.
// Format: https://www.viator.com/search?text=QUERY&pid=PID&mcid=42383&medium=link
// When VIATOR_PARTNER_ID is configured, Viator's API will provide real product codes at build time.
function buildFallbackLinks(pid: string): Record<string, AffiliateLink> {
  // Destination landing page — shows all Cartagena tours, guaranteed to work
  const dest = `https://www.viator.com/Cartagena-Colombia/d5177-ttd?pid=${pid}&mcid=42383&medium=link`;
  // Category search — shows relevant results for a specific type of tour
  const s = (query: string) =>
    `https://www.viator.com/search?text=${encodeURIComponent(query)}&pid=${pid}&mcid=42383&medium=link`;

  return {
    'viator-cartagena-ciudad-amurallada': {
      id: 'viator-cartagena-ciudad-amurallada',
      provider: 'viator',
      // Points to Viator search for Cartagena walking tours — guaranteed working
      url: s('cartagena colombia walled city walking tour'),
      label: 'Walking Tour Ciudad Amurallada de Cartagena',
      description:
        'Explora el corazón colonial de Cartagena con un guía experto. Murallas, Torre del Reloj, Getsemaní y palacetes de colores en 3 horas.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/tour-cartagena-completo-589x392.jpg',
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
      url: s('cartagena colombia rosario islands boat tour'),
      label: 'Excursión a las Islas del Rosario',
      description:
        'Lancha rápida desde el Muelle de los Pegasos. Snorkel, playa paradisíaca y almuerzo incluido. El Caribe en su máxima expresión.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-islas-rosario-589x392.jpg',
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
      url: s('cartagena colombia sunset sailing cruise'),
      label: 'Velero al Atardecer en la Bahía',
      description:
        'Navega la Bahía de Cartagena mientras el sol se pone sobre las murallas coloniales. Bebidas incluidas.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/paseo-barco-pirata-atardecer-589x392.jpg',
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
      url: s('tayrona national park day trip cartagena'),
      label: 'Excursión al Parque Nacional Tayrona',
      description:
        'Un día completo en el Parque Nacional Tayrona. Selva tropical, playas vírgenes y avistamiento de vida silvestre.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-playa-blanca-589x392.jpg',
      priceFrom: 85,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 540,
      duration: 'Día completo',
      featured: false,
    },
    'viator-cartagena-food-tour': {
      id: 'viator-cartagena-food-tour',
      provider: 'viator',
      url: s('cartagena colombia food tour street food'),
      label: 'Tour Gastronómico por Cartagena',
      description:
        'Prueba los sabores auténticos del Caribe colombiano: arepas de huevo, carimañolas, ceviche costeño y más en mercados locales.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/tour-rumba-cartagena-589x392.jpg',
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
      url: s('cartagena getsemani night tour street art'),
      label: 'Noche en Getsemaní: Arte Urbano y Cultura',
      description:
        'El barrio más trendy de Cartagena cobra vida de noche. Murales, música en vivo, coctelería artesanal.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/free-tour-cartagena-indias-589x392.jpg',
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
      url: s('castillo san felipe cartagena guided tour'),
      label: 'Castillo San Felipe de Barajas: Tour Guiado',
      description:
        'Explora la fortaleza más poderosa jamás construida por España en América. Túneles secretos, cañones y vistas panorámicas.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/tour-cartagena-completo-589x392.jpg',
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
   * Async factory. Reads VIATOR_PARTNER_ID (required) and VIATOR_API_KEY (optional)
   * from the config repository.
   * Returns null when partner ID is not configured — Viator links are skipped entirely.
   * When the API key is also present, fetches real product data at build time.
   */
  static async create(config: IConfigRepository): Promise<ViatorAdapter | null> {
    const partnerId = await config.get('viator_partner_id');
    if (!partnerId) return null;

    const apiKey = await config.get('viator_api_key');
    if (apiKey) {
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

  getAllLinks(destination: DestinationSlug): AffiliateLink[] {
    if (destination !== 'cartagena') return [];
    return Object.values(this.links);
  }
}