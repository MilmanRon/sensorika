## Project

Marketing/informational site for a local clinic where kids with special
needs play, do therapy-adjacent activities, and grow — structured like a
sports club: a weekly schedule by age/level, plus a library of material
for parents who want to go deep on the method. Clean public landing page
+ long-form parent-facing content.

## Architecture

```
src/
  components/
    ui/         generic, dumb, reusable primitives (Button, Card, Badge)
    layout/     structural chrome shared across pages (Header, Footer, Nav)
    sections/   page-specific composed blocks (Hero, ScheduleGrid, ContactSection)
  content/
    articles/   long-form parent material (.md/.mdx, schema in content.config.ts)
    schedule/   one data file per class (.yaml, schema in content.config.ts)
    pages/      ONE DIRECTORY PER LANGUAGE (he/, ru/), the SAME filenames in
                each: one .md per nav-item page (מהו ויסות חושי / Частые
                вопросы, ...) with title, intro and the panels/FAQ the page
                is built from, all in frontmatter. Copy changes are edits
                here, never in a component. Adding a page means adding it to
                both directories — the build fails if a nav slug is missing
                from a locale.
  content.config.ts   schemas for the three collections above
  data/
    site.ts     non-visual, non-linguistic site-wide facts: nav slugs,
                contact info, socials
    i18n.ts     the two locales (he default and unprefixed, ru under /ru),
                each one's lang/dir, and every string the CHROME says in
                both — skip link, menu, footer, 404, the home page's two
                program cards. Page prose is not here; it's in content/.
  layouts/
    BaseLayout.astro   <html> shell, meta/SEO, imports global.css
  styles/
    tokens.css  ALL design tokens (color/type/spacing/radius/shadow) — the
                single source of truth. Edit values here, never in a component.
    global.css  imports Tailwind + tokens.css, base element resets
  assets/       images/icons for Astro's image pipeline (import + <Image />)
  pages/        routes — thin, just compose layouts/sections
public/         files served as-is at a fixed URL (favicon, robots.txt, ...)
```

Each `components/*` folder has its own README.md with the rule for what
belongs there. When asked to add something ("add a nav", "add the
schedule section", "add a button"), place it by that rule rather than
inventing a new location.

### Styling

Tailwind CSS v4, configured CSS-first — there is no `tailwind.config.js`.
- Every design decision (color, font, spacing, radius, shadow) is a
  token in `src/styles/tokens.css`, written under `@theme`, which makes
  it available as both a Tailwind utility (`bg-brand-600`,
  `rounded-card`, `p-section`) and a CSS var (`var(--color-brand-600)`).
- Never hardcode a color/spacing/font value in a component. If a value
  doesn't have a token yet, add it to `tokens.css` first, then use it —
  don't reach for an arbitrary Tailwind value (`bg-[#2563eb]`).
- Long-form article content (from the `articles` collection) renders
  through Tailwind Typography's `prose` classes, which are remapped
  onto this project's own `ink-*` color scale in `global.css` — so
  parent-facing articles automatically match the rest of the site.

### Languages

The site is Hebrew (default, at `/faq`) and Russian (at `/ru/faq`), via
Astro's i18n routing configured in `astro.config.mjs`.

- Hebrew is RTL and Russian is LTR. `BaseLayout` sets `dir` from the
  locale and that is the ONLY place direction is decided — components
  use logical properties (`ms-`/`me-`/`text-start`, `inset-inline`), never
  `left`/`right`, so both directions come out of one stylesheet.
- Any component that needs the language reads it with
  `currentLocale(Astro)`; it's never passed as a prop.
- A user-visible string in a component is a bug. Page prose goes in
  `src/content/pages/<locale>/`, chrome vocabulary in `src/data/i18n.ts`.
  TypeScript fails the build if a string exists in one language and not
  the other.
- The header's language switcher links to the SAME page in the other
  language, which works because the two content directories share their
  filenames. Keep them in sync.

### Content

- `articles`, `schedule` and `pages` are Astro content collections
  (`src/content.config.ts`) — add new parent material, classes or
  nav-item pages as new files under `src/content/articles/`,
  `src/content/schedule/` or `src/content/pages/<locale>/`, not as
  hardcoded markup in a page/component.
- A `pages` entry keeps its copy in frontmatter rather than in the
  markdown body: these pages are a stack of accented panels, not one
  flowing document, and that structure has to survive into the layout.
  One route renders all of them.
- `src/data/site.ts` holds the one copy of the nav's six slugs / contact
  info / socials — components read from it, they don't hardcode these
  values. It holds no words: a nav entry's LABEL comes from that page's
  own `navLabel` frontmatter in the current language, joined to the slug
  by `getNavItems(locale)`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
