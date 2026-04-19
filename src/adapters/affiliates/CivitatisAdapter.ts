import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider } from '../../core/domain/models';

/**
 * Civitatis Programa de Afiliados — https://www.civitatis.com/es/afiliados/
 * Plataforma líder para el mercado hispanohablante. Excelente para Colombia.
 * Reemplaza YOUR_CIVITATIS_AID con tu ID de afiliado.
 * Las imágenes son de uso libre para afiliados registrados (directrices en tu panel).
 */
const CIVITATIS_LINKS: Record<string, AffiliateLink> = {
  'civitatis-cartagena-chiva-rumbera': {
    id: 'civitatis-cartagena-chiva-rumbera',
    provider: 'civitatis',
    url: 'https://www.civitatis.com/es/cartagena/tour-chiva-rumbera-cartagena/?aid=YOUR_CIVITATIS_AID',
    label: 'Tour en Chiva Rumbera Nocturna',
    description: 'La experiencia nocturna más icónica de Cartagena. Música, baile, cócteles y los barrios más vibrantes a bordo de la chiva tradicional.',
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
    url: 'https://www.civitatis.com/es/cartagena/excursion-playa-blanca/?aid=YOUR_CIVITATIS_AID',
    label: 'Excursión a Playa Blanca',
    description: 'Una de las playas más bellas del Caribe colombiano. Arena blanca, aguas turquesas y cocina típica. Incluye transporte desde Cartagena.',
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
    url: 'https://www.civitatis.com/es/cartagena/tour-historico-cartagena/?aid=YOUR_CIVITATIS_AID',
    label: 'Tour Histórico por Cartagena',
    description: 'Recorre 500 años de historia en el centro colonial. Castillo San Felipe, murallas y la leyenda de los piratas del Caribe.',
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
    url: 'https://www.civitatis.com/es/cartagena/snorkel-islas-rosario/?aid=YOUR_CIVITATIS_AID',
    label: 'Snorkel en las Islas del Rosario',
    description: 'Sumérgete en los arrecifes de coral más espectaculares del Caribe. Equipo incluido, guía subacuático y almuerzo típico.',
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
    url: 'https://www.civitatis.com/es/cartagena/clase-cocina-cartagena/?aid=YOUR_CIVITATIS_AID',
    label: 'Clase de Cocina Caribeña en Cartagena',
    description: 'Aprende a preparar ceviche, patacones y sancocho con una chef cartagenera. Incluye visita al mercado, clase de 3 horas y almuerzo.',
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
    url: 'https://www.civitatis.com/es/cartagena/crucero-bahia-cartagena/?aid=YOUR_CIVITATIS_AID',
    label: 'Crucero por la Bahía de Cartagena',
    description: 'Navega frente a las murallas coloniales mientras el sol tiñe el horizonte de naranja. Bebida de bienvenida incluida. Perfecto para familias y parejas.',
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

export class CivitatisAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'civitatis';

  getLinkById(id: string): AffiliateLink | null {
    return CIVITATIS_LINKS[id] ?? null;
  }

  getLinksByIds(ids: string[]): AffiliateLink[] {
    return ids.flatMap((id) => {
      const link = this.getLinkById(id);
      return link ? [link] : [];
    });
  }
}
