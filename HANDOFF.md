# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.16.2** (published 2026-10-24; 0.16.1: 0.16.0: 10 new diagram types, S5 playground; consumers on `^0.15` need a range bump)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-24 (playground): colour pickers (5, start from the theme, Reset) and examples menu titled from each fence's `title="..."`, grouped by page; 0.16.1 released (journey at narrow widths); diagram-type examples rewritten as 5-7 step stories. Site-only change, no npm release.
2026-10-24 (architecture-beta): `endpoints()` now reads `A-B` / `1-A-B` edge ids too, so `architecture-beta` animates (steps, pins, step mode, icon packs via `(name)`); docs, README, FAQ, step-order, changelog, playground and docs icon scan updated. Probed only in the playground/docs page; no e2e. `stateDiagram-v2` added the same day (edge ends from path geometry; composite states untested). `C4Context` added too (no code change; steps, pins, step mode checked; Pele's row layout can hide arrowheads on same-row edges). `block-beta` added (no code change; Pele's routing is rough on diagonal neighbours). `classDiagram` and `erDiagram` added (edge ids `id_A_B_1` / `id_entity-A-0_entity-B-1_0`, written order). Tier 2 added: timeline, journey, gitGraph, gantt (`sequentialSteps()`; no pins; CSS fix for invisible text on fills).2026-10-25 (redesign): site redesigned with the Hallmark Bloom theme (`site/src/tokens.css`, `DESIGN.md`; Ranade via Fontshare CSS API, not self-hosted: licence). Custom domain pele-animate.danielkimdev.com live. Docs diagrams cycle five warm tones (`data-tone`, `live.ts`); the example is a 5-step round trip (home, getting-started, README, skill, playground default); home shows its source in an editor panel; playground Colors collapsed. Site-only, no npm release.
---

## Next Actions

1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Check step mode on a sequence diagram + phone width; check the live docs step mode.
3. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
5. Playground gaps: CodeMirror (icon completion, pin lint), Download SVG (phone-width tabs verified, header overflow fixed); e2e tests for `/icons` and `/playground`. Then S7 (a11y, OG). Still open: kepano/wallabyway replies, S7 a11y/OG, e2e tests, `vite dev` check. Next release 0.17.0.

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
