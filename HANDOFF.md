# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.1.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session

2026-10-22: phase 3. `watch()` adds `.pa-scene` (tinted panel, `--pa-*`/`--pele-*` theming, light/dark incl. `data-theme`), focusable, click/Enter replays intro. Screenshots at 390px light+dark: Pele flips to vertical, no overflow. Daniel confirmed the demo looks fine.

---

## Next Actions

1. Phase 4: docs-starlight integration behind a flag on `/drm-concepts/` (one call in `src/scripts/pele-mount.ts`, import css, glyph pack).

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.
- Fork (`pele-motion`) only if phases 1-3 can't reach the card look. Pele source clone: `~/Sites/pele-src` (outside this repo).

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 glyphs |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
