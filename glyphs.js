// Glyph registry. No art lives here: the illustrated glyphs are in preset-doverunner.js, named `doverunner-<name>`; plain names belong to the Tabler packs. A glyph is the inner markup of a 24x24 SVG; colors come from --pa-* variables so packs can theme.
// Pass `icons` to pele's render()/mount() options: mount(el, text, { icons }).
export const S = 'var(--pa-solid,#4F378B)';
export const L = 'var(--pa-light,#d9d0f0)';
export const W = '#fff';
const reg = new Map();

// Pele draws icons with stroke-width 2 in a 24 box, which turns heavy once a node is sized up; glyphs get a thin line instead.
export function registerGlyphs(pack, strokeWidth = 1.1) {
  for (const [name, markup] of Object.entries(pack)) reg.set(name, `<g stroke-width="${strokeWidth}">${markup}</g>`);
}
// Tabler packs (tabler/*.js): outline icons drawn for any stroke width. Width comes from the CSS variable --pa-stroke, so a
// stylesheet can thicken or thin every Tabler glyph at once; `strokeWidth` is the fallback. Illustrated glyphs are all prefixed `doverunner-`, so Tabler names never collide.
export function registerTabler(pack, strokeWidth = 1.5) {
  const g = (m) => `<g fill="none" stroke="${S}" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--pa-stroke,${strokeWidth})">${m}</g>`;
  for (const [name, markup] of Object.entries(pack)) reg.set(name, g(markup));
}
// Unknown names get a neutral rounded square instead of Pele's blank icon slot (Pele ships no icons of its own).
const fallback = `<g fill="none" stroke="${S}" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:var(--pa-stroke,1.5)"><rect x="4" y="4" width="16" height="16" rx="4"/></g>`;
export const icons = (name) => reg.get(name) ?? fallback;
