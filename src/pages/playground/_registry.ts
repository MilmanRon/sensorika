/**
 * Registry of playground entries — one per component being built/reviewed
 * in isolation. Underscore-prefixed file, so Astro doesn't treat it as a
 * route. Add an entry here whenever a new playground/<slug>.astro page
 * is created, so it shows up on /playground automatically.
 *
 * `compare: true` marks a page that renders the shipped component and a
 * proposed revision of it (from ./_proposed/) one above the other.
 *
 * The nav-item pages (מהו ויסות חושי, שאלות נפוצות, …) are deliberately
 * NOT listed here. They're one dynamic route ([navpage].astro) driven by
 * the `pages` content collection, so /playground reads them straight off
 * that collection — a new page there is a new .md file and nothing else.
 */
export const playgroundEntries = [
  {
    slug: 'primitives',
    title: 'Button + Card',
    group: 'ui',
    component: 'src/components/ui/Button.astro, src/components/ui/Card.astro',
    status: 'in progress',
    compare: true,
  },
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
  {
    slug: 'header',
    title: 'Header + SideNav',
    group: 'layout',
    component: 'src/components/layout/Header.astro',
    status: 'in progress',
  },
  {
    slug: 'sidenav',
    title: 'SideNav',
    group: 'layout',
    component: 'src/components/layout/SideNav.astro',
    status: 'in progress',
  },
  {
    slug: 'footer',
    title: 'Footer',
    group: 'layout',
    component: '_proposed/SiteFooter.astro',
    status: 'in progress',
  },
  {
    slug: 'method',
    title: 'Method',
    group: 'sections',
    component: 'src/components/sections/Method.astro',
    status: 'in progress',
    compare: true,
  },
  {
    slug: 'programs',
    title: 'Programs',
    group: 'sections',
    component: 'src/components/sections/Programs.astro',
    status: 'in progress',
    compare: true,
  },
  {
    slug: 'hero',
    title: 'Hero',
    group: 'sections',
    component: 'src/components/sections/Hero.astro',
    status: 'in progress',
    compare: true,
  },
  {
    slug: 'hero-method',
    title: 'Hero + Method (combined)',
    group: 'sections',
    component: '_proposed/HeaderV2 + HeroMethod + ProgramsV2',
    status: 'in progress',
  },
  {
    slug: 'full-page',
    title: 'Home (full page)',
    group: 'pages',
    component: '_proposed/PageBackdrop + HeaderV2 + HeroMethod + ProgramsV2 + SiteFooter',
    status: 'in progress',
  },
  {
    slug: 'home',
    title: 'Home (composed)',
    group: 'pages',
    component: 'SiteLayout + Hero + Method + Programs',
    status: 'in progress',
  },
  {
    slug: 'home-v2',
    title: 'Home (proposed)',
    group: 'pages',
    component: '_proposed/HeaderV2 + HeroV2 + MethodV2 + ProgramsV2',
    status: 'in progress',
    compare: true,
  },
] as const satisfies {
  slug: string;
  title: string;
  /* `pages` is for whole-page compositions rather than one component —
     the chrome, hero and sections assembled the way they ship. */
  group: 'ui' | 'layout' | 'sections' | 'pages';
  component: string;
  status: 'in progress' | 'done';
  /* Page shows the shipped component next to a proposed revision. */
  compare?: boolean;
}[];
