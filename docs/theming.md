---
title: Theming
description: Colors, dark mode, stroke width and reduced motion.
order: 7
section: Guides
---

# Theming

`watch()` adds the class `pa-scene` to the container. That class gives the diagram its tinted panel and its colors. The
defaults are written with `:where()`, so any rule in your stylesheet wins without a specificity fight.

## Variables

Set these on the container (or any ancestor):

| Variable | What it controls | Default (light) |
|---|---|---|
| `--pa-bg` | Panel background | `#efeafa` |
| `--pa-solid` | Strong color: lines, icon strokes, accents | `#4F378B` |
| `--pa-light` | Light fill: icon fills, group surfaces | `#e4dcf6` |
| `--pa-stroke` | Stroke width of Tabler icons | `1.5` |
| `--pele-*` | Any of Pele's own variables (`--pele-fg`, `--pele-surface`, ...) | Set from the `--pa-*` values |

```css
.pa-scene {
  --pa-bg: #f6f6f0;
  --pa-solid: #0b5fff;
  --pa-light: #dbe7ff;
  --pa-stroke: 1.25;
}
```

For the full list of `--pele-*` variables, see Pele's [theming docs](https://pele.run).

## Dark mode

Dark colors apply when the system prefers dark, unless the page sets `data-theme="light"` on the root element. To force dark,
set `data-theme="dark"` on the root element. Both follow the same variables, so overriding `--pa-solid` and friends works in
either mode.

## Reduced motion

With `prefers-reduced-motion: reduce`, the intro and the tokens do not play: the finished picture shows.

## Scene frame

The panel, its padding and rounded corners come from `.pa-scene`. Override `border-radius`, `padding` or `margin` on it directly.
