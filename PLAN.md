# PLAN.md — pele-animate

Animated, illustrated SVG diagrams generated at runtime from plain Mermaid code in a Markdown SSG page.
Built on [Pele](https://github.com/obsidianmd/pele) (MIT). First consumer: `docs-starlight`; visual reference: the
`doverunner-lab` product card art (`apps/web/components/ProductArt.tsx` + `.module.css`).

## Goal

Mermaid source in, a card-style scene out: illustrated nodes appear in sequence, edges draw in, labels fade in, a
token travels the flow. Idle = finished still frame; hover/focus replays. Source stays valid Mermaid, so GitHub,
Obsidian and Mermaid itself still render a plain diagram.

## Findings (2026-10-21, Pele 1.7.0, source HEAD `1dd58b7`)

- Pele already has a public `icons: (name) => svgInnerMarkup` option and parses `A@{ icon: "x", form: "rounded", label: "…" }`.
  Glyphs are inlined as `<svg class="pele-icon" data-icon="x">` inside the node `<g>`. **A glyph pack needs no fork.**
- Output carries stable hooks: `g.pele-node[data-id]`, `g.pele-edge[data-id="L_A_B_0"]` (id encodes endpoints),
  `.pele-edge-label[data-id]`, `.pele-marker`, colors as CSS variables.
- Limits of stock Pele: glyph is a fixed 24x24 viewBox in a 48px box, stroke-only `currentColor`; node sizes come from
  `shapeSize` in `src/svg/shapes.ts`. Multi-tone, card-sized illustrations (player screen, server rack, phone) need either
  CSS scaling or a `shapes` registry (`SHAPES` is a plain object behind a Map, so a ~30-line patch).
- Lab card style: pure CSS keyframes, still frame at idle, animation on hover/focus, `offset-path` dots, `node-pulse`,
  `prefers-reduced-motion` disables all motion.

## Architecture

1. **Glyph packs.** `core` is generic and extensible (`registerGlyphs(pack)`); `preset-doverunner` ships the DRM/FWM/
   packaging vocabulary. Unknown icon names fall back to a plain Pele box.
2. **Choreography.** Reveal order = BFS from source nodes over edge ids (sequence diagrams: message order).
   Per step: node pop-in, edge draw-in, label fade, token travel. Override via comment: `%% pa: 1=A,B 2=C`.
3. **Scene frame.** Tinted rounded panel, captions under nodes, `--pa-*` CSS variables for theming, light/dark.
4. **Integration.** `animate(svg)` / `watch(container)` after Pele `mount()`; re-applies after Pele's resize re-layout.
   docs-starlight hook: one call in `src/scripts/pele-mount.ts`.

## Phases

| # | Deliverable | Test | Est. |
|---|---|---|---|
| 0 | Prototype: draw-in, stagger, edge dots (**done**, `pele-animate.js/css`, `demo.html`) | demo loads, hooks present | done |
| 1 | Glyph registry + 6 glyphs (player, server, key, document, shield, phone), scaled | Multi-DRM card as pure Mermaid | ~40 min |
| 2 | BFS sequencing + `%% pa:` override; token travel per step | order matches the Lab card's 6 s loop | ~1 h |
| 3 | Scene frame, captions, theming, reduced-motion, hover replay | light/dark + phone width screenshots | ~1 h |
| 4 | docs-starlight integration behind a flag on one page | `/drm-concepts/` | ~30 min |
| 5 | Fork spike (**done 2026-10-22**): stock Pele sizes icon nodes via `A@{ icon, form: "square", h: 88 }` (box = `h`, layout accounts for it); `fitGlyphs()` stretches the glyph over the frame and hides it. Verdict: **no fork needed for size/frameless art.** Fork only for wide non-square nodes (Pele icon box is square) or edge routing to illustration outlines | done |
| 6 | Packaging (**done 2026-10-22**, not published): `package.json` exports, README, LICENSE, `npm pack` tarball installed in a clean Vite app (built and verified in a browser). Publish step waits on Daniel | tarball in clean app | done |

## Phase 5 spike notes

- Works: `h: 88` icons render as large frameless glyphs; sequencing and tokens unaffected.
- Glyph stroke width is fixed at 2 in a 24 viewBox, so it scales thick at 88px; set `stroke-width` per glyph (~1.2) when redrawing.
- Not solved by sizing: three edges between the same pair still pile up and labels overlap lines (Pele layered layout); wide panels (the 80x32 OTT card) need a non-square box.

## Non-goals (for now)

- Bespoke per-concept pictures from generic Mermaid (e.g. the watermark binary chips): handled by custom glyphs, not inference.
- Chart-type diagrams (pie, gantt, xychart); start with flowchart + sequence.
- Maintaining a Pele fork unless phase 5 triggers.

## Risks

- Re-layout on resize wipes animation state (mitigated by `watch()`).
- Glyph scaling looks off at small widths; check phone width in phase 3.
- Pele internals (`pele-shape-*`, class names) can change between minor versions; pin `pele` and add a smoke test.

## Open questions

- Sequence diagram edges: do they use `.pele-edge`? Verify in phase 2.
- Hover-only replay vs. scroll-in play-once on touch devices.
- Name: `pele-animate` (post-processor) vs. `pele-motion` (fork); keep `pele-animate` until phase 5.
