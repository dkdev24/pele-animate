# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.10.0** (prepared, committed locally; `npm publish` pending)

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session

2026-10-22 (later): added `cloud` (glyphs.js), `storage`, `plugin`, `variants`, `watermark`, `video` (camera), `media` (video tile + music note) and `encoder` (preset-doverunner.js: film frame → arrow → bit cells) glyphs for the docs `drm-concepts` diagram. Released as 0.10.0 (see WORKLOG). Tested by copying both files into docs-starlight `node_modules` (clear `node_modules/.vite` after).

Earlier 2026-10-22: docs-starlight PR #102 (`pele-animate@0.9.0`) merged to `main` = production deploy; repo made public, 0.9.0 on npm.

---

## Next Actions

1. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
2. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
3. Publish 0.10.0 (`npm publish`, 2FA), push, then docs-starlight installs it (range already `^0.10.0` there).

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
