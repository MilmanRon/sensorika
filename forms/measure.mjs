/**
 * Overflow check for the print sheets.
 *
 * Each .sheet is exactly one A4 page and clips what doesn't fit, so a
 * paragraph that grows by two lines doesn't reflow — it silently
 * disappears from the PDF. This loads the document in the same headless
 * Chrome that renders it, measures every sheet, and reports how much
 * each one is over or under.
 *
 * Run directly (`node forms/measure.mjs`) while adjusting a form;
 * build.mjs runs it first and refuses to render an overflowing sheet.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Which browser renders the forms.
 *
 * Prefer Playwright's chrome-headless-shell when it's on the machine: a
 * full Google Chrome that's already running interactively refuses to
 * shut down after --print-to-pdf / --dump-dom (it writes the file, then
 * hangs on its own updater and IPC), which turns every render into a
 * timeout. The headless shell has none of that and exits in a second.
 *
 * Set CHROME_BIN to point at either one explicitly.
 */
function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;

  const cache = join(process.env.HOME ?? '', 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    /* The install directory carries a build number (chromium_headless_shell-1228),
       so it has to be discovered rather than written down. Newest first. */
    const dirs = readdirSync(cache)
      .filter((d) => d.startsWith('chromium_headless_shell-'))
      .sort()
      .reverse();
    for (const d of dirs) {
      const bin = join(cache, d, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
      if (existsSync(bin)) return bin;
    }
  }

  return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

export const CHROME = findChrome();

/** Flags shared by every headless run: no GPU, no profile reuse, no phone-home. */
export const chromeFlags = (profile) => [
  '--headless=new',
  `--user-data-dir=${profile}`,
  '--no-sandbox',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-sync',
  '--disable-extensions',
  '--disable-default-apps',
  '--metrics-recording-only',
];

/**
 * The script injected into a copy of the document: it compares each
 * sheet's laid-out content against the box it's allowed to fill and
 * prints one line per sheet into the DOM, where --dump-dom picks it up.
 */
const PROBE = `
<script>
  const mm = (px) => (px / (96 / 25.4)).toFixed(1);
  const out = [...document.querySelectorAll('.sheet')].map((sheet, i) => {
    /* The sheet is a fixed-height box with overflow:hidden, so
       clientHeight is the page and scrollHeight is what the head, body
       and foot together actually wanted. Measuring .sheet-body instead
       reads 0 every time: it's flex:1, so it just grows past its share
       and never scrolls. */
    const over = sheet.scrollHeight - sheet.clientHeight;
    /* When nothing overflows, scrollHeight === clientHeight and says
       nothing about how close the sheet is to full — the gap between the
       last block of content and the footer's rule is what does. */
    const body = sheet.querySelector('.sheet-body');
    /* The signature block is pinned to the bottom of its sheet, so the
       slack on a signed sheet is the gap ABOVE it, not the (always zero)
       gap below. */
    const sig = body.querySelector('.signature');
    const [above, below] = sig
      ? [sig.previousElementSibling, sig]
      : [body.lastElementChild, sheet.querySelector('.sheet-foot')];
    const gap = below.getBoundingClientRect().top - above.getBoundingClientRect().bottom;
    return over > 0
      ? \`SHEET \${i + 1}: OVERFLOW +\${mm(over)}mm\`
      : \`SHEET \${i + 1}: fits, \${mm(gap)}mm spare\`;
  });
  document.title = 'MEASURE ' + out.join(' | ');
</script>
`;

export function measure(htmlPath) {
  const src = readFileSync(resolve(here, htmlPath), 'utf8');
  const dir = mkdtempSync(join(tmpdir(), 'sensorika-measure-'));
  try {
    /* The probe copy lives beside the real file so its relative <link>s
       and the logo still resolve. */
    const probePath = resolve(here, `.measure-${htmlPath}`);
    writeFileSync(probePath, src.replace('</body>', `${PROBE}</body>`));
    try {
      const dom = execFileSync(
        CHROME,
        [...chromeFlags(dir), '--dump-dom', '--virtual-time-budget=5000', `file://${probePath}`],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 },
      );
      const title = dom.match(/<title>MEASURE ([^<]*)<\/title>/);
      if (!title) throw new Error(`${htmlPath}: probe did not run`);
      return title[1].split(' | ');
    } finally {
      rmSync(probePath, { force: true });
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const html of process.argv.slice(2).length
    ? process.argv.slice(2)
    : ['form-1-health-declaration.html', 'form-2-participation-terms.html']) {
    console.log(html);
    for (const line of measure(html)) console.log(`  ${line}`);
  }
}
