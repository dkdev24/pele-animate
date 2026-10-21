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

2026-10-22: `preset-doverunner.js` (package, token, lock, database, bits-a/bits-b chip rows) on top of generic `glyphs.js` (now exports S/L/W). Demo has Forensic Watermarking (A/B segments with session ids) and packaging scenes; screenshot-verified. Wide art works as a wide glyph inside the square box (`h: 120`). docs-starlight branch left as is (uncommitted, vendored copy stale).

---

## Next Actions

1. Daniel: review docs-starlight trial branch; decide commit/push/revert.
2. Watch the motion on the new scenes; tune UNIT/TOKEN timing. Optional: `≠` / caption glyphs, lock-pill labels (DASH/HLS/CMAF).
3. Phase 6: packaging (npm, README, `preset-doverunner` split).

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
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
