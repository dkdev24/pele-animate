---
title: Recipes
description: Using pele-animate in Vite, SvelteKit, Astro, Nuxt, React and plain HTML, with what has been tested.
order: 8
section: Guides
---

# Recipes

Pele and pele-animate need the DOM, so in every framework the rule is the same: **mount on the client, after the page has
rendered.** Load them with dynamic `import()` inside the framework's mounted hook so server rendering never touches them.

The shape is always:

```js
const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
  import('pele'),
  import('pele-animate'),
  import('pele-animate/glyphs'),
  import('pele-animate/tabler/computers'), // your icon categories
  import('pele-animate/style.css'),
]);
mount(el, prepare(src), { icons });
watch(el, src);
```

| Framework | Status | Where the code goes |
|---|---|---|
| Plain HTML / Vite | Tested | A module script, as in [getting started](./getting-started.md) |
| Astro | Tested in production (the DoveRunner docs site) | A client `<script>` that finds the diagram elements |
| SvelteKit 3 | Tested (build and browser, static adapter) | `onMount(async () => { ... })` in the page or component |
| Nuxt 4 | Tested (build and browser, static generate) | `onMounted` in a `.client.vue` component |
| React / Next.js | Not tested | A client component (`'use client'`) with `useEffect` |
| Vue (no Nuxt) | Not tested | `onMounted` |

Notes for all of them:

- Give each diagram its own element (`<pre>` or `<div>`) holding the Mermaid source, and call `mount` and `watch` once per
  element.
- If the page changes without a reload (client-side routing), mount again for the new elements.
- Importing the CSS (`pele-animate/style.css`) once is enough. In TypeScript, a CSS side-effect import needs a `*.css` module
  declaration (Vite projects get it from `vite/client`).
- Static site generators are fine: nothing here needs a server.

## Astro

```astro
<pre class="mermaid" set:text={src}></pre>
<script>
  // runs in the browser only
  import { mount } from 'pele';
  import { watch, prepare } from 'pele-animate';
  import { icons } from 'pele-animate/glyphs';
  import 'pele-animate/tabler/computers';
  import 'pele-animate/style.css';
  document.querySelectorAll('pre.mermaid').forEach((el) => {
    const src = el.textContent ?? '';
    mount(el as HTMLElement, prepare(src), { icons });
    watch(el as HTMLElement, src);
  });
</script>
```

## SvelteKit

```svelte
<script>
  import { onMount } from 'svelte';
  let el;
  const src = 'flowchart LR\n  A --> B';
  onMount(async () => {
    const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
      import('pele'), import('pele-animate'), import('pele-animate/glyphs'), import('pele-animate/style.css'),
    ]);
    mount(el, prepare(src), { icons });
    watch(el, src);
  });
</script>
<div bind:this={el}></div>
```
