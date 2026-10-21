# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.8.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session

2026-10-22: kept private (no npm publish). Applied to **all** diagrams on docs-starlight branch `feat/pele-animate-trial` (uncommitted): `remark-pele` adds `pele-animate` to every fence, `pele-mount.ts` always animates, vendored copy refreshed, `.pele-diagram.pa-scene { --pele-bg: var(--pa-bg) }` so autonumber badges are readable. Lib: intro capped at ~3 s for long diagrams (`MAX_INTRO`), 12px scene padding under 600px, README notes it is unofficial. Checked 52 built pages: every diagram mounts. Not eyeballed: KO pages, state diagram, phone width after padding change.

---

## Next Actions

1. Daniel: review docs-starlight trial branch; decide commit/push/revert.
2. Daniel: npm stays private for now; before any public publish reconsider the name (no trademark text found in Pele's repo, MIT covers code only).
3. Watch the motion on the new scenes; tune UNIT/TOKEN timing. Optional: `≠` / lock-pill glyphs; types; a smoke test.
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
