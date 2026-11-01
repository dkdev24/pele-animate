// Pele canary: render fixtures with the installed Pele and check the SVG still carries the hooks
// pele-animate selects on (see docs/compatibility.md). Run: pnpm test. The `canary` workflow runs it
// against the latest Pele.
//
// Covered: every pele-* class pele-animate.js queries in render() output, per diagram type.
// Not covered: `.pele-zoom` — the zoom buttons are a <div> that mount()/enableZoom() adds to the
// container in the browser, so render() output never contains it. A rename there would fail softly
// (stale zoom is left alone, clicks pass through), and is caught by the site's browser checks.
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
    need: ['.pele-sequence', '.pele-lifeline', '.pele-actor-participant', '.pele-actor-footer'],
    ids: [],
  },
  timeline: {
    src: `timeline
  title History
  2020 : Event A
  2021 : Event B`,
    need: ['.pele-timeline', '.pele-period'],
    ids: [],
  },
  gantt: {
    src: `gantt
  title Plan
  dateFormat YYYY-MM-DD
  section S
    T1 :a1, 2026-01-01, 3d
    T2 :after a1, 2d`,
    need: ['.pele-gantt', '.pele-task'],
    ids: [],
  },
  journey: {
    src: `journey
  title Trip
  section S1
    Task1: 5: Me
    Task2: 3: You`,
    need: ['.pele-journey', '.pele-task', '.pele-face'],
    ids: [],
  },
  gitGraph: {
    src: `gitGraph
  commit
  branch dev
  checkout dev
  commit
  checkout main
  merge dev`,
    need: ['.pele-gitGraph', '.pele-commit', '.pele-branch', '.pele-lane', '.pele-edge'],
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
const hooks = Object.values(fixtures).reduce((n, f) => n + f.need.length, 0);
console.log(`pele smoke: ${Object.keys(fixtures).length} fixtures, ${hooks} class hooks, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
