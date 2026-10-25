// Client only: Pele and pele-animate need the DOM. Loaded on demand, one Tabler category per module.
const tabler = import.meta.glob('../../../tabler/*.js');

export async function mountLive(root: HTMLElement, categories: string[]) {
	const els = root.querySelectorAll<HTMLElement>('.live');
	if (!els.length) return;
	const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
		import('pele'),
		import('pele-animate'),
		import('pele-animate/glyphs'),
		import('pele-animate/style.css'),
		...categories.map((c) => (c === 'preset' ? import('pele-animate/preset-doverunner') : tabler[`../../../tabler/${c}.js`]?.()))
	]);
	for (const [i, el] of els.entries()) {
		if (el.dataset.mounted) continue;
		el.dataset.mounted = '1';
		el.dataset.tone = String(i % 5); // site CSS varies the scene colours per diagram
		const src = el.dataset.src ?? '';
		mount(el, prepare(src), { icons, onError: (e: unknown) => console.error('pele', e) });
		if (el.dataset.mode !== 'plain') watch(el, src); // plain: Pele alone, for the comparison on the home page
	}
}

/** Client only: render each `.mermaid-live` with vanilla Mermaid.js (comparison on the home page), loaded on demand. */
export async function mountMermaid(root: HTMLElement) {
	const els = [...root.querySelectorAll<HTMLElement>('.mermaid-live')].filter((el) => !el.dataset.mounted);
	if (!els.length) return;
	const { default: mermaid } = await import('mermaid');
	const theme = document.documentElement.dataset.theme;
	const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
	mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default' });
	for (const [i, el] of els.entries()) {
		el.dataset.mounted = '1';
		try {
			el.innerHTML = (await mermaid.render(`mm-${Date.now()}-${i}`, el.dataset.src ?? '')).svg;
		} catch (e) { console.error('mermaid', e); }
	}
}

/** Svelte action: mount every `.live` diagram inside the node. */
export function live(node: HTMLElement, categories: string[]) {
	mountLive(node, categories);
	mountMermaid(node);
	return { update: (c: string[]) => mountLive(node, c) };
}
