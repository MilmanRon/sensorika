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
    phone: '', // TODO
    address: '', // TODO
  },
  social: {
    // TODO: e.g. instagram: 'https://instagram.com/...'
  },
  /**
   * Primary nav. This is a one-page site for now, so links are
   * same-page anchors, not routes. Labels are final copy; hrefs are
   * placeholder slugs (TODO) until each matching section exists and
   * gets a real `id`.
   */
  nav: [
    { label: 'מהו ויסות חושי', href: '#sensory-regulation' },
    { label: 'באילו מקרים אנחנו יכולים לעזור', href: '#how-we-help' },
    { label: 'קצת עליי', href: '#about' },
    { label: 'שאלות נפוצות', href: '#faq' },
    { label: 'צרו קשר', href: '#contact' },
  ] as { label: string; href: string }[],
};
