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
   * Primary nav — fill in once the sitemap is decided. Each entry
   * becomes one link in Header/Nav components.
   */
  nav: [] as { label: string; href: string }[],
};
