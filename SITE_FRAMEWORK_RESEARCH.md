# Site framework research (2026-10-24)

**Decision (2026-10-24, Daniel): SvelteKit 3.** Applied in `SITE_DEV_PLAN.md` §3 and §12. Astro stays the documented fallback.

Input to `SITE_DEV_PLAN.md` §3 and §12. Question: which framework should build the pele-animate site (docs from
`/docs`, icon browser, playground, changelog) besides the default, Astro? Goal is also personal learning, so
trending alternatives are welcome if they fit.

Method: web search (2026 comparison articles, official docs for SvelteKit and TanStack Start) plus the toonstrip and
docs-starlight experience in this workspace. **Most comparison articles are vendor-tied blogs with unverified
benchmark numbers; treat figures as rough.** Spike results (section 5) are first-hand.

## 1. What the site needs

| Need | Weight |
|---|---|
| Static output on Cloudflare Pages (no server) | must |
| Markdown docs from a folder outside the app (`../docs`), frontmatter, GitHub-readable | must |
| Live diagram component that is client-only (`pele` + `pele-animate` touch the DOM) | must |
| Playground: CodeMirror editor, shared state, preview, URL-hash sharing | high (the main interactive surface) |
| Icon browser over 4,368 icons without downloading all markup | high |
| `llms.txt`, `.md` siblings, sitemap, RSS | medium (build-time endpoints) |
| Small JS on docs/landing pages | medium |
| i18n later (EN root, KO under `/ko/`) | low, later |

`pele-animate` is vanilla ESM and client-only, so **the framework choice does not touch the published package**;
every option needs only a client-only wrapper around `mount()` and `watch()`.

## 2. Candidates

| Candidate | Fit | Notes |
|---|---|---|
| **Astro 7** (baseline) | Docs and marketing: best. Playground: fine via a Preact island. | Proven in this workspace (toonstrip, docs-starlight, danielkimdev-astro); every pattern already exists. Described in the sources as lightest for static content, "not ideal" for highly interactive SPAs. |
| **SvelteKit (Svelte 5)** | Playground: best. Docs: hand-built shell. | `adapter-static` + `export const prerender = true` prerenders everything; build fails unless every page is prerendered, which is a useful guard. Smaller runtime than Nuxt in the sources (about 30 KB vs 70 KB, rough). Ships the Svelte runtime even on static pages. No Starlight-equivalent. |
| **Nuxt 4 + Nuxt Content** | Docs-from-folder: strongest. | Markdown with frontmatter becomes pages, components inside Markdown, search. Broadest hosting support (Nitro). Heavier runtime, slower builds in the sources. Vue. Unverified: reading content from outside the app folder, `llms.txt` support. |
| **TanStack Start (React)** | App-like playground only. | 1.0 stable per the TanStack blog (2026-10-13). Server-first; static means SPA mode with a prerendered shell (`/_shell.html`), which disables server rendering of route components. An open issue reports a Nitro + SPA-mode prerender error; not confirmed fixed. Poor fit for a docs-heavy static site. |
| **VitePress (Vue)** | Docs only. | Fast, polished, Markdown in a folder, Shiki highlighting, custom containers. Weak as a landing page and playground host. |
| Fresh (Deno), Qwik | Not recommended. | Smaller ecosystems per the sources; Deno or resumability learning cost with no gain here. |
| Docusaurus, Fumadocs (Next.js) | Not recommended. | Heavier than a package this size needs; Fumadocs also ties the stack to Next.js. Starlight (Astro) is the docs-framework option if Astro stays. |

## 3. Recommendation

1. **Try SvelteKit (Svelte 5) first** (spiked; see section 5). The playground is the core of the site and Svelte is the cleanest reactive fit.
   The docs loader and the `live` fence plugin are framework-agnostic (remark/marked), so they port.
2. **Second: Nuxt 4 + Nuxt Content**, if the docs-first story matters more than the playground (spiked; see section 5).
3. **Fallback: Astro**, the fast path with existing references.

## 4. Spike plan (scratch directory, nothing added to this repo)

1. Render a sample `docs/getting-started.md` containing a ```` ```mermaid live ```` fence as an animated diagram.
2. Build an `/icons` page: search over all 4,368 names, category chips, per-category lazy loading of icon markup.
3. Measure: client JS per route, build time, whether Tabler categories become separate chunks.
4. Judge: how it felt to write, and what was missing compared with Astro.

## 5. Spike results

Spike: SvelteKit 3 (Svelte 5.57, Vite 8, `adapter-static` 4) with `pele` 1.9.0 and `pele-animate` 0.13.0 from npm,
built on 2026-10-24 in a scratch directory (not in this repo). About 150 lines of app code in total.

| Check | Result |
|---|---|
| Markdown docs from a folder outside the app (`../spike-docs`) | Works. `import.meta.glob('../../../spike-docs/*.md', { query: '?raw' })` plus `server.fs.allow: ['..']` read the files; dev-mode behavior not tested, only build and preview. |
| `live` fence becomes an animated diagram | Works. A `marked` renderer turns ```` ```mermaid live ```` into a `<div class="live" data-src>`; `onMount` dynamically imports `pele`, `pele-animate`, `/glyphs`, `tabler/computers` and the CSS, then runs `mount()` + `watch()`. All 3 icons rendered with markup, scene got `pa-scene`. |
| Relative doc links (`./icons.md`) | Rewritten to `/docs/icons/` by a 3-line `link` renderer. |
| Static prerender | 4 pages written (`/`, `/icons/`, `/docs/getting-started/`, `/docs/icons/`). A dynamic `[slug]` route needs an `entries()` export listing the slugs. `strict: true` fails the build for any page not prerendered. |
| `/icons` over 4,368 icons | Works. Name and tag search over a 661 KB `icons.json` (fetched at runtime, not bundled) filtered "lock" to 224 hits in about 4 ms; first 120 hits rendered, all with markup. Markup loads per category through `import.meta.glob('/node_modules/pele-animate/tabler/*.js')` (lazy). |
| Build time | About 4.7 s for the whole build (`vite build` itself 0.4 s). |
| JS per route, cold load (minified, uncompressed; see measurement note) | `/` 93 KB in 13 files. `/docs/getting-started/` 832 KB in 17 (pele + pele-animate + one pack). `/icons/` 700 KB in 27 (the first 120 icons span many categories, so many category chunks load; picking a category loads one). |

What differed from Astro:

- **Svelte runtime on every page.** The landing page ships 93 KB of uncompressed JS where Astro's sources claim none by default (Astro not measured here). Fine for this site, but a real cost for pure docs pages.
- **No content collections, MDX, Shiki or sitemap/RSS/`llms.txt` built in.** Frontmatter parsing, highlighting and the agent endpoints are ours to write (`+server.ts` prerendered endpoints should do it; not tried). Starlight-style sidebar and prev/next are hand-built, as the toonstrip plan already assumes.
- **SvelteKit 3 changes to know:** config now lives in `vite.config.ts` (no `svelte.config.js`), `$lib` is removed in favor of `#lib`, and the toolchain is Vite 8 with Rolldown. Most online tutorials still show the old setup.
- **Where Svelte was nicer:** the icon browser is about 40 lines with `$state`, `$derived` and `$effect`, with no store or signal library; `{@html}` and scoped styles are built in. This is the playground's strength, though the spike has no editor yet.

Not tested: `vite dev`, HMR with outside-folder docs, prerendered `+server.ts` endpoints, i18n (needs an extra library such as Paraglide), CodeMirror in Svelte, deployment to Cloudflare Pages.

Verdict: SvelteKit meets every must-have in section 1. Compared with Astro it costs the hand-built docs infrastructure and about 93 KB (uncompressed) of baseline JS, and gains a nicer interactive-UI model. Reasonable choice if the learning goal outweighs Astro's ready-made docs tooling; the Nuxt spike (not run) would answer the docs-first alternative.

### Nuxt 4 + Nuxt Content

Spike: Nuxt 4.6.2 (Vite 8, Nitro 2.13), `@nuxt/content` 3.16.2, same packages and same three checks, built the same day
in a scratch directory. About 130 lines of app code.

| Check | Result |
|---|---|
| Markdown docs from a folder outside the app | Works with a first-class option: `defineCollection({ source: { cwd: path.resolve('../spike-docs'), include: '**/*.md', prefix: '/docs' }, schema: z.object({ order, section }) })`. Frontmatter is parsed and validated by a schema, with no hand parsing. |
| `live` fence becomes an animated diagram | Works. A `components/content/ProsePre.vue` override receives `language` and `meta`, so ```` ```mermaid live ```` renders a `LiveDiagram.client.vue` (dynamic imports in `onMounted`). All 3 icons rendered. |
| Relative doc links (`./icons.md`) | Rewritten to `/docs/icons` by Nuxt Content with no code. |
| Static prerender | `nuxt generate` wrote the 4 pages plus `200.html` and `404.html`; it crawls links. |
| `/icons` over 4,368 icons | Works after one fix: `import.meta.glob('/node_modules/...')` matched nothing (Nuxt's Vite root is not the project root), so the first build showed empty cards; the relative form `'../../node_modules/pele-animate/tabler/*.js'` worked. "lock" gave 224 hits in about 4 ms; 120 cards with markup. |
| Build time | About 7 s (`nuxt generate`). |
| JS per route, cold load (minified, uncompressed) | `/` 250 KB in 12 files. `/docs/getting-started/` 1,145 KB in 20 (pele + pele-animate + pack + Nuxt Content client). `/icons/` 1,159 KB in 47. Plus an 844 KB `sqlite3.wasm` fetched on the docs page. |
| Install weight | `node_modules` 324 MB (SvelteKit spike 75 MB). |

What differed:

- **Docs are the strength.** Collection source outside the repo folder, schema-validated frontmatter, relative-link rewriting
  and component overrides for fences all work out of the box, so the docs layer needs far less code than SvelteKit.
- **Nuxt Content ships a SQLite database to the browser.** It needs `better-sqlite3` installed by hand (the first build
  failed with a clear error), and the docs page fetched an 844 KB `sqlite3.wasm` plus a worker. That is the cost of
  client-side `queryCollection`; whether it can be avoided on a fully static site was not investigated.
- **Heavier everywhere:** more JS on every route and a 4x larger `node_modules`.
- **Agent endpoints:** the `nuxt-llms` module exists on npm (0.3.0, from the NuxtLabs repo) for `llms.txt`; not tried.
  `.md` siblings are not provided.
- **Vue, not Svelte or React:** none of the existing site code transfers; the learning value is Vue 3 and Nitro.

Not tested: `nuxt dev`, `nuxt-llms`, CodeMirror in Vue, i18n (`@nuxtjs/i18n` exists), Cloudflare Pages deploy, avoiding the
client-side SQLite download.

Measurement note: numbers are minified, uncompressed bytes of unique `.js` files fetched on a cold load of each route, from
a static server, each route on a fresh origin. An earlier warm-cache run understated SvelteKit; it was discarded. Gzip sizes were not measured.

### Side by side

| | Astro (not run; from sources and the toonstrip site) | SvelteKit 3 | Nuxt 4 + Content |
|---|---|---|---|
| Docs from `../docs`, frontmatter, links | Content collection `glob()` loader | Hand-built (about 30 lines) | Built in, schema-validated |
| `live` fence component | Remark plugin + island | Custom renderer + `onMount` | `ProsePre` override + client component |
| Landing JS (cold, uncompressed) | about 0 by default | 93 KB | 250 KB |
| Docs page JS | pele + pack only | 832 KB | 1,145 KB + 844 KB wasm |
| Build time (tiny site) | not measured | 4.7 s | 7 s |
| `node_modules` | n/a | 75 MB | 324 MB |
| Playground fit | Preact island | Best (runes, no extra library) | Good (Vue) |
| Agent endpoints (`llms.txt`, `.md`) | Hand-built endpoints | `+server.ts`, untested | `nuxt-llms`, untested |

### After both spikes

Both frameworks meet every must-have. For **this** site, SvelteKit is the better learning target (smaller, closer to the
playground's needs, a genuinely different model from Astro); Nuxt Content is the better docs engine but pays for it with
runtime weight, a browser SQLite download and a much bigger install. Astro remains the lowest-risk, lowest-JS choice.

## Sources

- [Astro Competitors & Alternatives (2026)](https://www.producthunt.com/products/astro-build-faster-websites/alternatives)
- [Best Static Site Generators in 2026](https://naturaily.com/blog/best-static-site-generators)
- [Astro vs SvelteKit (2026)](https://gautamkhorana.com/static-site-generators/compare/astro-vs-sveltekit/)
- [9 Best Static Site Generators in 2026 (Real Benchmarks)](https://talos.tools/blog/best-static-site-generators-2026)
- [docusaurus vs vitepress vs nextra vs starlight 2026](https://www.pkgpulse.com/guides/docusaurus-vs-vitepress-vs-nextra-vs-starlight-2026)
- [Astro Starlight vs Fumadocs](https://toolquestor.com/vs/astro-starlight-vs-fumadocs)
- [TanStack Start 1.0](https://tanstack.com/blog/tanstack-start-1-0)
- [TanStack Start SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)
- [SvelteKit adapter-static](https://svelte.dev/docs/kit/adapter-static)
