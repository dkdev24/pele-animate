---
title: Compatibility
description: Versions of Pele, browsers, and the parts of Pele's markup pele-animate depends on.
order: 10
section: Reference
---

# Compatibility

| | Supported |
|---|---|
| Pele | `^1.7.0` (peer dependency). Tested with 1.7 (the docs site), 1.8 and 1.9. |
| Diagram types | Flowcharts, sequence diagrams, architecture diagrams, state diagrams, C4 context, block, class and ER diagrams, timelines, journeys, git graphs and Gantt charts ([diagram types](./diagram-types.md)) |
| Browsers | Current browsers with the Web Animations API, `IntersectionObserver` and `matchMedia` (Chrome, Edge, Firefox, Safari). Without `IntersectionObserver` the intro plays at once. |
| Module format | ESM only |
| Server rendering | Not applicable: mount on the client ([recipes](./recipes.md)) |

## What pele-animate depends on in Pele

pele-animate reads the SVG Pele produces. It selects on these class names and attributes:

- Flowchart: `.pele-node`, `.pele-edge`, `.pele-edge-label`, `.pele-marker`, `.pele-cluster-label`, `.pele-icon`, and the `data-id` attribute.
- Sequence: `.pele-sequence`, `.pele-lifeline`, `.pele-actor-participant`, `.pele-actor-footer`.
- Timeline: `.pele-timeline`, `.pele-period`.
- Gantt: `.pele-gantt`, `.pele-task`.
- Journey: `.pele-journey`, `.pele-task`, `.pele-journey-step`, `.pele-face`.
- Git graph: `.pele-gitGraph`, `.pele-commit`, `.pele-branch`, `.pele-lane`.
- Zoom controls (added by `mount()` in the browser, not part of the SVG): `.pele-zoom`.

Pele's maintainer has said there are no plans to change them, but there is no formal promise that they stay stable across releases. That is why Pele is a peer dependency:
upgrade it deliberately, and re-check your diagrams afterwards. The repository's tests render every documentation example,
which catches parse errors but not visual changes. The Pele canary (`scripts/smoke-pele.mjs`, run by `pnpm test`) renders one fixture
per diagram type above and fails if any of these hooks disappear from the installed Pele — except `.pele-zoom`, which render() never produces.

## Known limits

- Sequence-diagram participants ignore `@{ icon }`.
- Step mode is browser-tested on flowcharts only.
- Glyph art is square-boxed; wide art is drawn as a wide shape inside the square.
