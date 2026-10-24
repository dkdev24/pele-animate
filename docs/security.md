---
title: Security
description: Untrusted diagram text, and what pele-animate adds.
order: 12
section: Reference
---

# Security

- **Diagram text.** Pele escapes diagram text, filters links and styles, and limits source and output size. Read Pele's
  [security page](https://pele.run/security) before rendering diagrams you did not write. pele-animate does not weaken any of
  that: it reads the SVG after Pele renders it.
- **Pins.** The `%% pa:` comment is parsed with a simple pattern (step numbers and ids). It cannot run code.
- **Glyph markup is trusted.** `registerGlyphs()` and `registerTabler()` insert your markup into the page as SVG. Register only
  markup you wrote or reviewed. The bundled Tabler and `doverunner-*` packs are static files in the package.
- **No network.** pele-animate makes no requests and loads no remote assets.
- **No eval.** Nothing in the package uses `eval` or generates code, so a content security policy without `unsafe-eval` works.

Report a vulnerability by opening an issue on the [GitHub repository](https://github.com/dkdev24/pele-animate) that asks for a private contact. Leave the details out of the public issue.
