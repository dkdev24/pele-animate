# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.

---

## Current Version

**0.1.0**

---

## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 prototype done (draw-in, stagger, edge dots); glyph packs and BFS sequencing not started.

---

## Last Session

2026-10-21: researched Pele 1.7 (public `icons` resolver and `@{icon}` syntax exist, so glyph packs need no fork), found the
Lab card style (`doverunner-lab/apps/web/components/ProductArt.*`), built the prototype, wrote PLAN.md, created the private repo.

---

## Next Actions

1. Phase 1: glyph registry + 6 glyphs (player, server, key, document, shield, phone); Multi-DRM card as pure Mermaid.
2. Phase 2: BFS sequencing + `%% pa:` override.

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
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
