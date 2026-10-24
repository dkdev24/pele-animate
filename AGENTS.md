# AGENTS.md — pele-animate

Step-by-step animated Mermaid diagrams with icons, built on [Pele](https://github.com/obsidianmd/pele) (MIT). Unofficial add-on.
Positioning: step order, step playback and icons; not a theme package. First consumer: the DoveRunner docs site.
Dev plan: `PLAN.md`. Owner: Daniel Kim (`dkdev24`). **Public repo and public npm package.**

## Layout

- `pele-animate.js` / `.css` — post-processor (`animate(svg)`, `watch(container)`)
- `docs/` — the documentation (Markdown, single source: read on GitHub, shipped in npm, rendered by the site later). Fenced `mermaid` blocks must render: `pnpm test`. Diagrams with `@{ icon }` use the ```` ```mermaid-icons live ```` fence (GitHub cannot draw icons)
- `skills/` — agent skills shipped in npm: `pele-animate` (adopt + verify), `diagram-step-order`; `.claude/skills/diagram-step-order` is a symlink
- `site/` — SvelteKit 3 site (S3 done; deploys to pele-animate.pages.dev on push to `main`); `DESIGN.md` is its look and feel; `pnpm build` runs its checks. `types/` — hand-written `.d.ts`. `tabler/` — generated, never hand-edit (`scripts/build-tabler.mjs`)
- `demo.html` — test page; serve with `python3 -m http.server`
- `PLAN.md` — phases and findings
- `SITE_DEV_PLAN.md` — plan for the public site (pele-animate.danielkimdev.com, SvelteKit), docs and skills; S0–S3 done; S4 (icons page) next. `SITE_FRAMEWORK_RESEARCH.md` — why SvelteKit
- `CHANGELOG.md` — public, Keep a Changelog format; add an entry with every release (no internal names)

## Working agreements

- Source stays valid Mermaid (extensions only via Mermaid's own `@{ icon }` syntax or `%%` comments).
- Prefer the post-processor and Pele's public `icons` option; fork Pele only per PLAN.md phase 5.
- Idle state = finished still frame; honor `prefers-reduced-motion`.
- pnpm workspace (`.`, `site`); `pnpm test` before committing. Pin `pele`; no new dependencies without need. The package itself is plain ESM, no build step.
- A breaking change needs a `CHANGELOG.md` entry and a section in `docs/migrating.md`. Keep examples generic.
- Versioning: stay on 0.x. Next release is 0.15.0; never bump to 1.0.0 until Daniel says so. Consumers on `^0.x` need an explicit range bump per minor.
- Company boundary: no DoveRunner-internal identifiers in this repo.

## System Documents

Two documents maintain cross-session state. Read them at the start of every session. Update them at the end.

### HANDOFF.md

- Location: `HANDOFF.md`
- Purpose: Cross-session context memory.
- Contains: current version, project status, last session summary, next actions, open issues, key paths.
- **Max 50 lines.** It is a snapshot, not a log; superseded content moves to `WORKLOG.md`.
- **Read at the start of every session.**
- **Update at the end of every session.** Replace Last Session and Next Actions; append to Open Issues as needed.

### AGENTS.md

- Location: `AGENTS.md`
- **Max 80 lines.** Only what is needed at session start; detail goes to `PLAN.md` or `WORKLOG.md`.

### WORKLOG.md

- Location: `WORKLOG.md`
- Purpose: Persistent project history, one entry per version milestone (date, changes, status).
- **Do not load at session start.** Append at milestones; never edit past entries.
- Version format `x.x.x`: patch = small changes, minor = new subsystems, major = production-ready.
