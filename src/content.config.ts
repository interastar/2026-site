import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['es', 'en']),
    category: z.string().default('Insights'),
    author: z.string().default('Interastar'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
