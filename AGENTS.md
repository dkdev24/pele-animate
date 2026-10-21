# AGENTS.md — pele-animate

Animated, illustrated SVG diagrams from plain Mermaid code, built on [Pele](https://github.com/obsidianmd/pele) (MIT).
First consumer: the DoveRunner docs site. Visual reference: the DoveRunner Lab product cards.
Dev plan: `PLAN.md` (read it before building). Owner: Daniel Kim (`dkdev24`, private repo).

## Layout

- `pele-animate.js` / `.css` — post-processor (`animate(svg)`, `watch(container)`)
- `demo.html` — test page; serve with `python3 -m http.server`
- `PLAN.md` — phases and findings

## Working agreements

- Source stays valid Mermaid (extensions only via Mermaid's own `@{ icon }` syntax or `%%` comments).
- Prefer the post-processor and Pele's public `icons` option; fork Pele only per PLAN.md phase 5.
- Idle state = finished still frame; honor `prefers-reduced-motion`.
- Pin `pele`; no new dependencies without need. Plain ESM, no build step until packaging.
- Versioning: stay on 0.x. Next release is 0.10.0; never bump to 1.0.0 until Daniel says so. Consumers on `^0.x` need an explicit range bump per minor.
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
