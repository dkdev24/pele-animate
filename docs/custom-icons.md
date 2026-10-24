---
title: Custom icons
description: Register your own glyphs with registerGlyphs.
order: 5
section: Guides
---

# Custom icons

Register your own icons with `registerGlyphs`:

```js
import { registerGlyphs, S, L } from 'pele-animate/glyphs';

registerGlyphs({
  'my-box': `<rect x="4" y="6" width="16" height="12" rx="2" fill="${L}" stroke="${S}"/>`,
});
```

Then use `icon: "my-box"` in your Mermaid.

## The contract

- A glyph is the **inner markup** of a 24 by 24 SVG: shapes only, no `<svg>` wrapper. Draw inside the 24 by 24 box.
- Colors: use `S` (solid) and `L` (light), which are the CSS variables `--pa-solid` and `--pa-light` with fallbacks, plus
  `W` for white. Then the glyph follows light and dark themes (see [theming](./theming.md)).
- `registerGlyphs(pack, strokeWidth = 1.1)` wraps each glyph in a group with that stroke width. Pele draws icons at stroke
  width 2, which looks heavy on a large icon, so glyphs get a thinner one.
- Line icons that should respond to `--pa-stroke` (as the Tabler packs do) can use `registerTabler(pack, strokeWidth = 1.5)`
  instead. It sets fill none, round caps and joins, and the stroke color for you.

## Names

Registering a name that already exists replaces it. Choose a prefix for your own pack (`acme-box`) so your names never clash
with Tabler's plain names.

## Safety

Glyph markup is inserted into the page as SVG. Only register markup you trust. See [security](./security.md).
