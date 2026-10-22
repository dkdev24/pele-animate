# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.10.0** (published to npm 2026-10-22)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session

2026-10-22 (later): 0.10.0 published (glyphs `cloud`, `video`, `media`, `encoder`, `storage`, `plugin`, `variants`, `watermark`; `animate()` equalizes sequence participant box heights; bold titles). Public `CHANGELOG.md` added; tags `0.9.0` (`500cdc0`) and `0.10.0` (`9573bc8`) pushed, each matching its npm tarball. Test trick: copy files into docs `node_modules/pele-animate`, clear `node_modules/.vite`.

Earlier 2026-10-22: docs-starlight PR #102 (`pele-animate@0.9.0`) merged to `main` = production deploy; repo made public, 0.9.0 on npm.

---

## Next Actions

1. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
2. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
3. docs-starlight is on `^0.10.0` (installed, built). Next release 0.11.0; docs then needs a range bump.

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `CHANGELOG.md` | Public changelog (add an entry per release; not yet in npm `files`) |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
