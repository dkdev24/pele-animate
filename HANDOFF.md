# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.1.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; scene frame/theming not started.

---

## Last Session

2026-10-21: phase 2. `animate(svg,{source})`/`watch(container, source)`: nodes by BFS level (or `%% pa: 1=P 2=O 3=D`), edge draws after its source, tokens cross edges in order in a hover loop (WAAPI). Sequence diagrams: actors, then messages in order (`.pele-message`). Verified timeline values and token order in a browser; intro motion not eyeballed.

---

## Next Actions

1. Phase 3: scene frame, captions, theming, hover replay of intro, phone-width screenshots. Eyeball the intro first.

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
