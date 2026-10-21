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

2026-10-22: phase 4. Trial in `docs-starlight` on branch `feat/pele-animate-trial` (uncommitted, awaiting Daniel): files vendored in `src/vendor/pele-animate/`, opt-in per diagram with a ```` ```mermaid animate ```` fence (`remark-pele.mjs`), `pele-mount.ts` loads the lib only when a page has one, CSS via `customCss` (dynamic CSS import in the mount script was not emitted by the build). `/drm-concepts/` EN diagram animated; verified in built preview, light+dark. Scene theme vars now `:where()` so host CSS wins.

---

## Next Actions

1. Daniel: review the trial page, decide commit/push of the docs-starlight branch (push of a branch is not a prod deploy; merge to `main` is).
2. Phase 5 spike: fork `shapes` hook in `~/Sites/pele-src` for card-sized nodes; then redraw a diagram with glyphs.

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
