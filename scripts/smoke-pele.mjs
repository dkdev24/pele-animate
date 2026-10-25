// Pele canary: render fixtures with the installed Pele and check the SVG still carries the hooks pele-animate selects on
// (see docs/compatibility.md). Run: pnpm test. The `canary` workflow runs it against the latest Pele.
import { render } from 'pele';
import { icons } from '../glyphs.js';
import '../preset-doverunner.js';
import '../tabler/computers.js';

const fixtures = {
  flowchart: {
    src: `flowchart LR
  subgraph G[Group]
    A@{ icon: "http-get", form: "square", h: 88, label: "Request" }
    B[Server]
  end
  A -->|go| B
  B --> C`,
    need: ['.pele-node', '.pele-edge', '.pele-edge-label', '.pele-marker', '.pele-cluster-label', '.pele-icon'],
    ids: ['A', 'B', 'L_A_B_0'],
  },
  sequence: {
    src: `sequenceDiagram
  participant A as Client
  participant B as Server
  A->>B: ping
  B-->>A: pong`,
    need: ['.pele-lifeline', '.pele-actor-participant'],
    ids: [],
  },
};

let bad = 0;
const fail = (m) => { bad++; console.error('FAIL ' + m); };
for (const [name, { src, need, ids }] of Object.entries(fixtures)) {
  let svg = '';
  try { svg = (await render(src, { icons })).svg; } catch (e) { fail(`${name}: render threw ${e.message}`); continue; }
  for (const sel of need) {
    const cls = sel.slice(1);
    if (!new RegExp(`class="[^"]*\\b${cls}\\b`).test(svg)) fail(`${name}: no element with class ${cls}`);
  }
  for (const id of ids) if (!svg.includes(`data-id="${id}"`)) fail(`${name}: no data-id="${id}"`);
}
console.log(`pele smoke: ${Object.keys(fixtures).length} fixtures, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
