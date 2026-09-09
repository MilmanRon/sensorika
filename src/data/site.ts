/**
 * Site-wide facts that aren't visual (design tokens) and aren't prose
 * (content collections) — the stuff a header, footer, and contact
 * section all need to agree on. Import this instead of hardcoding any
 * of these values in a component.
 *
 * EVERYTHING HERE IS THE SAME IN BOTH LANGUAGES. The phone number, the
 * Facebook URL and the nav's slugs don't change when the reader
 * switches to Russian, which is exactly why they're here and not in
 * i18n.ts. Anything that *does* change with the language — the chrome's
 * own vocabulary, the direction of the page — lives there. The one
 * bridge between the two is `getNavItems()` at the bottom, which pairs
 * these slugs with labels read out of the current locale's content.
 */
import { getCollection } from 'astro:content';

import { localizedHref, type Locale } from './i18n';

/**
 * WHERE THE SITE LIVES.
 *
 * Every content page is `/<slug>` and home is `/`. These were
 * `'/playground'` and `'/playground/full-page'` while the design was
 * under review, which is the whole reason they're constants: every href
 * the chrome renders is derived from them, so moving the site was this
 * one edit rather than a search for hardcoded paths.
 *
 * THE LOCALE PREFIX IS NOT ONE OF THEM. That's `localizedHref()` in
 * i18n.ts, and it composes with this: the Russian FAQ is
 * `localizedHref('ru', `${pagesBase}/faq`)`. Two prefixes, two owners —
 * this one for where the site is deployed, that one for what language
 * the reader is in.
 */
export const pagesBase = '';

/**
 * The brand lockup's destination, in the header and in the footer —
 * for a given locale. It's a function rather than a constant now
 * because home is `/` in Hebrew and `/ru` in Russian, and a lockup that
 * always pointed at `/` would quietly drop a Russian reader back into
 * Hebrew.
 */
export function homeHref(locale: Locale): string {
  return localizedHref(locale, '/');
}

export const siteConfig = {
  name: 'Sensorika',
  tagline: '', // TODO: one-line description, once copy is finalized
  location: {
    /** Shared destination for the venue card in both language versions. */
    mapHref:
      'https://www.google.com/maps/search/?api=1&query=%D7%A8%D7%97.%20%D7%94%D7%92%D7%9C%D7%99%D7%9C%206%20%D7%9B%D7%A8%D7%9E%D7%99%D7%90%D7%9C',
  },
  contact: {
    email: '', // TODO
    /**
     * E.164 digits only — no '+', spaces or dashes. That exact shape is
     * what wa.me expects, so this one field backs both the phone link
     * and the WhatsApp link.
     *
     * The clinic writes it +972 54-454-8600; E.164 drops the '+', the
     * separators and the trunk '0' that the local form (054-…) carries.
     * Anything else here — a '+', a space, the leading zero — produces a
     * wa.me URL that resolves to WhatsApp's "phone number is invalid"
     * page rather than to a chat, and it fails silently: the link still
     * looks fine in the markup.
     */
    phone: '972544548600',
    /**
     * NOT HERE — see `venueStreet` / `venueName` in i18n.ts.
     *
     * The clinic has one address and it looks like a site-wide fact,
     * which is why this field existed. It isn't one: "רח. הגליל 6,
     * סטודיו טבסקו" is Hebrew, and the Russian page transliterates it,
     * so it changes with the language and belongs on the other side of
     * the split this file is one half of. Left as a comment rather than
     * deleted so the next person to reach for `contact.address` is told
     * where it went instead of adding a second copy.
     */
  },
  /**
   * Social profiles, as full URLs. Rendered as icons in the footer, and
   * only where a URL exists — an empty string is a platform the clinic
   * doesn't have (or hasn't handed over yet), not a broken link.
   *
   * WhatsApp is deliberately NOT here: it's derived from `contact.phone`
   * through `whatsappHref()`, so it stays one field rather than two that
   * can disagree.
   */
  social: {
    /**
     * THE CANONICAL PROFILE URL, not the share link.
     *
     * The clinic hands these over as facebook.com/share/<id>/, which is
     * a redirect: it costs a hop, and it lands the reader on the profile
     * with `?rdid=…&share_url=…` tracking appended. This is where that
     * one resolves to — the numeric id is the stable half, the name in
     * the path is decorative and survives a rename either way.
     */
    facebook: 'https://www.facebook.com/people/NDFA-Anna-Milman/61579742867682/',
  },
  /**
   * Primary nav — SEVEN SLUGS, IN ORDER, AND NOTHING ELSE.
   *
   * Each one is a PAGE: every slug here has a matching .md in
   * src/content/pages/<locale>/. Six of them are rendered by
   * [...locale]/[navpage].astro as a route of its own; the seventh is
   * `home`, whose copy is in the same collection but whose route is
   * index.astro. That's the ONLY entry whose href isn't `/<slug>` — see
   * `navHref()` — and it's first, because a nav of six destinations
   * with no way back to the front page makes the logo the only exit,
   * which is a convention rather than a signpost.
   *
   * IT USED TO CARRY THE LABELS TOO, and it can't any more — a label is
   * Hebrew or Russian, and this file is the half of the configuration
   * that's neither. The labels were always duplicated anyway: every one
   * of them already existed as `navLabel` in the page's own frontmatter,
   * so the nav and the page it points at could disagree about what the
   * page is called. Now there is one place per language (the content) and
   * one place for the order (here), and `getNavItems()` joins them.
   *
   * The two conversion entries — "יצירת קשר" and "הרשמה" — are
   * deliberately absent. The header carries a standing WhatsApp CTA, so
   * a nav item pointing at the same act would be a second, weaker route
   * competing with the site's one conversion action. The nav is for
   * finding out about the clinic; the CTA is for getting in touch.
   */
  nav: [
    'home',
    'sensory-regulation',
    'how-we-help',
    'individual',
    'groups',
    'about',
    'faq',
  ] as const,
};

/**
 * The clinic's WhatsApp link, with an optional prefilled first message.
 *
 * The `#contact` fallback is now unreachable — `contact.phone` is set,
 * so every caller gets a real wa.me URL. It stays because the condition
 * it guards can come back (a number redacted, a new deployment with the
 * field blanked) and because a header CTA that scrolls is a better
 * failure than one that 404s. Callers that show a WhatsApp-specific
 * label branch on `hasWhatsapp` so the label matches where the link
 * actually goes; that branch is now always the WhatsApp side.
 */
export const hasWhatsapp = Boolean(siteConfig.contact.phone);

export function whatsappHref(message?: string): string {
  if (!hasWhatsapp) return '#contact';
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${siteConfig.contact.phone}${query}`;
}

/**
 * The one slug in the nav that is NOT at `/<slug>`.
 *
 * `home.md` is a `pages` entry like the other six — same frontmatter,
 * same collection — but index.astro renders it, so its URL is the site
 * root (`/`, or `/ru`) and it carries `nav: false` to keep
 * [navpage].astro from building a second copy of it at `/home`.
 */
const homeSlug = 'home';

/** Where one nav slug points, in one language. */
function navHref(locale: Locale, slug: string): string {
  return slug === homeSlug
    ? homeHref(locale)
    : localizedHref(locale, `${pagesBase}/${slug}`);
}

/**
 * The nav, resolved for one language: label, href and slug per entry, in
 * `siteConfig.nav` order.
 *
 * THE LABEL COMES FROM THE PAGE, NOT FROM HERE. Each page's frontmatter
 * already carries `navLabel` (the short name, where the nav calls the
 * page something shorter than its own h1) falling back to `title`. So
 * adding Russian meant translating nine .md files and nothing else — the
 * nav follows, in both languages, from the copy the clinic supplied.
 *
 * IT THROWS RATHER THAN RENDERING A BROKEN NAV. Two lists have to agree
 * — the slugs above and the files in src/content/pages/<locale>/ —
 * and they live in places that can't see each other. Previously this
 * check lived in the route; it belongs here, because now it has to hold
 * for every language and the route only ever built one. A missing
 * translation is a build failure with the locale and the slug named,
 * not a header link that 404s in production.
 */
export async function getNavItems(locale: Locale) {
  const pages = await getCollection('pages', ({ id }) => id.startsWith(`${locale}/`));
  const bySlug = new Map(pages.map((page) => [page.id.slice(locale.length + 1), page]));

  return siteConfig.nav.map((slug) => {
    const page = bySlug.get(slug);
    if (!page) {
      throw new Error(
        `site.ts nav names "${slug}", which has no matching file at ` +
          `src/content/pages/${locale}/${slug}.md. Every nav slug must exist in every locale.`,
      );
    }
    return {
      slug,
      label: page.data.navLabel ?? page.data.title,
      href: navHref(locale, slug),
    };
  });
}
