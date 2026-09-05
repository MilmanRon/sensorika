/**
 * Site-wide facts that aren't visual (design tokens) and aren't prose
 * (content collections) — the stuff a header, footer, and contact
 * section all need to agree on. Import this instead of hardcoding any
 * of these values in a component.
 */
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
   * Primary nav. This is a one-page site for now, so links are
   * same-page anchors, not routes. Labels are final copy; hrefs are
   * placeholder slugs (TODO) until each matching section exists and
   * gets a real `id`.
   */
  nav: [
    { label: 'מהו ויסות חושי', href: '#sensory-regulation' },
    { label: 'מתי אנחנו יכולים לעזור', href: '#how-we-help' },
    { label: 'אבחון וטיפול פרטניים', href: '#individual' },
    { label: 'פעילות קבוצתית', href: '#groups' },
    { label: 'קצת עליי', href: '#about' },
    { label: 'שאלות נפוצות', href: '#faq' },
    { label: 'הרשמה', href: '#signup' },
    { label: 'יצירת קשר', href: '#contact' },
  ] as { label: string; href: string }[],
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
