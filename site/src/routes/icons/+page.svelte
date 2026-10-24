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
	button { font-family: var(--font); color: var(--color-ink); background: var(--color-sheet); border: 0; border-radius: var(--radius-pill); cursor: pointer; box-shadow: 0 0 0 1px var(--shade-1), inset 0 1px 0 var(--hi); transition: transform var(--dur-micro) var(--ease-out); }
	button:active { transform: translateY(1px); }
	.wrap { padding-top: var(--space-xl); }
	h1 { font-size: clamp(2.25rem, 2vw + 1.5rem, 3.25rem); max-width: none; }
	.lead { max-width: 72ch; color: var(--color-ink-2); font-size: var(--text-md); margin-top: var(--space-sm); }
	.controls { display: flex; flex-wrap: wrap; gap: var(--space-md); align-items: center; margin: var(--space-lg) 0 var(--space-sm); }
	input[type='search'] { flex: 1 1 18rem; height: 52px; padding: 0 1.25rem; font: inherit; color: var(--color-ink); background: var(--color-sheet); border: 1px solid var(--color-muted); border-radius: var(--radius-pill); }
	.stroke { display: flex; gap: 0.5rem; align-items: center; color: var(--color-muted); font-size: 0.9rem; }
	.stroke output { font: 0.85rem var(--font-code); width: 2ch; }
	.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: var(--space-md); }
	.chips button { padding: 0.35rem 0.85rem; font: 500 0.88rem var(--font); }
	.chips button[aria-pressed='true'] { background: var(--color-accent-soft); box-shadow: 0 0 0 1px var(--color-accent); color: var(--color-ink); }
	.detail { display: flex; gap: var(--space-md); align-items: flex-start; padding: var(--space-md); background: var(--color-sheet); border-radius: var(--radius-card); box-shadow: var(--shadow-card); margin-bottom: var(--space-md); }
	.detail svg { flex: none; color: var(--color-accent); --pa-solid: var(--color-accent); }
	.detail div { min-width: 0; }
	.detail pre { margin: 0.4rem 0; }
	.muted, .count { color: var(--color-muted); font-size: 0.9rem; }
	.copy, .more { padding: 0.4rem 1rem; font: 500 0.88rem var(--font); margin-right: 0.4rem; min-height: 36px; }
	.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr)); gap: var(--space-xs); }
	.grid button { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 0.8rem 0.6rem; font: 0.72rem var(--font-code); background: var(--color-sheet); border-radius: var(--radius-inner); box-shadow: 0 0 0 1px var(--color-rule); }
	.grid button:hover { box-shadow: 0 0 0 1px var(--color-accent); }
	.grid button[aria-pressed='true'] { background: var(--color-accent-soft); box-shadow: 0 0 0 1px var(--color-accent); }
	.grid svg { --pa-solid: var(--color-ink); }
	.grid span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-muted); }
</style>
