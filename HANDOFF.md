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
2026-10-30 (OG tags + image, **not pushed yet** — push to main deploys pele-animate.danielkimdev.com, needs Daniel's go-ahead): shared links showed a platform placeholder because the site had no OG tags at all. Added `site/static/og/og-card.jpg` (1200×630 JPEG, 79KB — screenshot of the live Bloom hero at 1200×630 via headless Chromium, diagram settled to still frame) and full OG/Twitter meta tags in `site/src/routes/+layout.svelte` (`<svelte:head>`: og:type/site_name/title/description/url/locale/image+1200×630+alt, twitter:card summary_large_image). New `ogTitle`/`ogDescription` i18n keys (en/ko) reuse the homepage's exact title/description copy; og:url is per-page, og:title/description are site-wide for now (per-page OG is a follow-up). `pnpm build` green (42 pages, 0 problems); EN/KO home, docs, playground dist verified. `pnpm test` pass. Note: this VM was replaced — `pnpm install` re-run, and global pnpm 11.1.1 (for whatif-classics) reinstalled via npm.
---
## Previous Session
2026-10-26 (Korean site): `/ko/` for home, docs (15 pages in `docs/ko/`), icons, playground, privacy; changelog page has Korean chrome, English content. Routes moved under `[[lang=lang]]` (matcher in `src/params.ts`, set via `files.params` in `vite.config.ts`); `src/lib/i18n.ts` holds UI strings and `swap()` for the header language link; `hooks.server.ts` sets `<html lang>`; hreflang + sitemap alternates; `check-site.mjs` fails if a `docs/ko/` twin is missing. Slugify is Unicode-aware (Korean heading ids). Terms: 단계, 엣지, 핀, 인트로, 단계 모드. `pnpm test` and `pnpm build` pass; screenshots of `/ko/` and a docs page checked at 800px. Phone width, light mode and the live deploy were checked by Daniel afterwards (2026-10-26).
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
