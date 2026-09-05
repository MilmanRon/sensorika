/**
 * Site-wide facts that aren't visual (design tokens) and aren't prose
 * (content collections) — the stuff a header, footer, and contact
 * section all need to agree on. Import this instead of hardcoding any
 * of these values in a component.
 */

/**
 * WHERE THE SITE CURRENTLY LIVES.
 *
 * The real pages are built out of `src/pages/playground/_proposed/`, so
 * the walkable site is under /playground rather than at the root: home
 * is /playground/full-page and each nav destination is
 * /playground/<slug>. Nothing else in the codebase should know that —
 * every href the chrome renders is derived from these two constants, so
 * promoting the proposed components is one edit here (`pagesBase` to
 * `''`, `homeHref` to `'/'`) and not a search for hardcoded paths.
 *
 * They live in site.ts rather than in a playground file because the
 * SHIPPED Header and SideNav read `siteConfig.nav` too, and pointing
 * them at the anchors they used to carry would send a visitor to
 * fragments that no page defines.
 */
export const pagesBase = '/playground';

/** The brand lockup's destination, in the header and in the footer. */
export const homeHref = `${pagesBase}/full-page`;

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
    address: '', // TODO
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
   * Primary nav. Each entry is a PAGE now, not a same-page anchor: every
   * label here has a matching .md in src/content/pages/ that
   * [navpage].astro renders as a route of its own, and `slug` is that
   * file's id. The nav was a list of `#` placeholders while those pages
   * didn't exist yet; they do, so it isn't any more.
   *
   * `href` is derived from `slug` rather than written out, so the six
   * paths can never drift from the six files — and so the whole nav
   * moves with `pagesBase` when the prototype is promoted (see there).
   *
   * The two conversion entries — "יצירת קשר" and "הרשמה" — are
   * deliberately absent. The header carries a standing WhatsApp CTA, so
   * a nav item pointing at the same act would be a second, weaker route
   * competing with the site's one conversion action. The nav is for
   * finding out about the clinic; the CTA is for getting in touch.
   */
  nav: [
    { label: 'מהו ויסות חושי', slug: 'sensory-regulation' },
    { label: 'מתי אנחנו יכולים לעזור', slug: 'how-we-help' },
    { label: 'אבחון וטיפול פרטניים', slug: 'individual' },
    { label: 'פעילות קבוצתית', slug: 'groups' },
    { label: 'קצת עליי', slug: 'about' },
    { label: 'שאלות נפוצות', slug: 'faq' },
  ].map((item) => ({ ...item, href: `${pagesBase}/${item.slug}` })) as {
    label: string;
    slug: string;
    href: string;
  }[],
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
