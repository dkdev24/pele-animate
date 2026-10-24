// Paste into the browser (agent-browser eval "$(cat steps.js)"): lists, per animated diagram on the page, what each step reveals.
// Nodes by label, edges as [FROM_TO], edge labels in quotes. Relies on svg.paSteps, set by pele-animate animate().
(() => [...document.querySelectorAll('.pa-scene')].map((sc, i) => {
  const svg = sc.querySelector('svg.pele');
  if (!svg?.paSteps) return `#${i + 1} (no steps)`;
  const kind = svg.classList.contains('pele-sequence') ? 'seq' : 'flow';
  const txt = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const lines = svg.paSteps.map((items, n) => `  ${n + 1}: ` + items.map(([el]) => {
    if (el.classList.contains('pele-edge')) return `[${el.dataset.id.replace(/^L_/, '').replace(/_\d+$/, '')}]`;
    if (el.classList.contains('pele-edge-label')) return `"${txt(el)}"`;
    if (el.classList.contains('pele-lifeline')) return '|';
    return txt(el) || el.dataset.id;
  }).filter((x) => x !== '|').join(' ; ')).join('\n');
  return `#${i + 1} ${kind}\n${lines}`;
}).join('\n'))()
