import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    destination: z.enum(['cartagena', 'medellin', 'bogota', 'san-andres']),
    category: z.enum(['tours', 'playas', 'gastronomia', 'hospedaje', 'itinerarios']),
    image: z.string(),
    imageAlt: z.string(),
    affiliateIds: z.array(z.string()).default([]),
    translationSlugs: z
      .object({
        en: z.string().optional(),
        pt: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { articles };
