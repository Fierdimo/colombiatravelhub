import type { Destination } from '../core/domain/models';

/**
 * Registry of all active destinations.
 * To add a new destination:
 *  1. Add an entry here with `active: true`
 *  2. Create content folders: src/content/articles/es/{slug}/ and en/{slug}/
 *  That's it — no other code changes needed.
 */
export const DESTINATIONS: Destination[] = [
  {
    slug: 'cartagena',
    names: {
      es: 'Cartagena de Indias',
      en: 'Cartagena de Indias',
    },
    descriptions: {
      es: 'La joya del Caribe colombiano. Playas paradisíacas, arquitectura colonial y una cultura vibrante que te dejarán sin palabras.',
      en: 'The jewel of the Colombian Caribbean. Paradisiacal beaches, colonial architecture and a vibrant culture that will leave you speechless.',
    },
    image: '/images/destinations/cartagena.jpg',
    imageAlt: 'Vista panorámica de Cartagena de Indias con el mar Caribe al fondo',
    active: true,
  },
  {
    slug: 'medellin',
    names: {
      es: 'Medellín',
      en: 'Medellín',
    },
    descriptions: {
      es: 'La ciudad de la eterna primavera. Innovación, flores, cultura y una gastronomía que conquista a todos.',
      en: 'The city of eternal spring. Innovation, flowers, culture and a gastronomy that wins everyone over.',
    },
    image: '/images/destinations/medellin.jpg',
    imageAlt: 'Panorámica de Medellín con sus montañas y el valle',
    active: false, // activate when content is ready
  },
];

export const ACTIVE_DESTINATIONS = DESTINATIONS.filter((d) => d.active);
