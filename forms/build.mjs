/**
 * Render the parent forms to PDF.
 *
 * Headless Chrome rather than a PDF library: these are Hebrew, RTL, and
 * typeset in the site's own font, and a browser is the only renderer
 * this project already has that gets all three right. The HTML is the
 * source; public/forms/*.pdf is build output, regenerated with
 * `npm run forms` whenever the copy changes.
 *
 * Fonts are inlined as data URIs (see fetch-fonts.mjs), so a render
 * needs no network and produces the same document on any machine.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHROME, chromeFlags, measure } from './measure.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/forms');

const forms = [
  ['form-1-health-declaration.html', 'sensorika-form-1-health-declaration.pdf'],
  ['form-2-participation-terms.html', 'sensorika-form-2-participation-terms.pdf'],
];

mkdirSync(outDir, { recursive: true });

for (const [src, out] of forms) {
  /* A sheet clips whatever doesn't fit on its page, so an overflow is
     copy that silently never reaches the PDF. Refuse to render one. */
  const sheets = measure(src);
  const spilled = sheets.filter((s) => s.includes('OVERFLOW'));
  if (spilled.length) {
    console.error(`${src}\n  ${sheets.join('\n  ')}`);
    throw new Error(`${src}: content does not fit — nothing rendered`);
  }

  /* A throwaway profile per run: Chrome won't start headless against a
     profile the user's own browser already has open. */
  const profile = mkdtempSync(join(tmpdir(), 'sensorika-forms-'));
  try {
    execFileSync(
      CHROME,
      [
        ...chromeFlags(profile),
        '--no-pdf-header-footer', // the sheets draw their own footer
        '--virtual-time-budget=5000',
        `--print-to-pdf=${join(outDir, out)}`,
        `file://${resolve(here, src)}`,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    );
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
  /* A stray blank page is the other silent failure here: one CSS rule
     that adds a margin to a sheet spills its last centimetre onto a page
     of its own, and the PDF still "renders". Skia writes the page tree
     uncompressed, so the count is readable straight off the file. */
  const pdf = readFileSync(join(outDir, out), 'latin1');
  const pages = Number(pdf.match(/\/Type \/Pages\s*\/Count (\d+)/)?.[1]);
  if (pages !== sheets.length) {
    throw new Error(`${out}: ${sheets.length} sheets rendered as ${pages} PDF pages`);
  }

  console.log(`public/forms/${out}  (${pages} pages)`);
}
