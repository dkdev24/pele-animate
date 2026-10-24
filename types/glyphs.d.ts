/** Theme colors the illustrated glyphs use: CSS variables with fallbacks. */
export const S: string;
export const L: string;
export const W: string;

/** Register glyphs: `{ name: '<inner markup of a 24x24 svg>' }`. Default stroke width 1.1. */
export function registerGlyphs(pack: Record<string, string>, strokeWidth?: number): void;

/** Register Tabler-style outline icons; stroke width follows the `--pa-stroke` CSS variable (fallback `strokeWidth`, default 1.5). */
export function registerTabler(pack: Record<string, string>, strokeWidth?: number): void;

/** Pele `icons` resolver. Unknown names return a neutral rounded square. */
export function icons(name: string): string;
