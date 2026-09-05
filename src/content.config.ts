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

/**
 * Nav-item pages — one .md file per top-level nav destination
 * ("מהו ויסות חושי", "שאלות נפוצות", ...). These are the pages the nav
 * points AT, so unlike `articles` they aren't a library a parent browses
 * — there's exactly one per nav entry and its slug is its route.
 *
 * The copy lives in frontmatter rather than in the markdown body on
 * purpose. A page here isn't one flowing document: it's a stack of
 * accented panels, each with its own eyebrow / heading / pull-out line,
 * and that structure has to survive into the layout. A markdown body
 * would render as one undifferentiated prose block and the panels would
 * have to be reconstructed by splitting on headings — so the split is
 * declared here instead, where zod can check it. The body stays free for
 * editor notes.
 *
 * Everything a panel can carry is optional except its paragraphs, so a
 * panel that the source copy gave no heading to simply opens cold rather
 * than getting a headline invented for it.
 */
const panel = z.object({
  /**
   * Petal hue for the panel's ring, eyebrow pill and pull-out rule.
   * Decoration only — the panel's own buttons and links stay teal like
   * the rest of the site.
   *
   * Omit it: the page cycles coral → teal → purple → amber down the
   * stack, which is what makes one panel tell itself apart from the next
   * on a long scroll. The hues carry no meaning; they're wayfinding.
   */
  accent: z.enum(['coral', 'teal', 'amber', 'purple']).optional(),
  /** Small label naming the panel, above the heading. */
  eyebrow: z.string().optional(),
  /** The panel's headline, set as an <h2>. */
  heading: z.string().optional(),
  /**
   * Opening sentence set one step larger than the body. Use instead of
   * `heading` where the copy's own first sentence is a full definition
   * rather than a headline — it shouldn't be cut down to fit a heading
   * it was never written as.
   */
  lead: z.string().optional(),
  /** Body paragraphs, in order, above the list. */
  body: z.array(z.string()).default([]),
  /**
   * A labelled list — "ויסות ורמת הפעילות. הילד נמצא כל הזמן בתנועה…",
   * the four individual-work formats. `term` is the bold lead-in; leave
   * it off for a plain list item.
   */
  items: z
    .array(z.object({ term: z.string().optional(), text: z.string() }))
    .optional(),
  /** Number the items (the formats are numbered in the source copy). */
  numbered: z.boolean().default(false),
  /** A closing paragraph under the list. */
  note: z.string().optional(),
  /** Takeaway line, pulled out under the body on a colored rule. */
  pullout: z.string().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    /** The page's own h1 — often longer than the nav label. */
    title: z.string(),
    /** The nav label, when the nav calls the page something shorter. */
    navLabel: z.string().optional(),
    /**
     * Whether this page is one of the nav destinations, and so gets a
     * route of its own from [navpage].astro. The home page's copy lives
     * in this collection too — same panels, same everything — but it's
     * rendered by the home hero rather than by that route, so it sets
     * `nav: false`.
     */
    nav: z.boolean().default(true),
    /**
     * The brand lockup under the greeting — home page only, where the h1
     * is "ברוכים הבאים" over "Sensorika" rather than a plain title. The
     * word is its own field because it has to sit in its own LTR box on
     * the RTL line, or it renders backwards.
     */
    brand: z.object({ word: z.string() }).optional(),
    description: z.string(),
    /** Opening line, centered under the h1 in the intro band. */
    intro: z.string().optional(),
    /** Order in the nav / on the playground index. */
    order: z.number(),
    panels: z.array(panel).default([]),
    /**
     * Q&A list, rendered as an accordion after the panels. Only the FAQ
     * page uses it, but it's here rather than in its own collection
     * because it's one nav-item page among the others.
     */
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
});

export const collections = { articles, schedule, pages };
