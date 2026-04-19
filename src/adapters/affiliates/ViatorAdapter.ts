import type { IAffiliateRepository } from '../../core/ports/IAffiliateRepository';
import type { AffiliateLink, AffiliateProvider } from '../../core/domain/models';

/**
 * Viator Affiliate Program — https://www.viator.com/partner
 * Replace YOUR_VIATOR_PID in every URL with your Viator Partner ID.
 * Images: use the product photo URL from the Viator product page or their Content API.
 */
const VIATOR_LINKS: Record<string, AffiliateLink> = {
  'viator-cartagena-ciudad-amurallada': {
    id: 'viator-cartagena-ciudad-amurallada',
    provider: 'viator',
    url: 'https://www.viator.com/tours/Cartagena/Walking-Tour-of-the-Walled-City/d5177-5849CTGWALK?pid=YOUR_VIATOR_PID&mcid=42383&medium=link',
    label: 'Tour a pie por la Ciudad Amurallada',
    description: 'Explora el corazón colonial de Cartagena con un guía experto. Murallas, Torre del Reloj, Getsemaní y palacetes de colores en 3 horas.',
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
    url: 'https://www.viator.com/tours/Cartagena/Rosario-Islands-Boat-Trip/d5177-15281P4?pid=YOUR_VIATOR_PID&mcid=42383&medium=link',
    label: 'Excursión a las Islas del Rosario',
    description: 'Lancha rápida desde el Muelle de los Pegasos. Snorkel, playa paradisíaca y almuerzo incluido. El Caribe en su máxima expresión.',
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
    url: 'https://www.viator.com/tours/Cartagena/Sunset-Sailing-Cruise/d5177-6736SUNSET?pid=YOUR_VIATOR_PID&mcid=42383&medium=link',
    label: 'Velero al Atardecer en la Bahía',
    description: 'Navega la Bahía de Cartagena mientras el sol se pone sobre las murallas coloniales. Bebidas incluidas. Romántico e imperdible.',
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
    url: 'https://www.viator.com/tours/Cartagena/Tayrona-National-Park-Day-Trip/d5177-42819P1?pid=YOUR_VIATOR_PID&mcid=42383&medium=link',
    label: 'Excursión al Parque Tayrona',
    description: 'Un día completo en el Parque Nacional Tayrona. Selva tropical, playas vírgenes y avistamiento de vida silvestre desde Cartagena.',
    imageUrl: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/09/f3/c4/ee.jpg',
    priceFrom: 85,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 540,
    duration: 'Día completo',
    featured: false,
  },
};

export class ViatorAdapter implements IAffiliateRepository {
  readonly provider: AffiliateProvider = 'viator';

  getLinkById(id: string): AffiliateLink | null {
    return VIATOR_LINKS[id] ?? null;
  }

  getLinksByIds(ids: string[]): AffiliateLink[] {
    return ids.flatMap((id) => {
      const link = this.getLinkById(id);
      return link ? [link] : [];
    });
  }
}
