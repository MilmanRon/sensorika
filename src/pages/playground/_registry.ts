/**
 * Registry of playground entries — one per component being built/reviewed
 * in isolation. Underscore-prefixed file, so Astro doesn't treat it as a
 * route. Add an entry here whenever a new playground/<slug>.astro page
 * is created, so it shows up on /playground automatically.
 */
export const playgroundEntries = [
  {
    slug: 'nav',
    title: 'Nav',
    group: 'layout',
    component: 'src/components/layout/Nav.astro',
    status: 'in progress',
  },
  {
    slug: 'nav-item',
    title: 'NavItem',
    group: 'layout',
    component: 'src/components/layout/NavItem.astro',
    status: 'in progress',
  },
] as const satisfies {
  slug: string;
  title: string;
  group: 'ui' | 'layout' | 'sections';
  component: string;
  status: 'in progress' | 'done';
}[];
