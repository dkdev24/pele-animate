---
title: Getting started
description: Install pele-animate and render your first step-by-step Mermaid diagram.
order: 1
section: Start
---

# Getting started

pele-animate makes a [Pele](https://pele.run) diagram explain itself one step at a time. You choose the order things appear
in, readers step through it with buttons or the keyboard, and any node can carry an icon from a large set. It is an
unofficial add-on for Pele and does not change how Pele lays out or draws diagrams.

## Install

```sh
npm i pele-animate pele
# or
pnpm add pele-animate pele
yarn add pele-animate pele
bun add pele-animate pele
```

`pele` is a peer dependency (`^1.7.0`): install it alongside. Both run in the browser and need the DOM, so mount them on the client (see
[recipes](./recipes.md) for frameworks). The packages are ESM only.

## First diagram

Put the Mermaid source in an element, then mount it with Pele and hand it to `watch()`:

```js
import { mount } from 'pele';
import { watch, prepare } from 'pele-animate';
import { icons } from 'pele-animate/glyphs';
import 'pele-animate/tabler/computers'; // icons: one Tabler category, import as many as you need
import 'pele-animate/style.css';

const el = document.querySelector('pre.mermaid');
const src = el.textContent;
mount(el, prepare(src), { icons }); // Pele draws the SVG
watch(el, src);            // pele-animate animates it, and re-applies when Pele re-lays-out on resize
```

The Mermaid source:

```mermaid-icons live title="Icons: request, load balancer and cloud service"
flowchart LR
  %% pa: 1=C 2=C>L 3=L>S 4=S>L 5=L>C
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  L@{ icon: "load-balancer", form: "square", h: 88, label: "Load balancer" }
  S@{ icon: "cloud-computing", form: "square", h: 88, label: "Cloud service" }
  C -->|request| L
  L -->|forward| S
  S -->|response| L
  L -->|reply| C
```

What you get:

- The intro plays once when the diagram scrolls into view: nodes appear in order, edges draw in, labels fade in.
- Hover or focus: small tokens travel along the edges.
- Click, or focus and press Enter: **step mode**. Previous, play/pause and next buttons appear, and Space, ←, → and Esc work.
- With `prefers-reduced-motion`, the motion is off and the finished picture shows.

The `%% pa: 1=C 2=C>L 3=L>S 4=S>L 5=L>C` comment pins the order: the request first, then each leg of the round trip. Without it, the order follows the edges. See [step order](./step-order.md).

## Next

- Pick icons: [icons](./icons.md).
- Control the order: [step order](./step-order.md).
- Match your site's colors: [theming](./theming.md).
