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
 * ONE DIRECTORY PER LANGUAGE, and the id carries the language:
 * src/content/pages/he/faq.md is `he/faq`, its Russian twin is `ru/faq`.
 * The two directories hold the SAME NINE FILENAMES — that's what makes
 * the language switcher a prefix swap rather than a lookup table, and
 * `getNavItems()` in site.ts fails the build if a locale is missing one
 * the nav points at.
 *
 * A locale is not a schema field for the same reason the slug isn't: it
 * would be a second place to write down something the path already says,
 * and the two could disagree. Everything below applies identically to
 * both languages — the panels, the disclosures, the FAQ list are shape,
 * and shape doesn't change with language. Only `dir` does, and that's
 * BaseLayout's business, not the content's.
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

/**
 * A file a page hands the reader — today, the group program's two
 * registration forms.
 *
 * `file` is a path under public/, not an astro:assets import: these are
 * documents served as-is at a fixed URL a parent can be sent, not images
 * for the build to fingerprint and transform. That also means nothing
 * type-checks the path: the PDFs are generated from forms/*.html by
 * `npm run forms` (see forms/README.md), and renaming one of those
 * outputs without changing the `file` here leaves a dead download. Only
 * the shape is checked below.
 */
const document = z.object({
  title: z.string(),
  /** One line on what's inside, under the title. */
  description: z.string().optional(),
  /** Shape and length — "PDF · 2 עמודים" — set beside the title. */
  meta: z.string().optional(),
  /** Petal hue for the card. Omit and the list cycles them, as panels do. */
  accent: z.enum(['coral', 'teal', 'amber', 'purple']).optional(),
  file: z.string().startsWith('/', 'A path under public/, so it must start with "/".'),
});

/**
 * One entry of a page's disclosure list — a titled section a reader
 * opens, rather than a panel that is already open.
 *
 * This is the shape the clinic asked the individual-programs page to
 * take: four packages and the terms that govern all of them, as five
 * closed rows. It differs from `faq` (one question, one answer string)
 * because these bodies are documents in their own right — a price line,
 * then paragraphs interleaved with headed lists of what the money buys.
 */
const disclosure = z.object({
  /** The row's label, closed and open — "חבילה 1. אבחון + תוכנית עבודה ביתית". */
  title: z.string(),
  /**
   * The package's price, set as a line at the top of the opened body,
   * above everything else.
   *
   * It's structured rather than a line of prose, and it's separate from
   * the body rather than being its first paragraph, for the same
   * reason: the clinic's instruction is that the price comes FIRST on
   * every package, and every package quotes two of them — an opening
   * period and the months after it, or one session a week and two. As
   * `label`/`amount` pairs the layout can set each label tight against
   * its own figure; as sentences they'd be two more paragraphs to find
   * the numbers in.
   *
   * A disclosure with no price (the terms row) simply opens on its body.
   */
  price: z
    .array(z.object({ label: z.string(), amount: z.string() }))
    .default([]),
  /** Petal hue for the row. Omit and the list cycles them, as panels do. */
  accent: z.enum(['coral', 'teal', 'amber', 'purple']).optional(),
  /**
   * The body, as an ordered run of parts. A part is any of: a heading, a
   * few paragraphs, a bulleted list — and it renders in that order.
   *
   * ONE MECHANISM RATHER THAN TWO. This started as `body` (paragraphs)
   * plus `sections` (the headed parts under them), which the clinic's
   * copy then broke: a package opens with a paragraph, lists what the
   * first stage includes, explains in prose what happens next, lists
   * what each further month includes, and closes with another
   * paragraph. Prose and lists interleave, so there is no "the
   * paragraphs" and "the sections" — there's a sequence. A part with no
   * `heading` is simply a run of paragraphs, which is how the copy's
   * unheaded stretches are written here.
   */
  sections: z
    .array(
      z.object({
        heading: z.string().optional(),
        body: z.array(z.string()).default([]),
        /** A bulleted list, under this part's paragraphs. */
        items: z.array(z.string()).default([]),
      }),
    )
    .default([]),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    /** The page's own h1 — often longer than the nav label. */
    title: z.string(),
    /** The nav label, when the nav calls the page something shorter. */
    navLabel: z.string().optional(),
    /**
     * Whether [navpage].astro gives this page a route of its own. The
     * home page's copy lives in this collection too — same panels, same
     * everything — but it's rendered by the home hero rather than by
     * that route, so it sets `nav: false`.
     *
     * It does NOT decide what the header carries: `siteConfig.nav` names
     * the six nav destinations, and a page can have a route without
     * being one of them (the group program's forms page is reached from
     * a card on the home page).
     */
    nav: z.boolean().default(true),
    /**
     * The brand word — home page only, where the h1 is "Sensorika"
     * itself rather than the `title` above. It's its own field because
     * it has to sit in its own LTR box on the RTL line, or it renders
     * backwards.
     */
    brand: z.object({ word: z.string() }).optional(),
    description: z.string(),
    /** Opening line, centered under the h1 in the intro band. */
    intro: z.string().optional(),
    /** Order in the nav. */
    order: z.number(),
    panels: z.array(panel).default([]),
    /**
     * Collapsed rows rendered AFTER the panels: the page's reference
     * matter — prices, terms, the small print — which a parent opens the
     * one row of that applies to them rather than reading top to bottom.
     * The panels above are the argument; this is the paperwork.
     *
     * Rows are for things a reader CHOOSES BETWEEN — the four packages,
     * of which exactly one is theirs. Reference matter that simply
     * applies to all of them goes in `terms` below, as open panels.
     */
    disclosures: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(disclosure).nonempty(),
      })
      .optional(),
    /**
     * The page's closing section: reference matter that governs
     * everything above it, as a titled stack of open panels rendered
     * after the disclosures.
     *
     * IT IS PANELS AND NOT MORE DISCLOSURE ROWS. The packages page's
     * payment / interruption / cancellation terms were one fifth row in
     * the list of four packages, and they read as a fifth package —
     * something to weigh against the others and pick. There's nothing to
     * choose here: these terms apply whichever package a parent takes,
     * so they're set open, in boxes, the way group-forms.md sets the
     * same kind of text. A toggle asks a question the reader doesn't
     * have.
     *
     * `panels` rather than the page's own `panels` field because those
     * render ABOVE the disclosures — they're the argument a page makes,
     * and this comes after the offer it governs.
     */
    terms: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        panels: z.array(panel).nonempty(),
      })
      .optional(),
    /**
     * Downloads, rendered as a card each ABOVE the panels — a page that
     * exists to hand a parent two forms shouldn't open with the reading
     * matter that follows them.
     */
    documents: z
      .object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(document).nonempty(),
      })
      .optional(),
    /**
     * Q&A list, rendered as an accordion after the panels. Only the FAQ
     * page uses it, but it's here rather than in its own collection
     * because it's one nav-item page among the others.
     */
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
});

export const collections = { articles, schedule, pages };
