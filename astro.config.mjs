// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  /**
   * The site's public origin, and the only place it's written down.
   *
   * Everything absolute is derived from it: the canonical link and
   * og:url in BaseLayout (which emit nothing at all while this is unset,
   * rather than guessing at localhost) and every entry in the sitemap.
   *
   * THE APEX, NOT www. One of the two has to be canonical or the same
   * page exists at two addresses, and the apex is the shorter name and
   * the one people type. `www.sensorika.co.il` should be a redirect to
   * it rather than a second live copy.
   */
  site: 'https://sensorika.co.il',

  /**
   * No trailing slash, anywhere. `/about` and `/about/` are the same
   * document, so one of them has to be the canonical spelling or the
   * page exists at two addresses — and three separate things get to
   * have an opinion about which:
   *
   *   - site.ts derives every nav href as the bare `/about`.
   *   - wrangler.jsonc serves the bare form and 307s the slashed one
   *     ("drop-trailing-slash").
   *   - Astro, left alone, writes `/about/` into the canonical link,
   *     og:url and every sitemap entry, because `build.format` is
   *     'directory' and the emitted file is about/index.html.
   *
   * The third disagreed with the first two, which pointed every
   * canonical tag and sitemap URL at an address that immediately
   * redirects. This is what settles it.
   */
  trailingSlash: 'never',

  /**
   * TWO LANGUAGES, AND HEBREW KEEPS THE BARE PATHS.
   *
   * `prefixDefaultLocale: false` is the load-bearing line. Hebrew stays
   * at `/faq`, Russian goes to `/ru/faq`, and there is no `/he/faq` at
   * all. The site is already live at the unprefixed paths and already in
   * a sitemap under them — moving Hebrew under a prefix would break
   * every existing link and every indexed URL to gain nothing.
   *
   * Configuring i18n here rather than rolling the routing by hand is
   * what gives every component `Astro.currentLocale`, derived from the
   * URL. Without it the locale would have to be threaded as a prop
   * through Header → Nav → NavItem and through every section, and the
   * one component that forgot would silently render the wrong language.
   *
   * `redirectToDefaultLocale: false` leaves `/` alone: it's a real route
   * (src/pages/index.astro), not something to bounce off.
   */
  i18n: {
    defaultLocale: 'he',
    locales: ['he', 'ru'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    mdx(),
    /**
     * The sitemap has to be told about the languages too, or it lists
     * the Hebrew and Russian pages as fourteen unrelated URLs instead of
     * seven pages in two languages. With this it emits `xhtml:link`
     * alternates for each pair — the machine-readable half of the same
     * statement BaseLayout makes with its `hreflang` tags.
     */
    sitemap({
      i18n: {
        defaultLocale: 'he',
        locales: { he: 'he-IL', ru: 'ru-RU' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});