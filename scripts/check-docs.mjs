// Renders every ```mermaid fence in docs/ and README.md with Pele (Node) and checks @{ icon } names against the packs.
// Run: pnpm test
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { render } from 'pele';
import { icons } from '../glyphs.js';
import '../preset-doverunner.js';

for (const f of readdirSync('tabler')) await import(`../tabler/${f}`);
const unknown = icons('\0unknown');
const files = ['README.md'];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') && files.push(p); } };
for (const d of ['docs', 'skills']) if (existsSync(d)) walk(d);

let n = 0, bad = 0;
for (const file of files) {
  for (const m of readFileSync(file, 'utf8').matchAll(/```mermaid(?:-icons)?[^\n]*\n([\s\S]*?)```/g)) {
    n++;
    const src = m[1];
    const line = readFileSync(file, 'utf8').slice(0, m.index).split('\n').length;
    try { await render(src, { icons }); } catch (e) { bad++; console.error(`FAIL ${file}:${line} ${e.message}`); }
    for (const [, name] of src.matchAll(/icon:\s*"([^"]+)"/g)) {
      if (icons(name) === unknown) { bad++; console.error(`FAIL ${file}:${line} unknown icon "${name}"`); }
    }
  }
}
console.log(`${n} mermaid fence(s) in ${files.length} file(s), ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
