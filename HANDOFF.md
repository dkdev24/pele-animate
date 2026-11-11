# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.19.1** (2026-11-12, on npm: ReDoS regex fixes; includes the 0.19.0 content). 0.19.0 (GitHub release 2026-10-26, never published itself). **0.18.0** (published 2026-10-25, tag `v0.18.0`: looping step mode, `autoplay`/`interval`/`hold`, home comparison section; 0.17.1 published 2026-10-25: zoom buttons no longer start step mode, zoom hidden in step mode; 0.17.0 published 2026-10-25: removed `replay()` and `watch` `controls: false`, share links URL-encoded; 0.16.2 published 2026-10-24; 0.16.1: 0.16.0: 10 new diagram types, S5 playground; consumers on `^0.15` need a range bump)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-11-12 (code scanning, released as 0.19.1): fixed 7 alerts: ReDoS regexes in `pele-animate.js` (lines 12, 14, 108; library behavior unchanged), `stripTags` loop in `site/src/lib/server/docs.ts` (multi-character sanitization), backslash escape in `site/scripts/agent-readiness.mjs`, `permissions: contents: read` in `ci.yml`; new `scripts/check-regex.mjs` in `pnpm test`. No version bump. Alerts close after the CodeQL re-scan. The 2026-11-10 `.md` noindex fix is in WORKLOG.
---
## Earlier Sessions
- 2026-11-08 (pele 1.13.0, PR #2 merged): dependabot PR #2 (pele 1.12.0→1.13.0, lockfile-only, pnpm-lock.yaml 10 lines) merged per Daniel's approval (`31ae57c`; main = production deploy → Cloudflare Pages). Pele publishes no per-version release notes (no GitHub releases/CHANGELOG), so verification was the canary: `pnpm test` on the PR branch passed on pele 1.13.0 (check-docs 36 fences/34 files, smoke 6 fixtures/22 class hooks, 0 problems). No code change needed.
- 2026-11-01 (pele 1.12.0 + Pele canary, PR #1 merged): PR #1 (pele 1.10.0→1.12.0, lockfile-only) merged after verifying the 1.11/1.12 release notes have no breaking changes; extended `scripts/smoke-pele.mjs` to 6 fixtures/22 class hooks covering every pele-* class `pele-animate.js` selects on (`.pele-zoom` is mount()-only, excluded by design); `docs/compatibility.md` dependency list rewritten ("Tested with 1.7/1.8/1.9" line left untouched per Daniel's 2026-10-31 instruction). Pushed `5af163a`.
- 2026-10-31 (SEO/AEO and agent-readiness, all pushed): README/docs AEO pass, homepage FAQ + JSON-LD, siteready 1.21.0 `postbuild` (`agent-readiness.mjs`: canonical, hidden llms.txt pointer, `index.md`/`404.md`) plus `functions/_middleware.js` for `Accept: text/markdown`. Detail: WORKLOG "Site: SEO/AEO passes and agent-readiness". Open: the 20 hand-written `.md` mirrors use path-relative links (fix where the site generates them); is-agentic rescan after its 6-hour cache expires.
- 2026-10-30 (OG tags + image): `og-card.jpg` and full OG/Twitter meta in `+layout.svelte`; og:url per page, title/description site-wide.
---

## Next Actions

1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Eyeball `c3.gif`/`a3.gif` (step mode, live docs and phone-width checks done by Daniel 2026-10-26).
3. Touch-device behavior; types; `≠`/lock-pill glyphs.
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
