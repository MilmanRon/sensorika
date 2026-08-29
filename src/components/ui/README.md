# ui/

Generic, dumb, reusable primitives: `Button`, `Card`, `Badge`, `Input`, `Tag`...

Rules:
- No site-specific copy or content-collection queries in here — props in, markup out.
- Style only with tokens/utilities from `src/styles/tokens.css` (colors, spacing, radius, shadow). Never a hardcoded hex/px value.
- If a component only ever appears once on one page, it probably belongs in `sections/`, not here.
