# layout/

Structural chrome shared across most/all pages: `Header`, `Footer`, `Nav`, `LangSwitcher`, `Container`.

Rules:
- Pulls shared facts (nav links, contact info) from `src/data/site.ts`, and every word it says from `src/data/i18n.ts` — never a hardcoded string. The site is Hebrew and Russian, so a literal in a component is a component that can only be read in one of them.
- Reads the current language with `currentLocale(Astro)` rather than taking it as a prop: it's a property of the URL, identical for every caller.
- Composed from `ui/` primitives where possible.
- If it only shows up on one page, it's a `sections/` component instead.
