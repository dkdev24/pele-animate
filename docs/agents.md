---
title: For coding agents
description: How a coding agent should use pele-animate in a project, and how to verify the result.
order: 14
section: Reference
---

# For coding agents

If you are an AI coding agent adding pele-animate to a project, use the skill that ships with the package. It carries the rules
below in an order that works.

## Install the skill

The skill is in the npm package, so after `npm i pele-animate` it is at `node_modules/pele-animate/skills/pele-animate/SKILL.md`.
For Claude Code, copy it where skills live:

```sh
mkdir -p .claude/skills
cp -r node_modules/pele-animate/skills/pele-animate .claude/skills/
```

Or clone just the skill folder from [GitHub](https://github.com/dkdev24/pele-animate/tree/main/skills/pele-animate) (it has `SKILL.md`, `verify.js` and `references/`).

A second skill, `diagram-step-order`, reviews a page's diagrams so the step order matches the text around them.

No skill support? Paste this into your instructions file:

```md
## Diagrams (pele-animate)
- Animated Mermaid diagrams use `pele` + `pele-animate`; mount on the client only (see node_modules/pele-animate/docs or the README).
- Icon names must exist: read node_modules/pele-animate/tabler/<category>.js. Never invent names. Unknown names render a plain square.
- Order with `%% pa: 1=A 2=B,C`; check svg.paSteps in a browser.
- Verify by rendering the page and confirming no unexpected rounded-square icons.
```

## Rules

1. **Client only.** Never import `pele` or `pele-animate` in server code. Use the framework's mounted hook ([recipes](./recipes.md)).
2. **Never invent icon names.** Look them up in `node_modules/pele-animate/tabler/<category>.js` (object keys) and import that category.
   An unknown name does not fail; it renders a rounded square, so a made-up name is a silent bug.
3. **Import three things:** `pele-animate/glyphs` (`icons`), the icon pack modules you use, and `pele-animate/style.css`.
4. **Pin the order** with `%% pa:` when the default is wrong ([step order](./step-order.md)). Do not rename node ids after pinning.
5. **Verify in a browser**, not by reading the code.

## Verify

Render the page in a headless browser (Playwright, or any CLI browser) and run this in the page:

```js
(() => {
  const svgs = [...document.querySelectorAll('.pa-scene svg.pele')];
  const icons = [...document.querySelectorAll('.pa-scene svg.pele-icon[data-icon]')];
  return {
    diagrams: svgs.length,
    steps: svgs.map((s) => s.paSteps?.length ?? 0),
    emptyIcons: icons.filter((i) => !i.innerHTML.trim()).map((i) => i.dataset.icon),
  };
})()
```

Expect `diagrams` equal to the number you added, every `steps` entry above 0, and `emptyIcons` empty. A name that was not registered renders
a rounded square instead of nothing, so also compare the icon names in your Mermaid with the pack source.
