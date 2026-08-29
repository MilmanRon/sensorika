# layout/

Structural chrome shared across most/all pages: `Header`, `Footer`, `Nav`, `Container`.

Rules:
- Pulls shared facts (nav links, contact info) from `src/data/site.ts`, not hardcoded strings.
- Composed from `ui/` primitives where possible.
- If it only shows up on one page, it's a `sections/` component instead.
