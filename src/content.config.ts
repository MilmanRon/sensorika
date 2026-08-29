import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Long-form parent material (methodology, guides, FAQs). One .md/.mdx
 * file per article under src/content/articles/. MDX lets an article
 * embed a component (e.g. a callout or video) when plain markdown
 * isn't enough — reach for .md by default, .mdx only when needed.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['methodology', 'getting-started', 'faq']),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * The weekly class schedule — one data file (.yaml/.json) per class
 * under src/content/schedule/. Structured data, not prose, so it's
 * read programmatically to render the schedule grid/table.
 */
const schedule = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/schedule' }),
  schema: z.object({
    className: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    ageRange: z.object({ min: z.number(), max: z.number() }),
    dayOfWeek: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
    startTime: z.string(), // 24h "HH:mm"
    endTime: z.string(),
    coach: z.string().optional(),
  }),
});

export const collections = { articles, schedule };
