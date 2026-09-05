# _proposed/

Proposed visual revisions, parked here for side-by-side review. **Nothing
in `src/components/` was modified** — each file here is a copy of a
shipped component with the look reworked, so `/playground/<slug>` can
render "Current" and "Proposed" one above the other.

Underscore-prefixed, so Astro doesn't route this folder. That's also why
it isn't in `src/components/`: the folder READMEs there describe what a
component *is*, and "a second visual take on an existing component,
pending sign-off" isn't a category the site should ship with.

Naming: `<Name>V2.astro` mirrors `<Name>.astro`. The pieces without a V2
suffix (`SectionHeading`, `Icon`, `WaveDivider`, `Decor`, `ProsePanel`,
`ProsePage`, `FaqList`, `PageBackdrop`, `HeroMethod`, `SiteFooter`) are
new and have no current counterpart.

`/playground/full-page` is the home page assembled out of them —
backdrop, header, HeroMethod, ProgramsV2, footer.

Once a direction is picked: move the accepted file over its counterpart
in `src/components/`, drop the `V2`, fold `src/styles/proposed-tokens.css`
into `tokens.css`, and delete this folder.
