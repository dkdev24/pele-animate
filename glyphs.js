// Glyph registry. A glyph is the inner markup of a 24x24 SVG; colors come from --pa-* variables so packs can theme.
// Pass `icons` to pele's render()/mount() options: mount(el, text, { icons }).
const S = 'var(--pa-solid,#4F378B)';
const L = 'var(--pa-light,#d9d0f0)';
const W = '#fff';
const reg = new Map();

export function registerGlyphs(pack) {
  for (const [name, markup] of Object.entries(pack)) reg.set(name, markup);
}
// Returning null makes pele fall back to its default node.
export const icons = (name) => reg.get(name) ?? null;

registerGlyphs({
  player: `<rect x="2" y="4" width="20" height="14" rx="2.5" fill="${S}" stroke="none"/><path d="M10 8.5v5l4.5-2.5z" fill="${W}" stroke="none"/><path d="M8 21h8" stroke="${S}"/>`,
  server: `<rect x="3" y="3.5" width="18" height="7" rx="2" fill="${L}" stroke="${S}"/><rect x="3" y="13.5" width="18" height="7" rx="2" fill="${L}" stroke="${S}"/><circle cx="7" cy="7" r="1" fill="${S}" stroke="none"/><circle cx="7" cy="17" r="1" fill="${S}" stroke="none"/><path d="M12 7h6M12 17h6" stroke="${S}"/>`,
  key: `<circle cx="8" cy="12" r="4.5" fill="${L}" stroke="${S}"/><circle cx="8" cy="12" r="1.4" fill="${S}" stroke="none"/><path d="M12.5 12H21M18 12v3.5M21 12v2.5" stroke="${S}"/>`,
  document: `<path d="M6 2.5h8l4.5 4.5v14a1 1 0 0 1-1 1h-11.5a1 1 0 0 1-1-1v-17.5a1 1 0 0 1 1-1z" fill="${L}" stroke="${S}"/><path d="M14 2.5V7h4.5" fill="none" stroke="${S}"/><path d="M8.5 12h7M8.5 15.5h7" stroke="${S}"/>`,
  shield: `<path d="M12 2.5l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10v-6z" fill="${S}" stroke="none"/><path d="M8.5 12l2.6 2.6 4.6-5" fill="none" stroke="${W}" stroke-width="2.2"/>`,
  phone: `<rect x="6.5" y="2" width="11" height="20" rx="2.5" fill="${L}" stroke="${S}"/><rect x="9" y="5.5" width="6" height="3.5" rx="1" fill="${S}" stroke="none"/><path d="M9.5 12.5h5M9.5 15h5" stroke="${S}"/>`,
});
