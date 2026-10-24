---
title: Migrating
description: Breaking changes between releases, with the renames to apply.
order: 13
section: Reference
---

# Migrating

pele-animate stays on `0.x`: a minor release may break things. Pin a range such as `^0.13.0` and bump it deliberately.

## 0.12 to 0.13

Two breaking changes.

### 1. Illustrated glyphs are renamed `doverunner-<name>`

The plain names now belong to the Tabler icon packs. Rename the `@{ icon }` values in your Mermaid sources:

| Before | After |
|---|---|
| `player` | `doverunner-player` |
| `server` | `doverunner-server` |
| `key` | `doverunner-key` |
| `document` | `doverunner-document` |
| `shield` | `doverunner-shield` |
| `phone` | `doverunner-phone` |
| `cloud` | `doverunner-cloud` |
| `package` | `doverunner-package` |
| `token` | `doverunner-token` |
| `lock` | `doverunner-lock` |
| `database` | `doverunner-database` |
| `video` | `doverunner-video` |
| `media` | `doverunner-media` |
| `encoder` | `doverunner-encoder` |
| `storage` | `doverunner-storage` |
| `plugin` | `doverunner-plugin` |
| `variants` | `doverunner-variants` |
| `watermark` | `doverunner-watermark` |
| `bits-a`, `bits-b` | `doverunner-bits-a`, `doverunner-bits-b` |

A search and replace over `icon: "<name>"` does it. Or switch to Tabler icons and drop the renamed ones; see [icons](./icons.md).

### 2. The glyphs moved into the preset

The seven glyphs that lived in `pele-animate/glyphs` are now in `pele-animate/preset-doverunner`. `pele-animate/glyphs` is only the
registry (`icons`, `registerGlyphs`, `registerTabler`). If you use any `doverunner-*` glyph, import the preset:

```js
import 'pele-animate/preset-doverunner';
```

### New in 0.13

- Tabler icon packs: `pele-animate/tabler/<category>`, with the `--pa-stroke` variable.
- `icons()` returns a neutral rounded square for unknown names, instead of a blank slot.

A missed rename shows up as that rounded square, not as an error, so look for unexpected squares after upgrading.
