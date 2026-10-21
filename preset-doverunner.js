// DoveRunner vocabulary (DRM / forensic watermarking / packaging). Add on top of the generic pack in glyphs.js.
import { registerGlyphs, S, L, W } from './glyphs.js';

// A row of six video-segment chips; bit 1 = filled, bit 0 = outline.
const chips = (bits) =>
  [...bits]
    .map((b, i) => {
      const x = 1.1 + i * 3.8;
      const on = b === '1';
      return `<rect x="${x}" y="8" width="2.8" height="8" rx=".6" fill="${on ? S : W}" stroke="${S}"/><text x="${x + 1.4}" y="13.5" font-size="3.4" text-anchor="middle" fill="${on ? W : S}" stroke="none" font-family="monospace">${b}</text>`;
    })
    .join('');

registerGlyphs({
  package: `<path d="M12 2.5l8.5 4.5v10L12 21.5 3.5 17V7z" fill="${L}" stroke="${S}"/><path d="M3.5 7L12 11.5 20.5 7M12 11.5v10" fill="none" stroke="${S}"/><path d="M8 4.8l8.5 4.5" stroke="${S}"/>`,
  token: `<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4z" fill="${L}" stroke="${S}"/><circle cx="9" cy="12" r="2.2" fill="${S}" stroke="none"/><path d="M13.5 10.5h4.5M13.5 13.5h3" stroke="${S}"/>`,
  lock: `<path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="${S}"/><rect x="5" y="10.5" width="14" height="10" rx="2" fill="${S}" stroke="none"/><circle cx="12" cy="15" r="1.5" fill="${W}" stroke="none"/><path d="M12 15.5v2.2" stroke="${W}"/>`,
  database: `<path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" fill="${L}" stroke="${S}"/><ellipse cx="12" cy="6" rx="8" ry="3" fill="${L}" stroke="${S}"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="${S}"/>`,
});
// Thinner line: the chips are small even at full box size.
registerGlyphs({ 'bits-a': chips('011010'), 'bits-b': chips('101101') }, 0.5);
