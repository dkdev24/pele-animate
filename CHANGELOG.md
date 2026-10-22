# Changelog

All notable changes to `pele-animate` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project stays on `0.x`: minor versions
may change behavior, so pin a range such as `^0.10.0` and bump it deliberately.

## [Unreleased]

## [0.10.0] - 2026-10-22

More glyphs for media and watermarking diagrams, and tidier sequence diagrams.

### Added

- Glyphs: `cloud` (generic pack); `video`, `media`, `encoder`, `storage`, `plugin`, `variants` (stacked A/B tiles) and
  `watermark` (`pele-animate/preset-doverunner`).
- Sequence diagrams: participant boxes in a row share the height of the tallest one. Pele sizes each box to its own text,
  which left the rows ragged.

### Changed

- Group and box titles (`.pele-cluster-label`) are bold inside `.pa-scene`.

### Notes

- Sequence-diagram participants ignore `@{ icon }` in Pele (the box shows its id), so glyphs apply to flowcharts only.
  Participant boxes can still be grouped with Mermaid's `box ... end`.

## [0.9.0] - 2026-10-22

First public release. Animated, illustrated SVG scenes from plain Mermaid code, as a post-processor for
[Pele](https://github.com/obsidianmd/pele).

### Added

- `watch(container, source?)` and `animate(svg, options)`: nodes appear in order (breadth-first from the sources), edges
  draw in, labels fade in. Sequence diagrams animate participants, lifelines, then messages in order.
- Hover or keyboard focus sends a token along each edge in sequence; click or Enter replays the intro (`replay(svg)`).
  The idle state is the finished picture, and `prefers-reduced-motion` turns the motion off.
- `%% pa: 1=A 2=B` comments pin nodes to animation steps (`parseOrder(source)` reads them).
- `@{ icon: "name" }` nodes become illustrations from a glyph pack; `form: "square", h: 88` gives a large frameless glyph.
  Unknown names fall back to Pele's plain node.
- `pele-animate/glyphs`: `icons` resolver, `registerGlyphs(pack, strokeWidth)` and six generic glyphs (`player`, `server`,
  `key`, `document`, `shield`, `phone`).
- `pele-animate/preset-doverunner`: `package`, `token`, `lock`, `database`, `bits-a`, `bits-b`.
- `pele-animate/style.css`: tinted scene panel with light and dark themes. Override `--pa-bg`, `--pa-solid`, `--pa-light`
  or any `--pele-*` variable on the container; theme variables use `:where()` so host styles win.
- Long diagrams cap the intro at about three seconds; smaller scene padding on phones.

### Notes

- Versions 0.1.0 to 0.8.2 were internal development milestones and were never published to npm; their work is part of 0.9.0.
- Requires `pele` `^1.7.0` as a peer dependency.
