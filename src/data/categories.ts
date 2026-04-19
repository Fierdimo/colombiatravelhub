import type { Category } from '../core/domain/models';

/**
 * Registry of all content categories.
 * To add a new category:
 *  1. Add it here
 *  2. Add its slug to the DestinationSlug enum in models.ts
 *  3. Add translations in es.ts and en.ts
 */
export const CATEGORIES: Category[] = [
  {
    slug: 'tours',
    labels: { es: 'Tours', en: 'Tours' },
    icon: '🗺️',
  },
  {
    slug: 'playas',
    labels: { es: 'Playas', en: 'Beaches' },
    icon: '🏖️',
  },
  {
    slug: 'gastronomia',
    labels: { es: 'Gastronomía', en: 'Food & Drink' },
    icon: '🍽️',
  },
  {
    slug: 'hospedaje',
    labels: { es: 'Hospedaje', en: 'Accommodation' },
    icon: '🏨',
  },
  {
    slug: 'itinerarios',
    labels: { es: 'Itinerarios', en: 'Itineraries' },
    icon: '📅',
  },
];
