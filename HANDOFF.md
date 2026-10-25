# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.17.1** (published 2026-10-25: zoom buttons no longer start step mode, zoom hidden in step mode; 0.17.0 published 2026-10-25: removed `replay()` and `watch` `controls: false`, share links URL-encoded; 0.16.2 published 2026-10-24; 0.16.1: 0.16.0: 10 new diagram types, S5 playground; consumers on `^0.15` need a range bump)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-25 (zoom vs step mode, 0.17.1, published): Pele's zoom buttons sit inside the container, so their clicks bubbled to the step-mode click handler. Fix: ignore clicks in `.pele-zoom`; zoom controls hidden in step mode (CSS) and zoom reset on enter. Decision: no zoom in step mode (arrows/Esc conflict; Pele's +/- keys don't work there either). `demo.html` has a 320px `data-zoom` diagram to test. docs-starlight bumped to `^0.17.1` and pushed.
2026-10-25 (site polish, no npm release): homepage diagram keeps natural size under 48rem; styled `+error.svelte` 404; "View as Markdown" link `data-sveltekit-reload` (trailingSlash 'always' rewrote `.md` to `.md/`); copy-to-clipboard button on every `pre` and npm/pnpm/yarn/bun tabs for install blocks (both runtime, in `+layout.svelte` `codecopy`, so docs Markdown is unchanged; choice kept in localStorage `pm`); "Open in playground" aligned with "Mermaid source". Older sessions (playground colours, diagram types, redesign) are in WORKLOG and CHANGELOG.
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
