---
title: FAQ
description: Common questions about pele-animate, Pele, and licenses.
order: 16
section: Reference
---

# FAQ

**What is pele-animate?** A small JavaScript post-processor that turns Mermaid diagrams into step-by-step animated scenes
with icons. You write plain Mermaid; it adds step order, playback controls, and icons on top of Pele's rendering. It is
not a theme package.

**How do I animate a diagram step by step?** Pin the reveal order with a `%% pa:` comment (e.g. `%% pa: 1=A 2=A>B`),
or leave it out and it follows the edges. Readers click through the steps, or watch them autoplay ([step order](./step-order.md)).

**How do I make a diagram play automatically?** Add `autoplay` to the `%% pa:` comment. The intro draws in once the
diagram is on screen, then step mode loops.

**Does it work with my framework?** Yes. It runs in the browser and mounts on the client. There are recipes for Vite,
Astro, SvelteKit, Nuxt, and React ([recipes](./recipes.md)).

**Is it free for commercial use?** Yes. pele-animate is MIT, Pele is MIT, and the Tabler icon packs are MIT
(see `THIRD-PARTY-NOTICES.md`).

**Can I try it in the browser?** Yes, in the [playground](https://pele-animate.danielkimdev.com/playground/): paste
Mermaid source and step through the result live.

**Is this part of Pele?** No. It is an unofficial add-on, not affiliated with or endorsed by the Pele or Obsidian teams. Pele does the
layout and drawing; pele-animate adds step order, step-by-step playback and icons on top.

**Why not just use Pele?** Pele alone draws a static diagram. Use it directly if that is enough. pele-animate is for diagrams
you want to explain in order.

**Is it a theme?** No. It does not offer visual styles beyond a simple scene frame and light/dark colors you can override.

**Why not Mermaid.js?** Pele is much smaller and renders synchronously. pele-animate is built on Pele, so it follows that choice.

**Does it work with server rendering?** Mount it on the client ([recipes](./recipes.md)). Static site generators are fine.

**How big is it?** The core (`pele-animate.js` plus CSS) is about 20 KB unminified. Icon packs are separate modules, so you only
ship the categories you import (the largest, `system`, is about 199 KB unminified).

**Which diagrams does it support?** Flowcharts, sequence diagrams, architecture diagrams, state diagrams, C4 context, block, class and ER diagrams, timelines, journeys, git graphs and Gantt charts ([diagram types](./diagram-types.md)).

**Can I use my own icons?** Yes ([custom icons](./custom-icons.md)).

**Licenses.** pele-animate is MIT. Pele is MIT. The Tabler icon packs are from Tabler Icons (MIT, Paweł Kuna); see
`THIRD-PARTY-NOTICES.md`.
