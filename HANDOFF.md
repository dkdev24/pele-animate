# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.1.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) done; BFS sequencing not started.

---

## Last Session

2026-10-21: phase 1. `glyphs.js` (`registerGlyphs`, `icons`) + player/server/key/document/shield/phone; demo renders Multi-DRM, APK/IPA flows from pure Mermaid via `mount(el, text, { icons })`. Glyphs are small (48px box, fixed by Pele); layout of bidirectional edges is messy.

---

## Next Actions

1. Phase 2: BFS sequencing + `%% pa:` override.

---

## Open Issues

- Do sequence diagram edges use `.pele-edge`? Verify in phase 2.
- Fork (`pele-motion`) only if phases 1-3 can't reach the card look. Pele source clone: `~/Sites/pele-src` (outside this repo).

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 glyphs |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
