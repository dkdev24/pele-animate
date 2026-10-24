// Placeholder build: the SvelteKit site lands in S3 (../SITE_DEV_PLAN.md). Output dir matches adapter-static's default.
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('build', { recursive: true });
writeFileSync('build/index.html', '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>pele-animate</title><p>pele-animate: step-by-step Mermaid diagrams on Pele. Site coming soon. <a href="https://github.com/dkdev24/pele-animate">GitHub</a> · <a href="https://www.npmjs.com/package/pele-animate">npm</a></p>\n');
