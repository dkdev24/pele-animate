# WORKLOG.md

Persistent project history. Append entries; do not edit past entries.

---

## v0.1.0 — Repository Initialization

**Date:** 2026-10-21

### Changes

- Prototype post-processor for Pele SVG (edge draw-in, node stagger, hover edge dots, reduced-motion).
- `demo.html` with a flowchart and a sequence diagram.
- `PLAN.md` dev plan; private repo `dkdev24/pele-animate`.

### Status

Prototype only; glyph packs and choreography pending.

---

## v0.2.0 — Glyph registry

**Date:** 2026-10-21

### Changes

- `glyphs.js`: `registerGlyphs`, `icons` resolver, 6 glyphs; demo uses Pele's `@{ icon }` syntax.

### Status

Glyphs render in stock Pele; size capped at Pele's 48px icon box (fork `shapes` hook is the fix, PLAN phase 5).
