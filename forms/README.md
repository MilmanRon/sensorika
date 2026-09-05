# Parent forms (PDF)

The two forms a parent fills in before a child joins the group program:

| source | output |
| --- | --- |
| `form-1-health-declaration.html` | `public/forms/sensorika-form-1-health-declaration.pdf` — הצהרת הורה על מצבו של הילד |
| `form-2-participation-terms.html` | `public/forms/sensorika-form-2-participation-terms.pdf` — התנאים הבסיסיים להשתתפות בתוכנית, plus the payment / absences / cancellation / insurance annex |

The **HTML is the source**; the PDFs under `public/forms/` are build
output, committed because the site serves them from a fixed URL. Change
copy here, then:

```
npm run forms
```

## Why HTML

These are Hebrew, RTL, and set in the site's own font (Rubik) on the
site's own palette. A browser is the one renderer this project already
has that gets all three right, so the forms are ordinary documents
printed to PDF by a headless Chrome rather than something assembled by a
PDF library.

Fonts are inlined as data URIs in `assets/fonts.css`, so a render needs
no network and comes out the same on any machine. Regenerate that file
only if the family or weights change:

```
node forms/fetch-fonts.mjs
```

## How a page works

One `<section class="sheet">` is one printed A4 page. A sheet is a fixed
297mm box that **clips** whatever doesn't fit — that's what keeps the
footer pinned to the bottom edge and the signature block above it, but it
also means a paragraph that grows by two lines silently disappears from
the PDF instead of reflowing.

So `build.mjs` measures every sheet before it renders anything and
refuses to build an overflowing one. To see where you stand while you're
editing:

```
node forms/measure.mjs                        # both forms
node forms/measure.mjs form-1-health-declaration.html
```

It reports, per sheet, either `OVERFLOW +Nmm` or how much room is left.

## Styling

`assets/print.css` holds the whole design. Its colors are the same
`color-mix()` expressions as `src/styles/tokens.css` — the forms live
outside the Tailwind build and can't use its utilities, so the tokens are
restated rather than approximated. A brand color that changes there has
to change here too; nothing else in these files holds a color.

The logo is read straight from `src/assets/brand/logo.svg`, so there's no
second copy of it to keep in sync.

## Chrome

`measure.mjs` picks the browser: Playwright's `chrome-headless-shell` if
it's on the machine, otherwise Google Chrome. A full Chrome that's
already running interactively writes the PDF and then hangs on its own
updater instead of exiting, which turns every render into a timeout —
the headless shell doesn't. `CHROME_BIN=/path/to/chrome` overrides.
