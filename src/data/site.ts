/**
 * Site-wide facts that aren't visual (design tokens) and aren't prose
 * (content collections) — the stuff a header, footer, and contact
 * section all need to agree on. Import this instead of hardcoding any
 * of these values in a component.
 *
 * EVERYTHING HERE IS THE SAME IN BOTH LANGUAGES. The phone number, the
 * Facebook URL and the six nav slugs don't change when the reader
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
  contact: {
    email: '', // TODO
    /**
     * E.164 digits only — no '+', spaces or dashes (e.g. '972501234567').
     * That exact shape is what wa.me expects, so this one field backs
     * both the phone link and the WhatsApp link. Still a TODO; while
     * it's empty, `whatsappHref()` degrades instead of emitting a dead
     * wa.me URL.
     */
    phone: '', // TODO
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
    facebook: '', // TODO: e.g. 'https://facebook.com/sensorika'
  },
  /**
   * Primary nav — SIX SLUGS, IN ORDER, AND NOTHING ELSE.
   *
   * Each one is a PAGE: every slug here has a matching .md in
   * src/content/pages/<locale>/ that [...locale]/[navpage].astro renders
   * as a route of its own. The nav was a list of `#` placeholders while
   * those pages didn't exist yet; they do, so it isn't any more.
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
 * Falls back to the on-page contact section while `contact.phone` is
 * still a TODO — a header CTA that 404s is worse than one that scrolls.
 * Callers that show a WhatsApp-specific label should branch on
 * `hasWhatsapp` so the label matches where the link actually goes.
 */
export const hasWhatsapp = Boolean(siteConfig.contact.phone);

export function whatsappHref(message?: string): string {
  if (!hasWhatsapp) return '#contact';
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${siteConfig.contact.phone}${query}`;
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
 * — the six slugs above and the files in src/content/pages/<locale>/ —
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
      href: localizedHref(locale, `${pagesBase}/${slug}`),
    };
  });
}
