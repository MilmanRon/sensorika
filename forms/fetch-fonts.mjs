/**
 * One-shot helper: turn the Google Fonts CSS for Rubik into a
 * self-contained stylesheet with the woff2 files inlined as data URIs.
 *
 * The forms are rendered to PDF by a headless Chrome that must produce
 * the same bytes on any machine, so the print HTML may not depend on a
 * network font. Only the two subsets these forms actually set — latin
 * (the "Sensorika" wordmark) and hebrew (everything else) — are kept.
 */
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const css = await (
  await fetch(
    'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap',
    { headers: { 'User-Agent': UA } },
  )
).text();

/* The CSS is a run of /* subset *\/ @font-face {...} blocks. */
const blocks = css.split(/\/\*\s*/).slice(1);
const keep = ['latin', 'hebrew'];
const out = [];

for (const block of blocks) {
  const subset = block.slice(0, block.indexOf(' ')).trim();
  if (!keep.includes(subset)) continue;
  const face = block.slice(block.indexOf('@font-face'));
  const url = face.match(/url\((https:[^)]+)\)/)[1];
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  out.push(
    `/* ${subset} */\n` +
      face
        .replace(/url\(https:[^)]+\)/, `url(data:font/woff2;base64,${buf.toString('base64')})`)
        .trim(),
  );
}

await (await import('node:fs/promises')).writeFile('assets/fonts.css', out.join('\n\n') + '\n');
console.log(`wrote assets/fonts.css — ${out.length} faces`);
