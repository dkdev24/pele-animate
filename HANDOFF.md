# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.12.0** (published to npm 2026-10-24)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-24 (later): edge pins `%% pa: 3=A>B` added to `animate()`/`parseOrder()` and the `diagram-step-order` skill (`.claude/skills/`, with `steps.js` probe) released as 0.12.0, plus SVG step-control icons/alignment fix. Used on docs-starlight: 13 of 55 diagrams re-pinned by 3 agents + me, rest reviewed (see docs plan section 6). docs bumped to `^0.12.0` and docs 4.16.0 shipped (2026-10-24) with the reviewed step orders and layouts.
2026-10-24: 0.11.0 released (npm, tag, GitHub release): step-by-step playback (click → prev/play/next bar, Space/←/→/Esc/✕; `{ controls: false }` = old replay) and README Compare section with animated GIFs (`examples/capture.sh` regenerates). Step mode only browser-checked on flowchart demo.

---

## Next Actions

1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Check step mode on a sequence diagram + phone width; check the live docs step mode.
3. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
4. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
5. docs-starlight is on `^0.12.0`. Next release 0.13.0.

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md` | Dev plan, phases, risks |
| `CHANGELOG.md` | Public changelog (add an entry per release; not yet in npm `files`) |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry + 6 generic glyphs |
| `preset-doverunner.js` | DRM/FWM/packaging glyph pack |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
