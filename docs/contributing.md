---
title: Contributing
description: Set up the repository, run the checks, and regenerate the Tabler packs.
order: 15
section: Reference
---

# Contributing

```sh
git clone https://github.com/dkdev24/pele-animate
cd pele-animate
pnpm install
pnpm test    # renders every Mermaid example in the docs and README with Pele, and checks icon names
pnpm build   # builds the site (a placeholder until the site lands)
```

- The package is plain ESM at the repository root: no build step. The site lives in `site/`.
- Docs are the Markdown files in `docs/`. A fenced block marked `mermaid` must render, and every `@{ icon }` name in it must exist.
- Fence convention: ```` ```mermaid live ```` is a diagram GitHub can also draw; the site animates it. A diagram with `@{ icon }` nodes uses ```` ```mermaid-icons live ````, because GitHub's Mermaid cannot draw icons (it shows "?" boxes), so GitHub shows the source text and the site animates it.
- Every `live` fence carries a title after the word `live`: `title="Flowchart: cache hit or miss"`. The playground's examples menu shows it (grouped by page), so write "Type: what it shows".
- Tabler packs are generated: `node scripts/build-tabler.mjs <path to a tabler-icons checkout>` rewrites `tabler/*.js`. Do not edit those
  files by hand. The Tabler version is recorded in each file header and in `THIRD-PARTY-NOTICES.md`.
- Add an entry to `CHANGELOG.md` for any user-visible change.
- Versioning stays on `0.x`.
- Keep example diagrams generic (clients, APIs, databases).
