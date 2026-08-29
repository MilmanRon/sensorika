# sections/

Page-specific composed blocks: `Hero`, `MethodTeaser`, `ScheduleGrid`, `ContactSection`.

Rules:
- These are the things a page is built out of — one section per meaningful chunk of a page (e.g. "add a nav here" -> `layout/Nav.astro`, "add the schedule here" -> `sections/ScheduleGrid.astro`).
- Free to query content collections (`astro:content`) and compose `ui/` + `layout/` primitives.
- Named after what they contain, not the page they live on (`ScheduleGrid`, not `HomeScheduleBlock`) so they stay reusable if the sitemap changes.
