<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { encodeSource, decodeSource } from '#lib/share';

	let { data } = $props();
	const packs = import.meta.glob('../../../../tabler/*.js');
	const DEFAULT = data.examples.find((e) => e.label.startsWith('Icons'))?.src ?? data.examples[0]?.src ?? 'flowchart LR\n  A --> B';

	let src = $state(DEFAULT);
	let stroke = $state(1.5);
	let solid = $state('#4f378b');
	let light = $state('#e4dcf6');
	let customColors = $state(false);
	let controls = $state(true);
	let width = $state(100);
	let tab = $state<'edit' | 'preview'>('edit');
	let error = $state('');
	let unknown = $state<string[]>([]);
	let notice = $state('');
	let host: HTMLDivElement;
	let index: Map<string, string> | null = null;
	let ready = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	onMount(async () => {
		const fromHash = decodeSource(location.search);
		if (fromHash) src = fromHash;
		const res = await fetch('/icons.json').then((r) => r.json());
		index = new Map(res.icons.map((i: { name: string; category: string }) => [i.name, i.category]));
		ready = true;
	});

	// Re-render 250 ms after the last keystroke or control change.
	$effect(() => {
		src; controls; ready;
		if (!ready) return;
		clearTimeout(timer);
		timer = setTimeout(render, 250);
		return () => clearTimeout(timer);
	});

	async function render() {
		error = '';
		const names = [...src.matchAll(/icon:\s*"([^"]+)"/g)].map((m) => m[1]);
		unknown = [...new Set(names.filter((n) => !index!.has(n)))];
		const cats = new Set(names.map((n) => index!.get(n)).filter(Boolean) as string[]);
		const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
			import('pele'),
			import('pele-animate'),
			import('pele-animate/glyphs'),
			import('pele-animate/style.css'),
			...[...cats].map((c) => (c === 'doverunner' ? import('pele-animate/preset-doverunner') : packs[`../../../../tabler/${c}.js`]?.()))
		]);
		const el = document.createElement('div'); // a fresh node per render: Pele and watch() keep state on the container
		host.replaceChildren(el);
		mount(el, prepare(src), { icons, onError: (e: unknown) => (error = e instanceof Error ? e.message : String(e)) });
		watch(el, src, { controls });
	}

	function share() {
		history.replaceState(null, '', `?s=${encodeSource(src)}`);
		copy(location.href, 'Link copied');
	}
	const snippet = () => `import { mount } from 'pele';
import { watch, prepare } from 'pele-animate';
import { icons } from 'pele-animate/glyphs';
import 'pele-animate/style.css';
// plus one import per icon category, e.g. import 'pele-animate/tabler/devices';

const src = ${JSON.stringify(src)};
mount(el, prepare(src), { icons });
watch(el, src);
`;
	async function copy(text: string, msg: string) {
		try { await navigator.clipboard.writeText(text); notice = msg; } catch { notice = 'Copy failed'; }
		setTimeout(() => (notice = ''), 1800);
	}
	async function pickExample(e: Event) {
		const i = +(e.target as HTMLSelectElement).value;
		if (i >= 0) src = data.examples[i].src;
		(e.target as HTMLSelectElement).value = '-1';
		await tick();
	}
</script>

<svelte:head>
	<title>Playground · pele-animate</title>
	<meta name="description" content="Edit Mermaid code with icons and step order and watch it animate, then share a link." />
</svelte:head>

<div class="wrap">
	<h1>Playground</h1>
	<div class="tabs" role="tablist">
		<button role="tab" aria-selected={tab === 'edit'} onclick={() => (tab = 'edit')}>Editor</button>
		<button role="tab" aria-selected={tab === 'preview'} onclick={() => (tab = 'preview')}>Preview</button>
	</div>

	<section class="top" class:hide={tab !== 'edit'}>
		<div class="ed">
			<label for="src">Mermaid source</label>
			<textarea id="src" bind:value={src} spellcheck="false" rows="14" autocapitalize="off" autocomplete="off"></textarea>
			{#if unknown.length}<p class="warn">Unknown icon: {unknown.join(', ')}. Find names on <a href="/icons/">/icons</a>.</p>{/if}
			{#if error}<p class="err" role="alert">{error}</p>{/if}
		</div>
		<div class="ctl">
			<select onchange={pickExample} aria-label="Load an example" value="-1">
				<option value="-1">Load an example…</option>
				{#each data.examples as e, i}<option value={i}>{e.label}</option>{/each}
			</select>
			<label>Stroke <input type="range" min="0.5" max="2.5" step="0.1" bind:value={stroke} /> <output>{stroke.toFixed(1)}</output></label>
			<label>Preview width <input type="range" min="30" max="100" step="5" bind:value={width} /> <output>{width}%</output></label>
			<label class="row"><input type="checkbox" bind:checked={customColors} /> Custom colors</label>
			{#if customColors}
				<label class="row">Solid <input type="color" bind:value={solid} /></label>
				<label class="row">Light <input type="color" bind:value={light} /></label>
			{/if}
			<label class="row"><input type="checkbox" bind:checked={controls} /> Step controls (click to step)</label>
			<div class="btns">
				<button type="button" onclick={share}>Copy share link</button>
				<button type="button" onclick={() => copy(src, 'Mermaid copied')}>Copy Mermaid</button>
				<button type="button" onclick={() => copy(snippet(), 'Code copied')}>Copy code snippet</button>
			</div>
			<p class="note" aria-live="polite">{notice}</p>
		</div>
	</section>

	<section class="pv" class:hide={tab !== 'preview'} aria-label="Preview">
		<div
			class="frame"
			bind:this={host}
			style="width:{width}%; --pa-stroke:{stroke}; {customColors ? `--pa-solid:${solid}; --pa-light:${light};` : ''}"
		></div>
		<p class="note">Light and dark follow the site theme (button in the header).</p>
	</section>
</div>

<style>
	.wrap { padding-top: 2rem; }
	button, select { font: 0.9rem var(--font); color: var(--fg); background: var(--bg); border: 1px solid var(--line); border-radius: 8px; padding: 0.35rem 0.8rem; cursor: pointer; }
	.tabs { display: none; gap: 0.4rem; margin: 0.75rem 0; }
	.tabs button[aria-selected='true'] { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
	.top { display: grid; grid-template-columns: minmax(0, 3fr) minmax(16rem, 2fr); gap: 1.25rem; margin: 1rem 0; }
	.ed label { font-size: 0.85rem; color: var(--fg-muted); }
	textarea { width: 100%; font: 0.85rem/1.55 var(--mono); color: var(--fg); background: var(--bg-soft); border: 1px solid var(--line); border-radius: 8px; padding: 0.75rem 1rem; resize: vertical; tab-size: 2; }
	.ctl { display: flex; flex-direction: column; gap: 0.7rem; font-size: 0.9rem; color: var(--fg-muted); }
	.ctl label { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
	.ctl output { font: 0.85rem var(--mono); }
	.btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.note { min-height: 1.4em; font-size: 0.85rem; color: var(--fg-muted); margin: 0; }
	.warn { color: var(--fg-muted); font-size: 0.88rem; }
	.err { color: #c0392b; font: 0.85rem var(--mono); white-space: pre-wrap; }
	.pv { margin: 1rem 0 2rem; }
	.frame { max-width: 100%; min-height: 8rem; margin: 0 auto; }
	@media (max-width: 56rem) {
		.top { grid-template-columns: 1fr; }
		.tabs { display: flex; }
		.hide { display: none; }
	}
</style>
