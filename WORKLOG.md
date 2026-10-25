# WORKLOG.md

Persistent project history. Append entries; do not edit past entries.

---

## v0.1.0 — Repository Initialization

**Date:** 2026-10-21

### Changes

- Prototype post-processor for Pele SVG (edge draw-in, node stagger, hover edge dots, reduced-motion).
- `demo.html` with a flowchart and a sequence diagram.
- `PLAN.md` dev plan; private repo `dkdev24/pele-animate`.

### Status

Prototype only; glyph packs and choreography pending.

---

## v0.2.0 — Glyph registry

**Date:** 2026-10-21

### Changes

- `glyphs.js`: `registerGlyphs`, `icons` resolver, 6 glyphs; demo uses Pele's `@{ icon }` syntax.

### Status

Glyphs render in stock Pele; size capped at Pele's 48px icon box (fork `shapes` hook is the fix, PLAN phase 5).

---

## v0.3.0 — Sequenced choreography

**Date:** 2026-10-21

### Changes

- BFS timeline for flowcharts, message-order timeline for sequence diagrams, `%% pa:` pinning, WAAPI token loop on hover/focus, `pa-done` skips the intro after resize re-render.
- Fixed dashed edges turning solid after draw-in (dash now lives in the keyframes).

### Status

Timeline and tokens verified numerically; visual polish (phase 3) pending.

---

## v0.4.0 — Scene frame

**Date:** 2026-10-22

### Changes

- `.pa-scene` panel + theming vars, dark mode, `replay()` on click/Enter, focusable container.

### Status

Ready to integrate into docs-starlight (phase 4).

---

## v0.5.0 — docs-starlight trial

**Date:** 2026-10-22

### Changes

- Scene theme vars wrapped in `:where()` so a host stylesheet can override them.
- Trial integration in docs-starlight (branch, not merged); opt-in via `mermaid animate` fence.

### Status

Works in a built preview, light and dark. Not yet reviewed by Daniel; plain diagrams without icons.

---

## v0.6.0 — Fork spike

**Date:** 2026-10-22

### Changes

- `fitGlyphs()` + `.pa-art`: large frameless glyphs from stock Pele `h:` sizing. Fork judged unnecessary for size.

### Status

Big glyph look achieved; stroke weight and routing polish pending.

---

## v0.7.0 — Glyph redraw

**Date:** 2026-10-22

### Changes

- Thin-stroke glyph group, richer player/phone, panel-colored edge-label backgrounds, Multi-DRM demo with bidirectional edges.

### Status

Big-glyph scenes look close to the Lab cards; wide nodes and more glyphs pending.

---

## v0.8.0 — DoveRunner preset pack

**Date:** 2026-10-22

### Changes

- `preset-doverunner.js`: package, token, lock, database, bits-a, bits-b glyphs; FWM and packaging demo scenes.

### Status

Generic core plus preset split in place; packaging (phase 6) pending.

---

## v0.8.1 — Packaging

**Date:** 2026-10-22

### Changes

- Package exports, README, LICENSE; tarball verified in a clean Vite app. Version in package.json is 0.8.0; not published.

### Status

Publishable; waiting on the publish decision.

---

## v0.8.2 — Long-diagram pacing

**Date:** 2026-10-22

### Changes

- `MAX_INTRO` caps the intro for long diagrams; smaller scene padding on phones; README disclaimer.

### Status

All 52 docs-starlight diagram pages mount in the trial branch.

---

## v0.9.0 — Public release

**Date:** 2026-10-22

### Changes

- Repo made public, first npm publish (`pele-animate`). Internal repo paths removed from docs.

### Status

Public; docs-starlight switches from the vendored copy to the package.

---

## v0.10.0 — Docs diagram glyphs

**Date:** 2026-10-22

### Changes

- New glyphs: `cloud` (`glyphs.js`); `video`, `media`, `encoder`, `storage`, `plugin`, `variants`, `watermark` (`preset-doverunner.js`). README glyph list updated.
- `animate()` equalizes sequence participant box heights per row (`equalizeActors`); scene CSS bolds group/box titles.
- Checked: sequence-diagram participants ignore `@{ icon }` (Pele renders the id letters), so glyphs apply to flowcharts only.

### Status

Published to npm; docs-starlight installed it (`^0.10.0`).

---

## v0.11.0 — Step-by-step playback

**Date:** 2026-10-24

### Changes

- `watch()`: click/Enter enters step mode (previous / play-pause / next bar, Space, ←/→, Esc, ✕ to leave). One step per BFS level or sequence message; `animate()` exposes `svg.paSteps`. `{ controls: false }` keeps click-to-replay.
- README "Compare" section: Mermaid vs Pele vs pele-animate, animated GIFs in `examples/` (`compare.html`, `capture.sh`; images use absolute raw URLs so the npm page shows them).

### Status

Published to npm and GitHub release. docs-starlight bumped to `^0.11.0` (`29b0133`, pushed to main).

---

## v0.12.0 — Edge pins, step-order skill

**Date:** 2026-10-24

### Changes

- `%% pa: 3=A>B` pins the edge from A to B to a step (`parseOrder` returns `'X>Y'` keys; `animate()` uses them for intro timing and step mode). `svg.paSteps` documented.
- `.claude/skills/diagram-step-order/` (`SKILL.md`, `steps.js`): method for reviewing diagram step order against page text. Repo only, not in the npm `files`.
- Step controls: SVG icons and a host-margin reset so the buttons align; previous/next use `aria-disabled` so their own tooltip shows.

### Status

Published to npm and GitHub release; docs-starlight bumped to `^0.12.0`.

---

## v0.13.0 — Tabler packs, doverunner- namespace

**Date:** 2026-10-24

### Changes

- `pele-animate/tabler/<category>`: 4,368 Tabler Icons (MIT, 3.49.0) outline icons in 36 category modules, generated by `scripts/build-tabler.mjs`; stroke width via `--pa-stroke`; `registerTabler()`; notice in `THIRD-PARTY-NOTICES.md`.
- All 20 illustrated glyphs renamed `doverunner-<name>` and moved into `preset-doverunner.js`; `glyphs.js` is registry only. `icons()` returns a neutral rounded square for unknown names (Pele ships no icons).
- docs-starlight diagrams migrated to the new names (238+ uses, 34 files).

### Status

Breaking for `^0.12` consumers (icon names, glyphs moved). Published to npm and GitHub release; docs-starlight must bump to `^0.13.0`.

---

## Site planning (unversioned)

**Date:** 2026-10-24

### Changes

- `SITE_DEV_PLAN.md`: plan for pele-animate.danielkimdev.com, the single-source `/docs`, and agent skills (phases S0 to S8).
- `SITE_FRAMEWORK_RESEARCH.md`: researched Astro alternatives; spiked SvelteKit 3 and Nuxt 4 + Nuxt Content in scratch dirs (docs from outside the app, `live` fence, 4,368-icon browser, cold JS per route). Decision: **SvelteKit 3** with `adapter-static`; Astro is the fallback.
- README now uses Tabler `computers` icons in its example; `a3.gif` regenerated.

### Status

Planning only, no code in the repo beyond docs. No npm release since 0.13.0. Open decisions in `SITE_DEV_PLAN.md` §13.

---

## S0 to S2 — foundation, types, docs, skills (unversioned, unreleased)

**Date:** 2026-10-24

### Changes

- pnpm workspace (`.`, `site`), CI workflow, root `wrangler.toml`, placeholder `site/`; `npm pack` file list unchanged by the migration.
- `types/*.d.ts` wired through `exports` (type-checked from a packed tarball).
- `docs/` (16 pages) and a short README; `scripts/check-docs.mjs` (`pnpm test`) renders every Mermaid fence and checks icon names.
- `skills/pele-animate` (`verify.js`, generated `references/categories.md`) and `skills/diagram-step-order` (moved from `.claude/skills`, symlinked back).
- Skill test: a fresh subagent with only the installed skill built a working 3-icon, 3-step diagram in an empty Vite app; verify output `{diagrams:1, steps:[3], emptyIcons:[], fallbackIcons:[]}`, independently re-checked.

### Status

Committed and pushed; not published to npm (next release 0.14.0). Cloudflare Pages project created by Daniel afterwards (https://pele-animate.pages.dev/, placeholder). S3 on hold.

---

## v0.14.0 — Types, docs, agent skills

**Date:** 2026-10-24

### Changes

- `types/` (TypeScript declarations), `docs/` (16 pages) and `skills/` (`pele-animate`, `diagram-step-order`) shipped in the npm package; short README; pnpm workspace, CI, placeholder site on Cloudflare Pages.
- npm `description` and README now describe it as step order, step playback and icons (not a theme package).

### Status

Tagged and pushed; npm publish and GitHub release follow. Site (S3) on hold pending upstream reply.

---

## S3 — site shell (unversioned; site deploys on push)

**Date:** 2026-10-24

### Changes

- `site/`: SvelteKit 3 + adapter-static; docs rendered from `../docs`; live diagrams; intro, changelog, RSS, `llms.txt`, `.md` siblings, sitemap, 404; `DESIGN.md`; `site/scripts/check-site.mjs` in `pnpm build`.
- Gotchas hit: TypeScript 7 breaks SvelteKit's tsconfig loading (pin 6); rest params keep the trailing slash under `trailingSlash: 'always'` (use `[slug]`); `+server.ts` endpoints need their own `prerender = true`.

### Status

Live on pele-animate.pages.dev, verified. Custom domain, `/icons`, `/playground`, e2e tests pending.

## S4 + v0.15.0 — icon browser, `prepare()`

**Date:** 2026-10-24

### Changes

- `prepare(source)` export: pads icon-node labels narrower than `h` (non-breaking spaces between zero-width word joiners, since Pele trims plain whitespace). Cause: Pele sizes an icon node's layout box from its label but draws the icon at `h`, so edge ends and arrowheads landed under the icon. Use `mount(el, prepare(src), { icons })`; pass the original `src` to `watch()`. Width is an estimate (about 7 px per character); a Pele fix (`max(label, h)`) would make it unnecessary.
- Site: `/icons` browser and `/icons.json`. `build-tabler.mjs` also reads the npm `@tabler/icons` package (categories and tags from its `icons.json`) and emits `icons.json`.

### Status

Not yet verified: label-less icon nodes, circle forms, phone width. Consumers on `^0.13` or `^0.14` need an explicit range bump and the `prepare()` call.

## S5 — playground (unversioned; site deploys on push)

**Date:** 2026-10-24

### Changes

- `/playground`: textarea editor (no CodeMirror yet), preview mounts the real `prepare()` + `mount()` + `watch()` into a fresh node per render (250 ms debounce), controls for stroke, preview width, custom `--pa-solid`/`--pa-light`, step controls on/off, examples menu from the docs' `live` fences, share link (`?s=` plain base64url: a `#` fragment made the prerender link check fail), Copy Mermaid, Copy code snippet. Unknown icon names are flagged from `icons.json`; Pele parse errors show inline. Icon packs load by the names used.
- Docs: every live example gets an "Open in playground" link.

### Status

Verified: docs link opens the diagram, edit re-renders, bad icon warning, parse error inline. Not done: CodeMirror completion and lint of pins, Download SVG, own light/dark toggle (follows the site), tabs at phone width not checked, e2e tests.

## v0.16.0 — more diagram types

**Date:** 2026-10-24

### Changes

- New animated types: `architecture-beta`, `stateDiagram-v2`, `C4Context`, `block-beta`, `classDiagram`, `erDiagram` (flowchart-style BFS; `endpoints()` reads each type's edge-id pattern, `geoEndpoints()` reads state edges from the path geometry), and `timeline`, `journey`, `gitGraph`, `gantt` (`sequentialSteps()`: one step per item in reading order, no pins).
- CSS: text drawn with `var(--_bg)` on solid fills now uses the panel surface (it was transparent).
- Playground `/playground` and its docs links (S5) shipped before this release.

### Status

Checked on small examples in dark mode only; light mode, long diagrams, composite states, C4 boundaries, cherry-picks, Korean docs and e2e are untested.

## v0.16.1 — journey at narrow widths

**Date:** 2026-10-24

### Changes

- `sequentialSteps()` handles Pele's vertical journey layout (`pele-journey-step` nodes with the face inside, separate edge paths). Docs: the diagram-type examples were rewritten as 5 to 7 step stories with pins.

### Status

Checked at 1280 px and 400 px; light mode untested.

## Playground colours and example titles (unversioned; site deploys on push)

**Date:** 2026-10-24

### Changes

- Colour controls: five pickers (`--pa-solid`, `--pa-light`, `--pele-surface`, `--pa-bg`, `--pele-fg`) set inline on the `.pa-scene` element, initial values read from the computed theme, Reset clears. The old two-picker version looked broken because `--pa-light` only fills groups and the background and node fill were never overridden.
- Examples menu: each `live` fence carries `title="Type: what it shows"` (parsed in `getExamples()`), grouped by docs page with `<optgroup>`.

### Status

Checked in a local build (dark theme). Light theme, phone width for the new colour fieldset and e2e tests are untested.

## v0.16.2 — edge pins in either order

**Date:** 2026-10-24

### Changes

- `animate()`: an edge pin `X>Y` also matches `Y>X` when the diagram has no opposite edge (`pinOf`). Pins written against the recorded order (class and ER relationships, undirected architecture edges) were ignored, so every edge showed with step 1. Documented in `step-order.md`.

### Status

Checked on class, architecture and state repro cases and the step-order flowchart examples; ER with both directions present untested.

## Unreleased — site redesign (Bloom) and round-trip example

**Date:** 2026-10-25 (work done 2026-10-24 to 25)

### Changes

- Custom domain pele-animate.danielkimdev.com attached to the Pages project (CNAME in the danielkimdev.com zone); links in README, docs and AGENTS now use it.
- Site redesigned with the Hallmark Bloom theme: `site/src/tokens.css` + `base.css`, rules in `DESIGN.md`. Ranade from the Fontshare CSS API (the licence bars committing the files to a public repo), Geist Mono via Fontsource; Inter and JetBrains Mono removed. Light and dark; Shiki high-contrast themes.
- Home: Corridor hero with the live diagram on a generated grid; the diagram's Mermaid source in an editor panel (small in-page highlighter); the example is a five-step round trip, also used in getting-started, README, the skill and the playground default.
- Docs diagrams cycle five warm tones (`data-tone`, set in `live.ts`) and use a warm eight-colour `--pele-series-*` set; all colours are `:root` tokens.
- Playground: Colors is a collapsed `<details>`, the scene starts in the site colours, the examples `<select>` is styled.

### Status

`pnpm build` (site check) and `pnpm test` pass; sloplint 0 FAIL on the home page, 0 FAIL on the other routes at the last full sweep (waived 39b, 72, 77). Fresh-context finish review not run. Docs and playground not re-checked visually after the last changes. No npm release; next is 0.17.0.

---

## Site polish after v0.17.1 (no release)

**Date:** 2026-10-25

### Changes

- Homepage hero diagram no longer stretches on narrow screens; 404 page designed (`+error.svelte`).
- "View as Markdown" no longer goes to `.md/` (`data-sveltekit-reload`, `trailingSlash = 'never'` on the endpoint).
- Code blocks: copy button (Tabler `copy`/`copy-check`) and package-manager tabs for install blocks, added at runtime by the layout action `codecopy`; docs Markdown stays plain.
- "Open in playground" shares a row with the "Mermaid source" summary.

### Status

`pnpm build` passes; checked in a browser at desktop width (phone width not checked for tabs, copy, alignment).

---

## v0.17.1 — zoom vs step mode

**Date:** 2026-10-25

### Changes

- Fix: clicks on Pele's zoom buttons no longer enter step mode (`.pele-zoom` ignored by the container click handler).
- Decision: zoom is disabled in step mode. Controls hidden via CSS, zoom reset on enter, restored on exit. Reason: Pele's zoom owns ←/→/Esc when zoomed, step mode owns them too; Pele's +/- keys do not work in step mode anyway.
- `demo.html`: wide diagram in a 320px box with `zoom: true` for testing. Documented in `docs/step-order.md`.

### Status

`pnpm test` passes. Browser check by Daniel.

---

## v0.17.0 — remove replay and controls option

**Date:** 2026-10-25

### Changes

- Breaking: `replay()` and `watch(..., { controls: false })` removed; click always enters step mode. Migrating section added.
- Playground share links are plain URL-encoded (old base64url links no longer open).
- Cleanup from a ponytail audit: root PNG duplicates, empty `preset-doverunner.d.ts`, repeated slug regex in `build-tabler.mjs`.

### Status

`pnpm test` and `pnpm build` pass.
