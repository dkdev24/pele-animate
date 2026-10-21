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

---

## v0.3.0 — Sequenced choreography

**Date:** 2026-10-21

### Changes

- BFS timeline for flowcharts, message-order timeline for sequence diagrams, `%% pa:` pinning, WAAPI token loop on hover/focus, `pa-done` skips the intro after resize re-render.
- Fixed dashed edges turning solid after draw-in (dash now lives in the keyframes).

### Status

Timeline and tokens verified numerically; visual polish (phase 3) pending.

---

## v0.4.0 — Scene frame

**Date:** 2026-10-22

### Changes

- `.pa-scene` panel + theming vars, dark mode, `replay()` on click/Enter, focusable container.

### Status

Ready to integrate into docs-starlight (phase 4).

---

## v0.5.0 — docs-starlight trial

**Date:** 2026-10-22

### Changes

- Scene theme vars wrapped in `:where()` so a host stylesheet can override them.
- Trial integration in docs-starlight (branch, not merged); opt-in via `mermaid animate` fence.

### Status

Works in a built preview, light and dark. Not yet reviewed by Daniel; plain diagrams without icons.

---

## v0.6.0 — Fork spike

**Date:** 2026-10-22

### Changes

- `fitGlyphs()` + `.pa-art`: large frameless glyphs from stock Pele `h:` sizing. Fork judged unnecessary for size.

### Status

Big glyph look achieved; stroke weight and routing polish pending.

---

## v0.7.0 — Glyph redraw

**Date:** 2026-10-22

### Changes

- Thin-stroke glyph group, richer player/phone, panel-colored edge-label backgrounds, Multi-DRM demo with bidirectional edges.

### Status

Big-glyph scenes look close to the Lab cards; wide nodes and more glyphs pending.

---

## v0.8.0 — DoveRunner preset pack

**Date:** 2026-10-22

### Changes

- `preset-doverunner.js`: package, token, lock, database, bits-a, bits-b glyphs; FWM and packaging demo scenes.

### Status

Generic core plus preset split in place; packaging (phase 6) pending.
