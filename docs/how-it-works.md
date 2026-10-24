---
title: How it works
description: What Pele does, what pele-animate adds, and the three kinds of motion.
order: 2
section: Start
---

# How it works

Two layers, one diagram:

1. **Pele** parses the Mermaid, lays the diagram out and returns an SVG. That is all Pele's job; pele-animate does not
   touch layout, sizing or syntax.
2. **pele-animate** reads that SVG after Pele draws it, works out the order things should appear in, and adds the motion,
   the step playback and the icons. The Mermaid source stays valid Mermaid, so GitHub or Obsidian still show a normal diagram.

## The calls

- `mount(el, prepare(src), { icons })` is Pele's. The `icons` option is how glyphs get in (see [icons](./icons.md)).
- `watch(el, src)` is pele-animate's. It marks the container as a scene (class `pa-scene`), animates each SVG Pele renders into
  it, and re-applies after Pele re-draws on resize. The intro is skipped on those re-draws once it has played.
- `animate(svg, { source })` does one SVG. Use it if you render with Pele yourself and do not want `watch()`.
- `replay(svg)` plays the intro again.

## The three kinds of motion

| Motion | When | Notes |
|---|---|---|
| **Intro** | Once, when the diagram is 30% in view | Nodes appear by step, each edge draws from its source, labels fade in. A long diagram squeezes its steps so the intro stays near 3 seconds. |
| **Tokens** | While hovering or focusing the diagram | Small dots travel along the edges in sequence. |
| **Step mode** | Click, or Enter | You move through the same steps one at a time. See [step order](./step-order.md). |

The resting state is always the finished picture. Everything honors `prefers-reduced-motion`.

## Where the order comes from

Order is a list of **steps**. By default, a flowchart's steps are the breadth-first levels from the nodes that nothing points to;
a sequence diagram's steps are its actors, then its messages in order. A `%% pa:` comment overrides that. After
`animate()` runs, `svg.paSteps` holds one array per step, which is also what step mode uses.

## What it depends on in Pele

pele-animate selects on class names in Pele's SVG (`.pele-node`, `.pele-edge`, and a few others) and on the `data-id` attribute.
Pele is a peer dependency so you control its version. See [compatibility](./compatibility.md).
