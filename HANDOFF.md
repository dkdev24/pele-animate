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

2026-10-22: repo made **public**, `pele-animate@0.9.0` published to npm (account `danielkimdev`; registry briefly showed a `0.0.0-stage` placeholder before 0.9.0 appeared). docs-starlight now uses the package (vendor copy removed): PR https://github.com/doverunner/docs-starlight/pull/102 against `main`, awaiting Daniel's review. No staging deploy was wired to the PR (workflow deploys on push to `main`/`qa`; no `qa` branch on the remote).

---

## Next Actions

1. Daniel: review PR #102 (staging/preview route is undecided), then merge or request changes.
2. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
3. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.
- No fork needed so far. Pele source clone for reference: `~/Sites/pele-src` (outside this repo).

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
