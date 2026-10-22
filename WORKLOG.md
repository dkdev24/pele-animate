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

---

## v0.8.1 — Packaging

**Date:** 2026-10-22

### Changes

- Package exports, README, LICENSE; tarball verified in a clean Vite app. Version in package.json is 0.8.0; not published.

### Status

Publishable; waiting on the publish decision.

---

## v0.8.2 — Long-diagram pacing

**Date:** 2026-10-22

### Changes

- `MAX_INTRO` caps the intro for long diagrams; smaller scene padding on phones; README disclaimer.

### Status

All 52 docs-starlight diagram pages mount in the trial branch.

---

## v0.9.0 — Public release

**Date:** 2026-10-22

### Changes

- Repo made public, first npm publish (`pele-animate`). Internal repo paths removed from docs.

### Status

Public; docs-starlight switches from the vendored copy to the package.

---

## v0.10.0 — Docs diagram glyphs

**Date:** 2026-10-22

### Changes

- New glyphs: `cloud` (`glyphs.js`); `video`, `media`, `encoder`, `storage`, `plugin`, `variants`, `watermark` (`preset-doverunner.js`). README glyph list updated.
- `animate()` equalizes sequence participant box heights per row (`equalizeActors`); scene CSS bolds group/box titles.
- Checked: sequence-diagram participants ignore `@{ icon }` (Pele renders the id letters), so glyphs apply to flowcharts only.

### Status

Published to npm; docs-starlight installed it (`^0.10.0`).
