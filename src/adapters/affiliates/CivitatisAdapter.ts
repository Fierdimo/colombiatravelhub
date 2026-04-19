/**
 * Civitatis Affiliate Adapter
 *
 * Civitatis no tiene una API publica de afiliados — los productos se mantienen
 * hardcodeados. Lo que si hacemos es inyectar CIVITATIS_AID en cada URL para
 * que el tracking de comisiones funcione correctamente.
 *
 * Registro: https://www.civitatis.com/es/afiliados/
 */
import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../../core/domain/models';

// Real verified Civitatis product URLs for Cartagena de Indias, Colombia
// Confirmed via https://www.civitatis.com/es/cartagena-de-indias/ on 2026-04-19
function buildFallbackLinks(aid: string): Record<string, AffiliateLink> {
  // Base: cartagena-de-indias (NOT /cartagena/ which is Cartagena, Spain)
  const u = (slug: string) =>
    `https://www.civitatis.com/es/cartagena-de-indias/${slug}/?aid=${aid}`;

  return {
    'civitatis-cartagena-chiva-rumbera': {
      id: 'civitatis-cartagena-chiva-rumbera',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis
      url: u('tour-rumba-cartagena'),
      label: 'Tour en Chiva Rumbera por Cartagena',
      description:
        'La experiencia nocturna más icónica de Cartagena. Música, baile, cócteles y los barrios más vibrantes a bordo de la chiva tradicional.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/tour-rumba-cartagena-589x392.jpg',
      priceFrom: 12,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 5243,
      duration: '2 horas',
      badge: 'popular',
      featured: true,
    },
    'civitatis-cartagena-playa-blanca': {
      id: 'civitatis-cartagena-playa-blanca',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis
      url: u('excursion-playa-blanca'),
      label: 'Excursión a Playa Blanca',
      description:
        'Una de las playas más bellas del Caribe colombiano. Arena blanca, aguas turquesas y cocina típica. Incluye transporte desde Cartagena.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-playa-blanca-589x392.jpg',
      priceFrom: 81,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 3172,
      duration: '7 horas',
      badge: 'bestPrice',
      featured: true,
    },
    'civitatis-cartagena-tour-historico': {
      id: 'civitatis-cartagena-tour-historico',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis: tour completo con entradas
      url: u('tour-cartagena-completo'),
      label: 'Tour de Cartagena al Completo con Entradas',
      description:
        'Recorre las principales plazas, calles empedradas y el Fuerte San Felipe en 4 horas con guía experto. Entradas incluidas.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/tour-cartagena-completo-589x392.jpg',
      priceFrom: 44,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 12202,
      duration: '4 horas',
      featured: false,
    },
    'civitatis-cartagena-islas-rosario': {
      id: 'civitatis-cartagena-islas-rosario',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis
      url: u('excursion-islas-rosario'),
      label: 'Excursión a las Islas del Rosario',
      description:
        'Las islas más espectaculares del Caribe colombiano. Arrecifes de coral, aguas turquesas y almuerzo típico incluido.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/excursion-islas-rosario-589x392.jpg',
      priceFrom: 70,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 16988,
      duration: '7-8 horas',
      featured: false,
    },
    'civitatis-cartagena-free-tour': {
      id: 'civitatis-cartagena-free-tour',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis
      url: u('free-tour-cartagena-indias'),
      label: 'Free Tour por Cartagena de Indias',
      description:
        'El free tour más popular de Cartagena. Conoce la apasionante historia de la Ciudad Amurallada con guía experto. Paga lo que quieras.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/free-tour-cartagena-indias-589x392.jpg',
      priceFrom: 0,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 100305,
      duration: '2.5 horas',
      badge: 'popular',
      featured: false,
    },
    'civitatis-cartagena-barco-atardecer': {
      id: 'civitatis-cartagena-barco-atardecer',
      provider: 'civitatis',
      // Real slug confirmed on Civitatis
      url: u('paseo-barco-pirata-atardecer'),
      label: 'Paseo en Barco Pirata al Atardecer',
      description:
        'Surca las aguas del Caribe al atardecer a bordo de un barco pirata. Las vistas de Cartagena desde el mar al caer el sol son inolvidables.',
      imageUrl: 'https://www.civitatis.com/f/colombia/cartagena-de-indias/paseo-barco-pirata-atardecer-589x392.jpg',
      priceFrom: 46,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 963,
      duration: '1.5 horas',
      badge: 'bestPrice',
      featured: false,
    },
  };
}

export class CivitatisAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'civitatis';

  private constructor(
    private readonly links: Record<string, AffiliateLink>,
    private readonly featuredByDestination: Partial<Record<DestinationSlug, AffiliateLink[]>>,
  ) {}

  /**
   * Async factory (sync internally — Civitatis has no public affiliate API).
   * Reads CIVITATIS_AID from the environment and injects it into all affiliate URLs.
   */
  static async create(): Promise<CivitatisAdapter> {
    const aid = (import.meta.env.CIVITATIS_AID as string | undefined) ?? 'YOUR_CIVITATIS_AID';
    const links = buildFallbackLinks(aid);
    const featured = Object.values(links).filter((l) => l.featured);
    return new CivitatisAdapter(links, { cartagena: featured });
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