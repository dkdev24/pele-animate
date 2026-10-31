# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.19.0** (GitHub release 2026-10-26, **not on npm**: Korean site and docs, home page refresh, Node 24 toolchain; npm latest is 0.18.0). **0.18.0** (published 2026-10-25, tag `v0.18.0`: looping step mode, `autoplay`/`interval`/`hold`, home comparison section; 0.17.1 published 2026-10-25: zoom buttons no longer start step mode, zoom hidden in step mode; 0.17.0 published 2026-10-25: removed `replay()` and `watch` `controls: false`, share links URL-encoded; 0.16.2 published 2026-10-24; 0.16.1: 0.16.0: 10 new diagram types, S5 playground; consumers on `^0.15` need a range bump)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-31 (small SEO/AEO fixes, **not pushed**): 4 items from the re-audit — changelog page got a meta description (EN/KO); `/icons/` gallery title renamed to "Icon gallery · pele-animate" / "아이콘 갤러리" (was duplicating `/docs/icons/`); FAQ gained a share-links Q&A (EN + natural-Korean twin; FAQPage JSON-LD now 16 questions, verified in build output); TL;DR summary blocks added to `docs/getting-started.md` and `docs/how-it-works.md` (+ ko twins). Left untouched per instruction: `docs/compatibility.md:12` "Tested with 1.7/1.8/1.9" (needs Daniel's confirmation). `pnpm test` pass, `vite build` + `check-site.mjs` green (42 pages, 0 problems). Committed locally as `4e31d40`; push pending Daniel's approval (main = production deploy).
---
## Previous Session
2026-10-31 (agent-readiness via siteready 1.21.0): scanning the live site gave is-agentic 59 (F) / afdocs 85 (B); siteready had no SvelteKit fixer, so one was added there and run here. `site/scripts/agent-readiness.mjs` is wired as `postbuild` (`site/package.json`) and edits `site/build/` after the build: canonical link from og:url, hidden llms.txt pointer, `index.md` + `404.md` mirrors; the site's own llms.txt, `.md` files, robots.txt and JSON-LD are left alone. `functions/_middleware.js` (repo root, where `wrangler.toml` is) serves `Accept: text/markdown` with `Vary: Accept`. Local afdocs 85 -> 95 on a copy. `pnpm test` and `pnpm build` green. Open: the 20 hand-written `.md` mirrors use path-relative links (`./page.md`), fix where the site generates them; rescan the live site with `npx siteready <url>` after deploy.
---
## Previous Session
2026-10-31 (homepage AEO pass, **pushed 14:21 KST per Daniel's approval**): audit of the homepage found a stale claim ("supports flowcharts and sequence diagrams" — actual support is 12 types), no Organization/SoftwareApplication schema, and no FAQ block. Fixed: diagram-type list now matches docs (EN/KO); added a 4-question FAQ section at the page bottom (curated subset of docs/faq.md, EN/KO); `<svelte:head>` now emits a `@graph` JSON-LD with SoftwareApplication (MIT, price 0) + FAQPage. `vite build` + `check-site.mjs` green (42 pages, 0 problems); JSON-LD verified in `build/index.html` and `build/ko/index.html`. Committed as `b3ab580`; pushed together with the docs pass (`70cb6d3`) — deploys to pele-animate.danielkimdev.com via Cloudflare Pages.
---
## Previous Session
2026-10-31 (AEO docs pass, **pushed 14:21 KST per Daniel's approval**): per Draft.dev AEO/GEO playbook review — README got a TL;DR summary blockquote and a "which renderer for which job" comparison table (Mermaid.js / Pele / pele-animate), plus an inline FAQ section; `docs/faq.md` and `docs/ko/faq.md` expanded to 15 Q&As each (definition-first: "What is pele-animate?", autoplay, framework recipes, MIT, playground); site FAQ page now emits `FAQPage` JSON-LD parsed from the markdown (`+page.server.ts` `faqPairs`, rendered in `+page.svelte` head; works for EN and KO). `pnpm test` pass (0 problems), `vite build` + `check-site.mjs` green (42 pages, 0 problems); JSON-LD verified in `build/docs/faq/index.html` and `build/ko/docs/faq/index.html`. Committed as `70cb6d3`.
---
## Earlier Sessions
- 2026-10-30 (OG tags + image): `og-card.jpg` and full OG/Twitter meta in `+layout.svelte`; og:url per page, title/description site-wide.
- 2026-10-26 (Korean site): `/ko/` for home, docs (15 pages in `docs/ko/`), icons, playground, privacy; changelog page has Korean chrome, English content. Routes moved under `[[lang=lang]]` (matcher in `src/params.ts`, set via `files.params` in `vite.config.ts`); `src/lib/i18n.ts` holds UI strings and `swap()` for the header language link; `hooks.server.ts` sets `<html lang>`; hreflang + sitemap alternates; `check-site.mjs` fails if a `docs/ko/` twin is missing. Slugify is Unicode-aware (Korean heading ids). Terms: 단계, 엣지, 핀, 인트로, 단계 모드. `pnpm test` and `pnpm build` pass; screenshots of `/ko/` and a docs page checked at 800px. Phone width, light mode and the live deploy were checked by Daniel afterwards (2026-10-26).
---

## Next Actions

1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Eyeball `c3.gif`/`a3.gif` (step mode, live docs and phone-width checks done by Daniel 2026-10-26).
3. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
5. Playground gaps: CodeMirror (icon completion, pin lint), Download SVG (phone-width tabs verified, header overflow fixed); e2e tests for `/icons` and `/playground`. Then S7 (a11y; OG done 2026-10-30 — see Last Session). Still open: wallabyway reply (kepano answered on obsidianmd/pele#78: no plans to change the class names), S7 a11y, e2e tests, `vite dev` check. Next release 0.19.0.

---

## Open Issues

- Node pulse skipped: Pele positions nodes with a `transform` attribute that a CSS transform would override.
- Multi-DRM triple edge between Player/OTT/DRM routes messily (Pele layout); needs bigger nodes (fork) or sequence form.

---

## Key Paths

| Path | Purpose |
|---|---|
| `PLAN.md`, `SITE_DEV_PLAN.md`, `SITE_FRAMEWORK_RESEARCH.md` | Dev plan; public site/docs/skills plan (SvelteKit); framework spikes and numbers |
| `CHANGELOG.md` | Public changelog (add an entry per release; not yet in npm `files`) |
| `pele-animate.js` / `.css` | Prototype post-processor |
| `glyphs.js` | Glyph registry (`icons`, `registerGlyphs`, `registerTabler`); no art; unknown names get a fallback square |
| `preset-doverunner.js` | 20 illustrated `doverunner-*` glyphs |
| `tabler/*.js`, `scripts/build-tabler.mjs` | 36 generated Tabler category packs (MIT, notice in `THIRD-PARTY-NOTICES.md`) |
| `demo.html` | Test page (`python3 -m http.server`, open `/demo.html`) |
