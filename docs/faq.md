---
title: FAQ
description: Common questions about pele-animate, Pele, and licenses.
order: 16
section: Reference
---

# FAQ

**Is this part of Pele?** No. It is an unofficial add-on, not affiliated with or endorsed by the Pele or Obsidian teams. Pele does the
layout and drawing; pele-animate adds step order, step-by-step playback and icons on top.

**Why not just use Pele?** Pele alone draws a static diagram. Use it directly if that is enough. pele-animate is for diagrams
you want to explain in order.

**Is it a theme?** No. It does not offer visual styles beyond a simple scene frame and light/dark colors you can override.

**Why not Mermaid.js?** Pele is much smaller and renders synchronously. pele-animate is built on Pele, so it follows that choice.

**Does it work with server rendering?** Mount it on the client ([recipes](./recipes.md)). Static site generators are fine.

**How big is it?** The core (`pele-animate.js` plus CSS) is about 20 KB unminified. Icon packs are separate modules, so you only
ship the categories you import (the largest, `system`, is about 199 KB unminified).

**Which diagrams does it support?** Flowcharts, sequence diagrams, architecture diagrams and state diagrams ([diagram types](./diagram-types.md)).

**Can I use my own icons?** Yes ([custom icons](./custom-icons.md)).

**Licenses.** pele-animate is MIT. Pele is MIT. The Tabler icon packs are from Tabler Icons (MIT, Paweł Kuna); see
`THIRD-PARTY-NOTICES.md`.
