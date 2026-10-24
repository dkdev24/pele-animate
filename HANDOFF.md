# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.15.0** (published to npm, tagged, GitHub release 2026-10-24; adds `prepare()`)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-24 (S5): `/playground` built (see WORKLOG): textarea editor, real preview, controls, examples, `?s=` share links, "Open in playground" under every docs live example. Not committed/pushed yet.
2026-10-24 (later): found the cause of hidden arrowheads on icon nodes (Pele sizes the layout box from the label, draws the icon at `h`), added `prepare(src)`, released 0.15.0, bumped docs-starlight to `^0.15.0` (`0cdd7b8`, pushed). S4 details below.
2026-10-24 (S4): `/icons` browser built (search by name + tag with name-first ranking, 37 category chips incl. `doverunner`, stroke slider via `--pa-stroke`, click copies snippet, import line, 240-cell paging, per-category lazy markup) and `site/static/icons.json` (4,386 names). `build-tabler.mjs` now takes category and tags from the npm `@tabler/icons` package too (`icons.json`), strips its bounding-box path, and emits `icons.json`; `tabler/*.js` output unchanged. Nav, sitemap, llms.txt, docs/icons.md, CHANGELOG updated. `pnpm build` passes (0 problems). Verified in headless browser: `lock` 63 ms, `load-balancer` 26 ms.  Earlier: 0.14.0 released, S3 live at https://pele-animate.pages.dev/.
---

## Next Actions

0. Check live docs.doverunner.com after the `0cdd7b8` deploy (short-label icon diagrams: `fwm-concepts`, `ffmpeg-filter`; layouts may shift).
1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Check step mode on a sequence diagram + phone width; check the live docs step mode.
3. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
4. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
5. Playground gaps: CodeMirror (icon completion, pin lint), Download SVG, phone-width tabs check; e2e tests for `/icons` and `/playground`. Then S7 (domain, a11y, OG). Still open: kepano/wallabyway replies, custom domain at S7, e2e tests, `vite dev` check. Next release 0.16.0.

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md`, `SITE_DEV_PLAN.md`, `SITE_FRAMEWORK_RESEARCH.md` | Dev plan; public site/docs/skills plan (SvelteKit); framework spikes and numbers |
| `CHANGELOG.md` | Public changelog (add an entry per release; not yet in npm `files`) |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry (`icons`, `registerGlyphs`, `registerTabler`); no art; unknown names get a fallback square |
| `preset-doverunner.js` | 20 illustrated `doverunner-*` glyphs |
| `tabler/*.js`, `scripts/build-tabler.mjs` | 36 generated Tabler category packs (MIT, notice in `THIRD-PARTY-NOTICES.md`) |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
