// Playground share links: `?s=<encoded source>`.
export const encodeSource = encodeURIComponent;
export const decodeSource = (search: string) => new URLSearchParams(search).get('s');
