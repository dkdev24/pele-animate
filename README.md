# pele-animate

Mermaid diagrams that explain themselves one step at a time, with icons. You choose the order things appear in, readers
step through it, and nodes can carry icons. A small post-processor for [Pele](https://github.com/obsidianmd/pele) (MIT),
which renders the Mermaid; this adds the step order, the playback and the icons. It is not a theme package.
Unofficial add-on; not affiliated with or endorsed by the Pele or Obsidian teams.
The source stays valid Mermaid, so GitHub or Obsidian still show a normal diagram.

- Nodes appear in order (BFS from the sources, or pinned with a `%% pa:` comment), edges draw in, labels fade in.
- Hover or focus: tokens travel the edges in sequence. The intro plays once on scroll-in. Click (or Enter) enters step mode: previous / play-pause / next buttons, with Space (play/pause), ←/→ (step) and Esc (leave).
- `@{ icon: "name" }` nodes become illustrations from a glyph pack. Unknown names get a neutral rounded-square glyph.
- Sequence diagrams: participant boxes in a row get the tallest height (Pele sizes each to its own text). Group and box titles are bold.
- Idle state is the finished picture; `prefers-reduced-motion` turns the motion off. Light and dark themes.

## Compare

The same Mermaid source, three renderers. The pele-animate images loop: the intro draws in, then tokens travel the edges (as on hover).
Regenerate with `examples/capture.sh`.

```mermaid
flowchart LR
  A[Player] -->|auth token| B[OTT service]
  A -->|license request| C[DRM server]
  C -->|license| A
```

| Renderer | Result |
|---|---|
| Mermaid | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/m1.png" width="560" alt="Flowchart rendered by Mermaid"> |
| Pele | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/p1.png" width="560" alt="Flowchart rendered by Pele"> |
| pele-animate | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a1.gif" width="560" alt="Animated flowchart: nodes appear, edges draw in, tokens travel"> |

```mermaid
sequenceDiagram
  Player->>OTT: sign in
  OTT-->>Player: token
  Player->>DRM: token
  DRM-->>Player: license
```

| Renderer | Result |
|---|---|
| Mermaid | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/m2.png" width="560" alt="Sequence diagram rendered by Mermaid"> |
| Pele | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/p2.png" width="560" alt="Sequence diagram rendered by Pele"> |
| pele-animate | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a2.gif" width="560" alt="Animated sequence diagram: messages appear in order, tokens travel"> |

With icons (`@{ icon }` nodes from the Tabler `computers` pack, `%% pa: 1=C 2=L 3=S` pins the order):

<img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a3.gif" width="560" alt="Animated scene with Tabler icons: a request, a load balancer and a cloud service">

## Install

```sh
npm i pele-animate pele
```

## Use

```js
import { mount } from 'pele';
import { watch } from 'pele-animate';
import { icons } from 'pele-animate/glyphs';
import 'pele-animate/tabler/computers'; // one Tabler category; import as many as you need
import 'pele-animate/style.css';

for (const el of document.querySelectorAll('pre.mermaid')) {
  const src = el.textContent;
  mount(el, src, { icons });
  watch(el, src); // re-applies after Pele re-lays-out on resize
}
```

Mermaid source:

```mermaid
flowchart LR
  %% pa: 1=C 2=L 3=S
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  L@{ icon: "load-balancer", form: "square", h: 88, label: "Load balancer" }
  S@{ icon: "cloud-computing", form: "square", h: 88, label: "Cloud service" }
  C <-->|route| L
  L <-->|forward| S
```

`form: "square", h: 88` makes a large frameless glyph; leave both out for a small icon in a frame.
`%% pa: 1=C 2=L 3=S` pins nodes to steps (optional). `X>Y` pins the edge from X to Y, so an edge between nodes that are
already visible can have its own step: `%% pa: 1=A,B 2=C,B>C 3=C>B`. Pin the nodes first; an edge pinned before its target appears lands early.
Sequence diagrams animate actors, then messages in order.

## API

| Export | |
|---|---|
| `watch(container, source?)` | Animate the SVG inside `container` (and every re-render of it); adds the scene panel and step mode (click / Enter); pass `{ controls: false }` as a third argument for click-to-replay instead |
| `animate(svg, { hover, source })` | Animate one SVG; you handle re-renders |
| `replay(svg)` | Play the intro again |
| `parseOrder(source)` | Read the `%% pa:` pins: `Map(nodeId or 'X>Y' -> level)` |
| `svg.paSteps` | Set by `animate()`: one array per step, each item `[element, parts that animate in]`. Step mode uses it; read it to check the order |
| `registerGlyphs(pack, strokeWidth = 1.1)` (`/glyphs`) | Add glyphs: `{ name: '<inner markup of a 24x24 svg>' }`; colors via `--pa-solid` / `--pa-light` |
| `icons` (`/glyphs`) | Pele `icons` resolver; unknown names get a neutral rounded square, since Pele ships no icons of its own |

Icons come from the packs you import: Tabler categories (below) or your own via `registerGlyphs`. `pele-animate/preset-doverunner` is an optional extra set of filled, two-tone glyphs (all named `doverunner-<name>`).

### Tabler icon packs

About 4,300 line icons from [Tabler Icons](https://github.com/tabler/tabler-icons) (MIT), split by Tabler's own categories. Import only what you need:

```js
import 'pele-animate/tabler/devices';   // also: system, database, development, communication, charts, ...
```

Then use any name from that category: `A@{ icon: "device-tv", form: "square", h: 88 }`. The `computers` pack (44 icons: `network`, `load-balancer`, `cloud-computing`, `http-get`, `topology-star`, ...) suits infrastructure diagrams.
Tabler icons are stroke-only, so the stroke width is adjustable: set `--pa-stroke` on the container (default `1.5`; Tabler draws at 2 and
designs every icon to work at other widths). Categories: see `tabler/` (Brand, Letters, Numbers, Zodiac and Gender are left out).
Regenerate with `node scripts/build-tabler.mjs <tabler-icons checkout>`. License notice: `THIRD-PARTY-NOTICES.md`.

```css
.pa-scene { --pa-stroke: 1; }
```

## Theme

`watch()` adds class `pa-scene` to the container. Override `--pa-bg`, `--pa-solid`, `--pa-light` or any `--pele-*`
variable on it; defaults are `:where()` rules, so your stylesheet wins.

## Limits

- Relies on Pele's SVG structure (`.pele-node`, `.pele-edge`, `data-id`); `pele` is a peer dependency pinned to `^1.7.0`.
- Flowcharts and sequence diagrams only. No types yet.
- Glyph art is square-boxed; wide art is drawn as a wide glyph inside the square.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
