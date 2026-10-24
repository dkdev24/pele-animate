---
title: API reference
description: Every export of pele-animate, with types.
order: 9
section: Reference
---

# API reference

TypeScript types ship with the package (`types/`).

## `pele-animate`

| Export | Signature | Description |
|---|---|---|
| `watch` | `watch(container: HTMLElement, source?: string, options?: { controls?: boolean }): void` | Marks the container as a scene (`pa-scene`), animates each SVG Pele renders into it and re-applies after Pele re-lays-out on resize. `controls: false` keeps click-to-replay instead of step mode. |
| `prepare` | `prepare(source?: string): string` | Returns the Mermaid source with icon-node labels padded so Pele lays out a box at least as wide as the icon (`h`). Pass its result to `mount()` and the original source to `watch()`. Without it, a label shorter than the icon puts edge ends and arrowheads under the icon. |
| `animate` | `animate(svg: SVGSVGElement, options?: { hover?: Element; source?: string }): void` | Animates one rendered svg. `source` is read for `%% pa:` pins. Sets `svg.paSteps`. |
| `replay` | `replay(svg: SVGSVGElement \| null \| undefined): void` | Plays the intro again. |
| `parseOrder` | `parseOrder(source?: string): Map<string, number>` | Parses the `%% pa:` comment: node id, or `'X>Y'` for an edge, to a 0-based step. |

`svg.paSteps` (type `PaStep[]`, where `PaStep = Array<[element: Element, parts: Element[]]>`) is set by `animate()`: one array per
step.

## `pele-animate/glyphs`

| Export | Signature | Description |
|---|---|---|
| `icons` | `icons(name: string): string` | Pele's `icons` resolver. Unknown names return a neutral rounded square. |
| `registerGlyphs` | `registerGlyphs(pack: Record<string, string>, strokeWidth?: number): void` | Adds glyphs: `{ name: '<inner markup of a 24x24 svg>' }`. Default stroke width 1.1. |
| `registerTabler` | `registerTabler(pack: Record<string, string>, strokeWidth?: number): void` | Adds outline icons whose stroke width follows `--pa-stroke` (fallback `strokeWidth`, default 1.5). |
| `S`, `L`, `W` | `string` | Theme color expressions for glyph markup: solid, light, white. |

## `pele-animate/tabler/<category>`

Importing a module registers that category's icons. It also exports `pack: Record<string, string>` (name to inner markup).
Categories are listed in [icons](./icons.md).

## `pele-animate/preset-doverunner`

Importing it registers the 20 `doverunner-*` glyphs. No exports.

## `pele-animate/style.css`

The scene frame, motion and step controls. Import it once.

## Classes you may see

`pa-scene` (container), `pa-ready` (an animated svg), `pa-in` and `pa-done` (intro states), `pa-stepping` (step mode), `pa-controls`
(the button bar). These are internal and may change; prefer the CSS variables in [theming](./theming.md) over targeting them.
