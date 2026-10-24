<script lang="ts">
	import { onMount } from 'svelte';

	type Icon = { name: string; category: string; tags: string[] };
	// Icon markup loads per category, only for the cells on screen; the 4,400-name index is plain JSON.
	const packs = import.meta.glob('../../../../tabler/*.js');
	const LIMIT = 240;

	let all = $state<Icon[]>([]);
	let version = $state('');
	let q = $state('');
	let cat = $state('');
	let stroke = $state(1.5);
	let limit = $state(LIMIT);
	let selected = $state<Icon | null>(null);
	let copied = $state('');
	let ready = $state(0); // bumps when a category finishes loading
	let resolve = $state<(n: string) => string>(() => '');
	const loaded = new Set<string>();

	const cats = $derived([...new Set(all.map((i) => i.category))].sort((a, b) => Number(a === 'doverunner') - Number(b === 'doverunner') || a.localeCompare(b)));
	const results = $derived.by(() => {
		const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
		const hits = all.filter((i) => (!cat || i.category === cat) && terms.every((t) => i.name.includes(t) || i.tags.some((g) => g.includes(t))));
		// name matches first (exact, prefix, substring), then tag-only matches, each group in name order
		const rank = (i: Icon) => (terms.length ? Math.min(...terms.map((t) => (i.name === t ? 0 : i.name.startsWith(t) ? 1 : i.name.includes(t) ? 2 : i.tags.includes(t) ? 3 : 4))) : 0);
		return hits.map((i) => [rank(i), i] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
	});
	const shown = $derived(results.slice(0, limit));

	onMount(async () => {
		const [res, { icons }] = await Promise.all([fetch('/icons.json').then((r) => r.json()), import('pele-animate/glyphs')]);
		version = res.version;
		all = res.icons;
		resolve = icons;
	});

	async function load(c: string) {
		if (loaded.has(c)) return;
		loaded.add(c);
		await (c === 'doverunner' ? import('pele-animate/preset-doverunner') : packs[`../../../../tabler/${c}.js`]?.());
		ready++;
	}
	$effect(() => {
		for (const c of new Set(shown.map((i) => i.category))) load(c);
	});
	$effect(() => {
		q; cat;
		limit = LIMIT;
	});

	const svg = (name: string) => (ready >= 0 && resolve ? resolve(name) : '');
	const snippet = (i: Icon) => `A@{ icon: "${i.name}", form: "square", h: 88 }`;
	const importLine = (c: string) => `import 'pele-animate/${c === 'doverunner' ? 'preset-doverunner' : `tabler/${c}`}';`;

	async function copy(text: string) {
		try { await navigator.clipboard.writeText(text); copied = text; } catch { copied = ''; }
		setTimeout(() => (copied = copied === text ? '' : copied), 1500);
	}
	function pick(i: Icon) {
		selected = i;
		copy(snippet(i));
	}
</script>

<svelte:head>
	<title>Icons · pele-animate</title>
	<meta name="description" content={'Search the 4,000+ Tabler icons and the doverunner pack bundled with pele-animate, then copy a ready @{ icon } snippet.'} />
</svelte:head>

<div class="wrap">
	<h1>Icons</h1>
	<p class="lead">
		{all.length ? all.length.toLocaleString('en') : '4,400'} icons from <a href="https://github.com/tabler/tabler-icons">Tabler Icons</a>{version ? ` ${version}` : ''} (MIT)
		plus the optional <code>doverunner-*</code> pack. Click an icon to copy its snippet. The same list as JSON, for agents: <a href="/icons.json">/icons.json</a>.
	</p>

	<div class="controls">
		<input type="search" bind:value={q} placeholder="Search names and tags: lock, load-balancer, database" aria-label="Search icons" />
		<label class="stroke">
			Stroke <input type="range" min="0.5" max="2.5" step="0.1" bind:value={stroke} aria-label="Stroke width" />
			<output>{stroke.toFixed(1)}</output>
		</label>
	</div>

	<div class="chips" role="group" aria-label="Category">
		<button type="button" aria-pressed={cat === ''} onclick={() => (cat = '')}>all</button>
		{#each cats as c}
			<button type="button" aria-pressed={cat === c} onclick={() => (cat = cat === c ? '' : c)}>{c}</button>
		{/each}
	</div>

	{#if selected}
		<section class="detail" aria-live="polite">
			<svg viewBox="0 0 24 24" width="56" height="56" style="--pa-stroke:{stroke}" aria-hidden="true">{@html svg(selected.name)}</svg>
			<div>
				<strong>{selected.name}</strong> <span class="muted">{selected.category}</span>
				<pre><code>{snippet(selected)}</code></pre>
				<pre><code>{importLine(selected.category)}</code></pre>
				<button type="button" class="copy" onclick={() => copy(snippet(selected!))}>{copied === snippet(selected) ? 'Copied' : 'Copy snippet'}</button>
				<button type="button" class="copy" onclick={() => copy(importLine(selected!.category))}>{copied === importLine(selected.category) ? 'Copied' : 'Copy import'}</button>
			</div>
		</section>
	{/if}

	<p class="count" aria-live="polite">{all.length ? `${results.length.toLocaleString('en')} icons` : 'Loading…'}</p>
	<ul class="grid" style="--pa-stroke:{stroke}">
		{#each shown as i (i.name)}
			<li>
				<button type="button" onclick={() => pick(i)} aria-pressed={selected?.name === i.name} title={i.tags.slice(0, 6).join(', ')}>
					<svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">{@html svg(i.name)}</svg>
					<span>{i.name}</span>
				</button>
			</li>
		{/each}
	</ul>
	{#if results.length > limit}
		<p><button type="button" class="more" onclick={() => (limit += LIMIT)}>Show {Math.min(LIMIT, results.length - limit)} more</button></p>
	{/if}
	{#if all.length && !results.length}<p class="muted">No icon matches. Try a shorter word or clear the category.</p>{/if}
</div>

<style>
	button { font-family: var(--font); color: var(--fg); background: var(--bg); border: 1px solid var(--line); border-radius: 8px; cursor: pointer; }
	.wrap { padding-top: 2rem; }
	.lead { max-width: 72ch; color: var(--fg-muted); }
	.controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin: 1.25rem 0 0.75rem; }
	input[type='search'] { flex: 1 1 18rem; height: 2.5rem; padding: 0 0.85rem; font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--line); border-radius: 8px; }
	.stroke { display: flex; gap: 0.5rem; align-items: center; color: var(--fg-muted); font-size: 0.9rem; }
	.stroke output { font: 0.85rem var(--mono); width: 2ch; }
	.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
	.chips button {  padding: 0.2rem 0.65rem; font: 0.85rem var(--font); border-radius: 999px; }
	.chips button[aria-pressed='true'] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
	.detail { display: flex; gap: 1rem; align-items: flex-start; padding: 1rem; background: var(--bg-soft); border: 1px solid var(--line); border-radius: 10px; margin-bottom: 1rem; }
	.detail svg { flex: none; color: var(--accent); --pa-solid: var(--accent); }
	.detail div { min-width: 0; }
	.detail pre { margin: 0.4rem 0; }
	.muted, .count { color: var(--fg-muted); font-size: 0.9rem; }
	.copy, .more { padding: 0.3rem 0.8rem; font: 0.88rem var(--font); margin-right: 0.4rem; }
	.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr)); gap: 0.5rem; }
	.grid button { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.7rem 0.3rem; font: 0.72rem var(--mono); background: var(--bg); }
	.grid button:hover { border-color: var(--accent); }
	.grid button[aria-pressed='true'] { background: var(--accent-soft); border-color: var(--accent); }
	.grid svg { --pa-solid: var(--fg); }
	.grid span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--fg-muted); }
</style>
