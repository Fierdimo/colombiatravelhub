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

function buildFallbackLinks(aid: string): Record<string, AffiliateLink> {
  const u = (slug: string) =>
    `https://www.civitatis.com/es/cartagena/${slug}/?aid=${aid}`;

  return {
    'civitatis-cartagena-chiva-rumbera': {
      id: 'civitatis-cartagena-chiva-rumbera',
      provider: 'civitatis',
      url: u('tour-chiva-rumbera-cartagena'),
      label: 'Tour en Chiva Rumbera Nocturna',
      description:
        'La experiencia nocturna mas iconica de Cartagena. Musica, baile, cocteles y los barrios mas vibrantes a bordo de la chiva tradicional.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/chiva-rumbera-cartagena-1.jpg',
      priceFrom: 28,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 1560,
      duration: '3 horas',
      badge: 'popular',
      featured: true,
    },
    'civitatis-cartagena-playa-blanca': {
      id: 'civitatis-cartagena-playa-blanca',
      provider: 'civitatis',
      url: u('excursion-playa-blanca'),
      label: 'Excursion a Playa Blanca',
      description:
        'Una de las playas mas bellas del Caribe colombiano. Arena blanca, aguas turquesas y cocina tipica. Incluye transporte desde Cartagena.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/excursion-playa-blanca-1.jpg',
      priceFrom: 24,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 2100,
      duration: '8 horas',
      badge: 'bestPrice',
      featured: true,
    },
    'civitatis-cartagena-tour-historico': {
      id: 'civitatis-cartagena-tour-historico',
      provider: 'civitatis',
      url: u('tour-historico-cartagena'),
      label: 'Tour Historico por Cartagena',
      description:
        'Recorre 500 anos de historia en el centro colonial. Castillo San Felipe, murallas y la leyenda de los piratas del Caribe.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/tour-historico-cartagena-1.jpg',
      priceFrom: 18,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 890,
      duration: '4 horas',
      featured: false,
    },
    'civitatis-cartagena-snorkel-rosario': {
      id: 'civitatis-cartagena-snorkel-rosario',
      provider: 'civitatis',
      url: u('snorkel-islas-rosario'),
      label: 'Snorkel en las Islas del Rosario',
      description:
        'Sumergete en los arrecifes de coral mas espectaculares del Caribe. Equipo incluido, guia subacuatico y almuerzo tipico.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/snorkel-islas-rosario-1.jpg',
      priceFrom: 38,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 720,
      duration: '6 horas',
      featured: false,
    },
    'civitatis-cartagena-clase-cocina': {
      id: 'civitatis-cartagena-clase-cocina',
      provider: 'civitatis',
      url: u('clase-cocina-cartagena'),
      label: 'Clase de Cocina Caribena en Cartagena',
      description:
        'Aprende a preparar ceviche, patacones y sancocho con una chef cartagenera. Incluye visita al mercado, clase de 3 horas y almuerzo.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/clase-cocina-cartagena-1.jpg',
      priceFrom: 55,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 310,
      duration: '4 horas',
      badge: 'new',
      featured: false,
    },
    'civitatis-cartagena-crucero-bahia': {
      id: 'civitatis-cartagena-crucero-bahia',
      provider: 'civitatis',
      url: u('crucero-bahia-cartagena'),
      label: 'Crucero por la Bahia de Cartagena',
      description:
        'Navega frente a las murallas coloniales mientras el sol tine el horizonte de naranja. Bebida de bienvenida incluida.',
      imageUrl: 'https://cdn.civitatis.com/colombia/cartagena/galeria/crucero-bahia-cartagena-1.jpg',
      priceFrom: 19,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 1890,
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