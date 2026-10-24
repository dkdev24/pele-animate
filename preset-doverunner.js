// DoveRunner illustrated glyphs, all named `doverunner-<name>`: generic player/server/key/document/shield/phone/cloud, plus DRM / forensic watermarking / packaging vocabulary. Needs the registry in glyphs.js.
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
  'doverunner-player': `<defs><linearGradient id="pa-g-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b4fb5"/><stop offset="1" stop-color="#2c1f52"/></linearGradient></defs><rect x="2" y="4" width="20" height="13" rx="2" fill="url(#pa-g-screen)" stroke="${S}"/><path d="M10 7.8v5.4l4.8-2.7z" fill="${W}" stroke="none"/><path d="M9 20.5h6M12 17v3.5" stroke="${S}"/>`,
  'doverunner-server': `<rect x="3" y="3.5" width="18" height="7" rx="2" fill="${L}" stroke="${S}"/><rect x="3" y="13.5" width="18" height="7" rx="2" fill="${L}" stroke="${S}"/><circle cx="7" cy="7" r="1" fill="${S}" stroke="none"/><circle cx="7" cy="17" r="1" fill="${S}" stroke="none"/><path d="M12 7h6M12 17h6" stroke="${S}"/>`,
  'doverunner-key': `<circle cx="8" cy="12" r="4.5" fill="${L}" stroke="${S}"/><circle cx="8" cy="12" r="1.4" fill="${S}" stroke="none"/><path d="M12.5 12H21M18 12v3.5M21 12v2.5" stroke="${S}"/>`,
  'doverunner-document': `<path d="M6 2.5h8l4.5 4.5v14a1 1 0 0 1-1 1h-11.5a1 1 0 0 1-1-1v-17.5a1 1 0 0 1 1-1z" fill="${L}" stroke="${S}"/><path d="M14 2.5V7h4.5" fill="none" stroke="${S}"/><path d="M8.5 12h7M8.5 15.5h7" stroke="${S}"/>`,
  'doverunner-shield': `<path d="M12 2.5l8 3v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10v-6z" fill="${S}" stroke="none"/><path d="M8.5 12l2.6 2.6 4.6-5" fill="none" stroke="${W}" stroke-width="2.2"/>`,
  'doverunner-phone': `<rect x="6.5" y="2" width="11" height="20" rx="2.5" fill="${W}" stroke="${S}"/><path d="M10.5 3.8h3" stroke="${S}"/><rect x="8.5" y="6" width="7" height="4" rx="1" fill="${S}" stroke="none"/><path d="M8.5 12.5h7M8.5 15h7M8.5 17.5h4" stroke="${S}"/><path d="M10.5 20.2h3" stroke="${S}"/>`,
  'doverunner-cloud': `<path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.75 4.75 0 0 1 .5 9.5z" fill="${L}" stroke="${S}"/>`,
});

registerGlyphs({
  'doverunner-package': `<path d="M12 2.5l8.5 4.5v10L12 21.5 3.5 17V7z" fill="${L}" stroke="${S}"/><path d="M3.5 7L12 11.5 20.5 7M12 11.5v10" fill="none" stroke="${S}"/><path d="M8 4.8l8.5 4.5" stroke="${S}"/>`,
  'doverunner-token': `<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4z" fill="${L}" stroke="${S}"/><circle cx="9" cy="12" r="2.2" fill="${S}" stroke="none"/><path d="M13.5 10.5h4.5M13.5 13.5h3" stroke="${S}"/>`,
  'doverunner-lock': `<path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="${S}"/><rect x="5" y="10.5" width="14" height="10" rx="2" fill="${S}" stroke="none"/><circle cx="12" cy="15" r="1.5" fill="${W}" stroke="none"/><path d="M12 15.5v2.2" stroke="${W}"/>`,
  'doverunner-video': `<rect x="2" y="6" width="13" height="12" rx="2" fill="${L}" stroke="${S}"/><path d="M15 10.8l6-3.6v9.6l-6-3.6z" fill="${S}" stroke="${S}"/><circle cx="5.6" cy="9.4" r="1" fill="${S}" stroke="none"/>`,
  'doverunner-media': `<rect x="2" y="4" width="15" height="11" rx="2" fill="${L}" stroke="${S}"/><path d="M7.6 7.2v5.6l4.6-2.8z" fill="${S}" stroke="none"/><ellipse cx="14.8" cy="19" rx="2.3" ry="1.8" fill="${S}" stroke="none"/><path d="M17 19V9.5q3 .2 3.6 3.4" fill="none" stroke="${S}"/>`,
  'doverunner-storage': `<ellipse cx="12" cy="6" rx="8" ry="2.6" fill="${L}" stroke="${S}"/><path d="M4 6l2.4 13.4c.4 1.3 3 2.1 5.6 2.1s5.2-.8 5.6-2.1L20 6" fill="${L}" stroke="${S}"/><path d="M4.6 9.6c1.6 1.2 4.2 1.8 7.4 1.8s5.8-.6 7.4-1.8" fill="none" stroke="${S}"/>`,
  'doverunner-plugin': `<path d="M4 8h4.5a2.2 2.2 0 1 1 4.4 0H17v4.1a2.2 2.2 0 1 1 0 4.4V20H4z" fill="${L}" stroke="${S}"/><path d="M17 8h3v12h-3" fill="none" stroke="${S}"/>`,
  'doverunner-variants': `<rect x="2.5" y="3" width="14" height="9.5" rx="2" fill="${L}" stroke="${S}"/><rect x="7.5" y="11.5" width="14" height="9.5" rx="2" fill="${W}" stroke="${S}"/><text x="9.5" y="10.4" font-size="6.5" font-weight="700" text-anchor="middle" fill="${S}" stroke="none">A</text><text x="14.5" y="19" font-size="6.5" font-weight="700" text-anchor="middle" fill="${S}" stroke="none">B</text>`,
  'doverunner-watermark': `<rect x="2.5" y="4" width="19" height="16" rx="2" fill="${L}" stroke="${S}"/><path d="M12 7.4c2.9 3.3 4.2 5 4.2 7a4.2 4.2 0 0 1-8.4 0c0-2 1.3-3.7 4.2-7z" fill="${S}" stroke="none"/><path d="M10.2 14.6a1.9 1.9 0 0 0 1.4 1.9" fill="none" stroke="${W}"/>`,
  'doverunner-encoder': `<rect x="1.5" y="4" width="9" height="16" rx="1.5" fill="${L}" stroke="${S}"/><rect x="4.3" y="7" width="3.4" height="10" rx=".6" fill="${W}" stroke="${S}"/><path d="M2.9 6.5h.9M2.9 10.5h.9M2.9 14.5h.9M8.2 6.5h.9M8.2 10.5h.9M8.2 14.5h.9" stroke="${S}"/><path d="M12 12h3.5M14 10l2 2-2 2" fill="none" stroke="${S}"/><rect x="17.6" y="6.2" width="2.4" height="2.8" rx=".5" fill="${S}" stroke="${S}"/><rect x="20.4" y="6.2" width="2.4" height="2.8" rx=".5" fill="${W}" stroke="${S}"/><rect x="17.6" y="10.6" width="2.4" height="2.8" rx=".5" fill="${W}" stroke="${S}"/><rect x="20.4" y="10.6" width="2.4" height="2.8" rx=".5" fill="${S}" stroke="${S}"/><rect x="17.6" y="15" width="2.4" height="2.8" rx=".5" fill="${S}" stroke="${S}"/><rect x="20.4" y="15" width="2.4" height="2.8" rx=".5" fill="${S}" stroke="${S}"/>`,
  'doverunner-database': `<path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" fill="${L}" stroke="${S}"/><ellipse cx="12" cy="6" rx="8" ry="3" fill="${L}" stroke="${S}"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="${S}"/>`,
});
// Thinner line: the chips are small even at full box size.
registerGlyphs({ 'doverunner-bits-a': chips('011010'), 'doverunner-bits-b': chips('101101') }, 0.5);
