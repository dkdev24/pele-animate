# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.9.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session

2026-10-22: docs-starlight PR #102 (consumes `pele-animate@0.9.0`) tested on the branch preview and merged to `main` = production deploy. Local branches deleted; the `pele-src` reference clone was removed (re-clone `obsidianmd/pele` only if a fork becomes necessary). Earlier the same day: repo made public, 0.9.0 published to npm.

---

## Next Actions

1. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
2. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
3. Next release is 0.10.0 (stay on 0.x); docs-starlight then needs a `^0.10.0` range bump.

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.
- No fork needed so far. Pele source clone (`pele-src`) was removed; re-clone `obsidianmd/pele` if needed.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
