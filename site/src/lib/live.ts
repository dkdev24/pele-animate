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
		watch(el, src);
	}
}

/** Svelte action: mount every `.live` diagram inside the node. */
export function live(node: HTMLElement, categories: string[]) {
	mountLive(node, categories);
	return { update: (c: string[]) => mountLive(node, c) };
}
