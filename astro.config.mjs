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

  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});