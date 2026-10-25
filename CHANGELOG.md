# Changelog

All notable changes to `pele-animate` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project stays on `0.x`: minor versions
may change behavior, so pin a range such as `^0.17.0` and bump it deliberately.

## [Unreleased]

### Changed
- Website: code blocks have a copy button, and install commands show npm, pnpm, yarn and bun as tabs. The 404 page is designed, the homepage diagram fits narrow screens, and "View as Markdown" links work.

## [0.17.1] - 2026-10-25

### Fixed
- Clicking one of Pele's zoom buttons no longer enters step mode.
- Step mode and Pele's zoom now coexist: the zoom controls are hidden while stepping (both claim the arrow keys and Esc), any zoom is reset on entering, and the controls return on exit.

## [0.17.0] - 2026-10-25

### Removed
- **Breaking:** `replay()` and the `{ controls: false }` option of `watch()` are gone; a click always enters step mode. See the Migrating page.
- Website: playground share links now use a plain URL-encoded source, so links made before this change no longer open.

### Changed
- Docs: the architecture, state, class and C4 examples now use edge pins, so relationships appear as their own steps.
- Website: redesigned with a warm paper theme (terracotta accent, Ranade and Geist Mono), light and dark; the live diagram sits on a generated grid on the home page, next to its Mermaid source in an editor panel. The site is now at https://pele-animate.danielkimdev.com/.
- Website: diagrams on the docs pages take one of five warm tones in turn, and timeline, journey, git graph and Gantt use a warm eight-colour series set.
- Website playground: the colour controls are collapsed until opened, the diagram starts in the site colours, and the examples menu is styled.
- Docs and README: the getting-started example is now a five-step round trip (request, load balancer, cloud service, response, reply): `%% pa: 1=C 2=C>L 3=L>S 4=S>L 5=L>C`.

## [0.16.2] - 2026-10-24

### Fixed
- Edge pins (`X>Y`) are matched in either order when the diagram has no opposite edge. Before, a pin written against the arrow (class and ER relationships, undirected architecture edges, `A <--> B` read as `B>A`) was ignored and the edge appeared with the first step.

### Changed
- Website playground: the colour controls are five pickers (lines and icons, group fill, node fill, background, text) that start from the theme's values, plus Reset; the examples menu is grouped by page with descriptive titles taken from each docs fence's `title="..."`.

## [0.16.1] - 2026-10-24

### Fixed
- User journeys now step at narrow widths: Pele lays a journey out as a vertical list there, which pele-animate did not recognise (0 steps).

## [0.16.0] - 2026-10-24

### Added
- Timelines, user journeys, git graphs and Gantt charts: one step per item in reading order, with the intro animation and step controls. Pins do not apply.
- Class diagrams (`classDiagram`) and ER diagrams (`erDiagram`): step order, pins and step controls. A relationship runs from the class or entity written first.
- Block diagrams (`block-beta`): step order, pins and step controls work as for flowcharts.
- C4 context diagrams (`C4Context`): step order, pins and step controls work as for flowcharts.
- State diagrams (`stateDiagram-v2`): step order, pins (`root_start` and `root_end` name the markers) and step controls. Edge ends are now also read from the path geometry when Pele gives an edge no readable id.
- Architecture diagrams (`architecture-beta`): step order, pins, step controls and icon packs (the icon in parentheses) work as for flowcharts.

### Added
- Website: a playground at `/playground/` (edit Mermaid, live preview with the real step controls, stroke and color controls, preview width, examples from the docs, share link, copy Mermaid and code snippet) and an "Open in playground" link under every live example in the docs.

## [0.15.0] - 2026-10-24

### Added
- `prepare(source)`: pads icon-node labels narrower than `h` so Pele's layout box is as wide as the drawn icon. Without it, edge ends and arrowheads land under the icon. Use `mount(el, prepare(src), { icons })`.
- Website: an icon browser at `/icons/` (search by name and tag, category chips, stroke-width slider, click to copy an `@{ icon }` snippet and the import line) and `/icons.json` (`{ version, icons: [{ name, category, tags }] }`) for agents.

### Changed
- Docs: the diagram-type examples are longer (five to seven steps) with pins that follow a story, so step mode shows what pins and step order are for.
- Text on solid fills (timeline periods, Gantt bars, git branch tags) was invisible because the scene made Pele's contrast colour transparent; it now uses the panel surface colour.
- README: badges, links to the website and docs, a hero animation, generic comparison examples (client, API, auth server), and icon examples shown as source text because GitHub's Mermaid renderer cannot draw them.

## [0.14.0] - 2026-10-24

Types, documentation and agent skills. No breaking changes.

### Added
- TypeScript types (`types/`), wired through `exports`.
- Documentation in `docs/` (16 pages), shipped in the npm package; the README is now a short quickstart that links to it.
- Agent skills in `skills/`, shipped in the npm package: `pele-animate` (install, mount, icons, step order, theme, verify in a browser, with a `verify.js` probe) and `diagram-step-order`.
- `pnpm test` renders every Mermaid example in the docs, skills and README with Pele and checks icon names.

### Changed
- README is a short quickstart that describes the package as step order, step-by-step playback and icons (not a theme package).
- The package description on npm says the same.

## [0.13.0] - 2026-10-24

Tabler icon packs, and the illustrated glyphs move to a `doverunner-` namespace. Two breaking renames: see Changed.
### Changed
- **Breaking:** every illustrated glyph is renamed `doverunner-<name>` (`player` → `doverunner-player`, `lock` → `doverunner-lock`, `bits-a` → `doverunner-bits-a`, and so on, 20 in all) so the plain names belong to the Tabler packs. Update `@{ icon: "..." }` in your sources.
- **Breaking:** the seven glyphs that lived in `pele-animate/glyphs` moved into `pele-animate/preset-doverunner`; `/glyphs` is now only the registry (`icons`, `registerGlyphs`, `registerTabler`). Import the preset to get any `doverunner-*` glyph.

### Added
- `icons()` returns a neutral rounded square for unregistered names, instead of Pele's blank icon slot.
- Tabler Icons packs: `pele-animate/tabler/<category>` (4,368 outline icons in 36 categories, from Tabler Icons 3.49.0, MIT). Stroke width follows the `--pa-stroke` CSS variable. `registerTabler(pack, strokeWidth)` in `/glyphs`; `scripts/build-tabler.mjs` regenerates the packs; license in `THIRD-PARTY-NOTICES.md`.

## [0.12.0] - 2026-10-24

Edge pins for step order, a step-order review skill, and tidier step controls.
### Added

- Edge pins: `%% pa: 3=A>B` pins the edge from A to B to step 3, so a reply between two visible nodes can play on its own step
  (the intro timing and step mode both follow it).
- `svg.paSteps` is documented: the steps `animate()` builds, one array per step.
- A `diagram-step-order` agent skill (`.claude/skills/`, with a `steps.js` probe) for reviewing and fixing step order against the page text. It is in the repo, not in the npm package.

### Fixed

- Step controls: the icons are SVG, so previous, play/pause, next and close line up vertically (text glyphs sat at different heights), and
  host-page sibling margins no longer push buttons down. Previous/next use `aria-disabled` instead of `disabled`, so hovering them at
  the first or last step shows their own tooltip rather than the container's.

## [0.11.0] - 2026-10-24

Step-by-step playback.
### Added

- Step-by-step playback: clicking a diagram (or pressing Enter) enters step mode with previous / play-pause / next controls.
  Each BFS level (flowcharts) or message (sequence diagrams) is one step. Keys: Space play/pause, ←/→ step, Esc leave.

### Changed

- README: Mermaid vs Pele vs pele-animate comparison with animated GIFs (`examples/`, regenerate with `examples/capture.sh`).
- Step controls have their own tooltips; the ✕ button exits step mode instead of restarting it.
- `watch()` click now enters step mode instead of replaying the intro. Pass `{ controls: false }` as the third argument for the old click-to-replay.

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

[Unreleased]: https://github.com/dkdev24/pele-animate/compare/0.16.2...HEAD
[0.16.2]: https://github.com/dkdev24/pele-animate/compare/0.16.1...0.16.2
[0.16.1]: https://github.com/dkdev24/pele-animate/compare/0.16.0...0.16.1
[0.16.0]: https://github.com/dkdev24/pele-animate/compare/0.15.0...0.16.0
[0.15.0]: https://github.com/dkdev24/pele-animate/compare/0.14.0...0.15.0
[0.14.0]: https://github.com/dkdev24/pele-animate/compare/0.13.0...0.14.0
[0.13.0]: https://github.com/dkdev24/pele-animate/compare/0.12.0...0.13.0
[0.12.0]: https://github.com/dkdev24/pele-animate/compare/0.11.0...0.12.0
[0.11.0]: https://github.com/dkdev24/pele-animate/compare/0.10.0...0.11.0
[0.10.0]: https://github.com/dkdev24/pele-animate/compare/0.9.0...0.10.0
[0.9.0]: https://github.com/dkdev24/pele-animate/releases/tag/0.9.0
