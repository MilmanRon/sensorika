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
  content.config.ts   schemas for the two collections above
  data/
    site.ts     non-visual site-wide facts: nav links, contact info, socials
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

### Content

- `articles` and `schedule` are Astro content collections
  (`src/content.config.ts`) — add new parent material or classes as new
  files under `src/content/articles/` or `src/content/schedule/`, not
  as hardcoded markup in a page/component.
- `src/data/site.ts` holds the one copy of nav links / contact info /
  socials — components read from it, they don't hardcode these values.

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
