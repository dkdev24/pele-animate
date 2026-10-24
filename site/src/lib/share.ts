// Playground share links: `?s=<base64url(utf8 source)>`. Plain (no compression): the diagrams are a few hundred bytes.
export const encodeSource = (src: string) =>
	btoa(String.fromCharCode(...new TextEncoder().encode(src))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function decodeSource(search: string): string | null {
	const m = /^\??s=([\w-]+)$/.exec(search);
	if (!m) return null;
	try {
		const bin = atob(m[1].replace(/-/g, '+').replace(/_/g, '/'));
		return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
	} catch {
		return null;
	}
}
