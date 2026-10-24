# HANDOFF.md

Cross-session context memory. Update this file at the end of every session.
---

## Current Version

**0.13.0** (published to npm 2026-10-24)

---
## Project Status

Library that turns Mermaid code into animated, illustrated SVG scenes at runtime (built on Pele, MIT). Plan in `PLAN.md`.
Phase 0 (prototype) and phase 1 (glyph registry, 6 glyphs, `glyphs.js`) and phase 2 (BFS sequencing, `%% pa:` override, WAAPI token loop on hover) done; phase 3 (scene frame, light/dark theming via `--pa-*`, click/Enter replay) done; phone-width verified by screenshot.

---

## Last Session
2026-10-24 (latest): 0.13.0 released; docs-starlight migrated and pushed. Then public-site planning (SvelteKit chosen; S3+ on hold for kepano's reply to our upstream issue) and **S0 to S2 built, unreleased**: pnpm workspace + CI + placeholder `site/`, `types/`, 16 `docs/*.md`, `skills/` (pele-animate + diagram-step-order; subagent test passed in a fresh Vite app). Unpublished: next release 0.14.0.
---

## Next Actions

1. Refine the `diagram-step-order` skill from the review (layout lessons: `row` wrappers, `TB` vs `LR` siblings, edge declaration order; see docs WORKLOG 2026-10-24).
2. Check step mode on a sequence diagram + phone width; check the live docs step mode.
3. Smoke test for Pele class names; touch-device behavior; types; `≠`/lock-pill glyphs.
4. Minor: edge-label patches look slightly lighter than the panel on multi-line labels (KO page).
5. Daniel: create the Cloudflare Pages project (repo root, `pnpm build`, output `site/build`); reply to kepano/wallabyway threads. Then S3 (SvelteKit site) when upstream answers. Release 0.14.0 = types + docs + skills.

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
