import type { Destination } from '../core/domain/models';

/**
 * Registry of all active destinations.
 * To add a new destination:
 *  1. Add an entry here with `active: true`
 *  2. Create content folders: src/content/articles/es/{slug}/ and en/{slug}/
 *  That's it â€” no other code changes needed.
 */
export const DESTINATIONS: Destination[] = [
  {
    slug: 'cartagena',
    names: {
      es: 'Cartagena de Indias',
      en: 'Cartagena de Indias',
    },
    descriptions: {
      es: 'La joya del Caribe colombiano. Playas paradisÃ­acas, arquitectura colonial y una cultura vibrante que te dejarÃ¡n sin palabras.',
      en: 'The jewel of the Colombian Caribbean. Paradisiacal beaches, colonial architecture and a vibrant culture that will leave you speechless.',
    },
    image: '/images/destinations/cartagena.svg',
    imageAlt: 'Vista panorÃ¡mica de Cartagena de Indias con el mar Caribe al fondo',
    active: true,
  },
  {
    slug: 'medellin',
    names: {
      es: 'MedellÃ­n',
      en: 'MedellÃ­n',
    },
    descriptions: {
      es: 'La ciudad de la eterna primavera. InnovaciÃ³n, flores, cultura y una gastronomÃ­a que conquista a todos.',
      en: 'The city of eternal spring. Innovation, flowers, culture and a gastronomy that wins everyone over.',
    },
    image: '/images/destinations/medellin.svg',
    imageAlt: 'PanorÃ¡mica de MedellÃ­n con sus montaÃ±as y el valle',
    active: false, // activate when content is ready
  },
];

export const ACTIVE_DESTINATIONS = DESTINATIONS.filter((d) => d.active);

