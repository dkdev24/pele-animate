# pele-animate

[![npm](https://img.shields.io/npm/v/pele-animate)](https://www.npmjs.com/package/pele-animate)
[![CI](https://github.com/dkdev24/pele-animate/actions/workflows/ci.yml/badge.svg)](https://github.com/dkdev24/pele-animate/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/pele-animate)](LICENSE)

Mermaid diagrams that explain themselves one step at a time, with icons. You choose the order things appear in, readers
step through it, and nodes can carry icons. A small post-processor for [Pele](https://github.com/obsidianmd/pele) (MIT),
which renders the Mermaid; this adds the step order, the playback and the icons. It is not a theme package.
Unofficial add-on; not affiliated with or endorsed by the Pele or Obsidian teams.

**[Website](https://pele-animate.danielkimdev.com/) · [Docs](docs/getting-started.md) · [npm](https://www.npmjs.com/package/pele-animate) · [Changelog](CHANGELOG.md)**

<img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a3.gif" width="560" alt="Animated scene with Tabler icons: a request, a load balancer and a cloud service">

- **You set the order.** Nodes appear in the order of a `%% pa:` comment, or by default along the edges; edges draw in and labels fade in.
- **Readers step through it.** Click (or Enter) starts step mode: previous / play-pause / next buttons, Space, ←/→ and Esc. Hover or focus sends tokens along the edges.
- **Icons.** `@{ icon: "name" }` nodes use any of 4,368 [Tabler](https://github.com/tabler/tabler-icons) icons (loaded per category) or your own. Unknown names get a neutral rounded square.
- Flowcharts, sequence diagrams, architecture diagrams, state diagrams, C4 context, block, class and ER diagrams, timelines, journeys, git graphs and Gantt charts. The finished picture is the resting state; `prefers-reduced-motion` turns the motion off. Light and dark themes.
- The source stays valid Mermaid. One catch: GitHub's own Mermaid renderer does not know the icon names and draws "?" boxes, so the icon examples in this repository are shown as source text.

## Install

```sh
npm i pele-animate pele
# or
pnpm add pele-animate pele
yarn add pele-animate pele
bun add pele-animate pele
```

`pele` is a peer dependency (`^1.7.0`): install it alongside. Both packages run in the browser and need the DOM, so mount them on the client (see [recipes](docs/recipes.md)). ESM only.

## Use

```js
import { mount } from 'pele';
import { watch, prepare } from 'pele-animate';
import { icons } from 'pele-animate/glyphs';
import 'pele-animate/tabler/computers'; // one Tabler icon category; import as many as you need
import 'pele-animate/style.css';

for (const el of document.querySelectorAll('pre.mermaid')) {
  const src = el.textContent;
  mount(el, prepare(src), { icons });
  watch(el, src); // re-applies after Pele re-lays-out on resize
}
```

Mermaid source:

```mermaid-icons
flowchart LR
  %% pa: 1=C 2=L 3=S 4=C>L 5=L>S 6=S>L 7=L>C
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  L@{ icon: "load-balancer", form: "square", h: 88, label: "Load balancer" }
  S@{ icon: "cloud-computing", form: "square", h: 88, label: "Cloud service" }
  C -->|request| L
  L -->|forward| S
  S -->|response| L
  L -->|reply| C
```

`%% pa: 1=C 2=L 3=S 4=C>L 5=L>S 6=S>L 7=L>C` pins the order: the three nodes first, then each leg of the round trip (optional). `form: "square", h: 88` makes a large frameless icon.

## Documentation

Everything is in [`docs/`](docs/getting-started.md), and ships inside the npm package:

| | |
|---|---|
| [Getting started](docs/getting-started.md) · [How it works](docs/how-it-works.md) · [Diagram types](docs/diagram-types.md) | The basics |
| [Icons](docs/icons.md) · [Custom icons](docs/custom-icons.md) · [Step order](docs/step-order.md) · [Theming](docs/theming.md) · [Recipes](docs/recipes.md) | Guides (Vite, Astro, SvelteKit, Nuxt, React) |
| [API](docs/api.md) · [Compatibility](docs/compatibility.md) · [Accessibility](docs/accessibility.md) · [Security](docs/security.md) | Reference |
| [Migrating](docs/migrating.md) · [For coding agents](docs/agents.md) · [FAQ](docs/faq.md) · [Contributing](docs/contributing.md) | Everything else |

**Coding agents:** the package includes a skill, `skills/pele-animate/`, that wires the library into a project and checks the
result in a browser. See [For coding agents](docs/agents.md).

## Compare

The same Mermaid source, three renderers. The pele-animate images loop: the intro draws in, then tokens travel the edges (as on hover).
Regenerate with `examples/capture.sh`.

```mermaid
flowchart LR
  A[Client] -->|request| B[API]
  A -->|sign in| C[Auth server]
  C -->|token| A
```

| Renderer | Result |
|---|---|
| Mermaid | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/m1.png" width="560" alt="Flowchart rendered by Mermaid"> |
| Pele | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/p1.png" width="560" alt="Flowchart rendered by Pele"> |
| pele-animate | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a1.gif" width="560" alt="Animated flowchart: nodes appear, edges draw in, tokens travel"> |

```mermaid
sequenceDiagram
  Client->>API: sign in
  API-->>Client: token
  Client->>Data: query with token
  Data-->>Client: result
```

| Renderer | Result |
|---|---|
| Mermaid | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/m2.png" width="560" alt="Sequence diagram rendered by Mermaid"> |
| Pele | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/p2.png" width="560" alt="Sequence diagram rendered by Pele"> |
| pele-animate | <img src="https://raw.githubusercontent.com/dkdev24/pele-animate/main/examples/a2.gif" width="560" alt="Animated sequence diagram: messages appear in order, tokens travel"> |

## Credits and license

MIT. Built on [Pele](https://github.com/obsidianmd/pele) by kepano (MIT); this is an unofficial add-on, not affiliated with or
endorsed by the Pele or Obsidian teams. The Tabler icon packs come from [Tabler Icons](https://github.com/tabler/tabler-icons)
(MIT, Paweł Kuna); see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). See also [CHANGELOG.md](CHANGELOG.md).
