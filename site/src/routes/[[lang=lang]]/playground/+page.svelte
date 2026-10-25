<script lang="ts">
	import { page } from '$app/state';
	import { langOf, prefix } from '#lib/i18n';
	const ko = $derived(langOf(page.url.pathname) === 'ko');
	const px = $derived(prefix(ko ? 'ko' : 'en'));
	import { onMount, tick } from 'svelte';
	import { encodeSource, decodeSource } from '#lib/share';

	let { data } = $props();
	const packs = import.meta.glob('../../../../../tabler/*.js');
	const DEFAULT = () => data.defaultSrc ?? 'flowchart LR\n  A --> B';

	let src = $state(DEFAULT());
	let stroke = $state(1.5);
	// Colour overrides, set on the scene as CSS variables. An empty value means "the theme's own"; the pickers show the current value.
	const COLORS = [
		{ key: 'solid', label: 'Lines and icons', ko: '선과 아이콘', vars: ['--pa-solid'] },
		{ key: 'light', label: 'Group fill', ko: '그룹 배경', vars: ['--pa-light'] },
		{ key: 'node', label: 'Node fill', ko: '노드 배경', vars: ['--pele-surface'] },
		{ key: 'bg', label: 'Background', ko: '배경', vars: ['--pa-bg'] },
		{ key: 'text', label: 'Text', ko: '글자', vars: ['--pele-fg'] }
	] as const;
	let colors = $state<Record<string, string>>({});
	let shown = $state<Record<string, string>>({}); // what each picker displays: the override, else the theme's value
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
		src; ready;
		if (!ready) return;
		clearTimeout(timer);
		timer = setTimeout(render, 250);
		return () => clearTimeout(timer);
	});

	async function render() {
		error = '';
		const names = [...src.matchAll(/icon:\s*"([^"]+)"|^\s*(?:service|group)\s+[\w-]+\(([\w-]+)\)/gm)].map((m) => m[1] ?? m[2]);
		unknown = [...new Set(names.filter((n) => !index!.has(n)))];
		const cats = new Set(names.map((n) => index!.get(n)).filter(Boolean) as string[]);
		const [{ mount }, { watch, prepare }, { icons }] = await Promise.all([
			import('pele'),
			import('pele-animate'),
			import('pele-animate/glyphs'),
			import('pele-animate/style.css'),
			...[...cats].map((c) => (c === 'doverunner' ? import('pele-animate/preset-doverunner') : packs[`../../../../../tabler/${c}.js`]?.()))
		]);
		const el = document.createElement('div'); // a fresh node per render: Pele and watch() keep state on the container
		host.replaceChildren(el);
		mount(el, prepare(src), { icons, onError: (e: unknown) => (error = e instanceof Error ? e.message : String(e)) });
		watch(el, src);
		applyColors();
	}

	// The scene (.pa-scene) sets these variables itself, so overrides must sit on it, not on the frame around it.
	function applyColors() {
		const scene = host?.firstElementChild as HTMLElement | null;
		if (!scene) return;
		const next: Record<string, string> = {};
		for (const c of COLORS) {
			for (const v of c.vars) colors[c.key] ? scene.style.setProperty(v, colors[c.key]) : scene.style.removeProperty(v);
			next[c.key] = colors[c.key] || toHex(getComputedStyle(scene).getPropertyValue(c.vars[0]).trim());
		}
		shown = next;
	}
	// <input type=color> needs #rrggbb; the theme variables are hex already, anything else falls back to black.
	const toHex = (v: string) => (/^#[0-9a-f]{6}$/i.test(v) ? v : /^#[0-9a-f]{3}$/i.test(v) ? '#' + [...v.slice(1)].map((c) => c + c).join('') : '#000000');
	$effect(() => {
		JSON.stringify(colors);
		applyColors();
	});

	function share() {
		history.replaceState(null, '', `?s=${encodeSource(src)}`);
		copy(location.href, ko ? '링크를 복사했습니다' : 'Link copied');
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
		try { await navigator.clipboard.writeText(text); notice = msg; } catch { notice = ko ? '복사하지 못했습니다' : 'Copy failed'; }
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
	<title>{ko ? '플레이그라운드' : 'Playground'} · pele-animate</title>
	<meta name="description" content={ko ? '아이콘과 단계 순서를 넣은 Mermaid 코드를 수정하며 애니메이션을 바로 확인하고, 링크로 공유합니다.' : 'Edit Mermaid code with icons and step order and watch it animate, then share a link.'} />
</svelte:head>

<div class="wrap">
	<h1>{ko ? '플레이그라운드' : 'Playground'}</h1>
	<div class="tabs" role="tablist">
		<button role="tab" aria-selected={tab === 'edit'} onclick={() => (tab = 'edit')}>{ko ? '편집' : 'Editor'}</button>
		<button role="tab" aria-selected={tab === 'preview'} onclick={() => (tab = 'preview')}>{ko ? '미리보기' : 'Preview'}</button>
	</div>

	<section class="top" class:hide={tab !== 'edit'}>
		<div class="ed">
			<label for="src">{ko ? 'Mermaid 소스' : 'Mermaid source'}</label>
			<textarea id="src" bind:value={src} spellcheck="false" rows="14" autocapitalize="off" autocomplete="off"></textarea>
			{#if unknown.length}<p class="warn">{#if ko}알 수 없는 아이콘: {unknown.join(', ')}. 이름은 <a href="{px}/icons/">아이콘</a> 페이지에서 찾을 수 있습니다.{:else}Unknown icon: {unknown.join(', ')}. Find names on <a href="{px}/icons/">/icons</a>.{/if}</p>{/if}
			{#if error}<p class="err" role="alert">{error}</p>{/if}
		</div>
		<div class="ctl">
			<select onchange={pickExample} aria-label={ko ? '예제 불러오기' : 'Load an example'} value="-1">
				<option value="-1">{ko ? '예제 불러오기…' : 'Load an example…'}</option>
				{#each [...new Set(data.examples.map((e) => e.group))] as g}
					<optgroup label={g}>
						{#each data.examples as e, i}{#if e.group === g}<option value={i}>{e.label}</option>{/if}{/each}
					</optgroup>
				{/each}
			</select>
			<label>{ko ? '선 두께' : 'Stroke'} <input type="range" min="0.5" max="2.5" step="0.1" bind:value={stroke} /> <output>{stroke.toFixed(1)}</output></label>
			<label>{ko ? '미리보기 너비' : 'Preview width'} <input type="range" min="30" max="100" step="5" bind:value={width} /> <output>{width}%</output></label>
			<details class="colors">
				<summary>{ko ? '색상' : 'Colors'}</summary>
				{#each COLORS as c}
					<label class="row"><input type="color" value={shown[c.key] ?? '#000000'} oninput={(e) => (colors[c.key] = e.currentTarget.value)} /> {ko ? c.ko : c.label}</label>
				{/each}
				<button type="button" onclick={() => (colors = {})} disabled={!Object.values(colors).some(Boolean)}>{ko ? '색상 초기화' : 'Reset colors'}</button>
			</details>
			<div class="btns">
				<button type="button" onclick={share}>{ko ? '공유 링크 복사' : 'Copy share link'}</button>
				<button type="button" onclick={() => copy(src, ko ? 'Mermaid를 복사했습니다' : 'Mermaid copied')}>{ko ? 'Mermaid 복사' : 'Copy Mermaid'}</button>
				<button type="button" onclick={() => copy(snippet(), ko ? '코드를 복사했습니다' : 'Code copied')}>{ko ? '코드 복사' : 'Copy code snippet'}</button>
			</div>
			<p class="note" aria-live="polite">{notice}</p>
		</div>
	</section>

	<section class="pv" class:hide={tab !== 'preview'} aria-label={ko ? '미리보기' : 'Preview'}>
		<div
			class="frame"
			bind:this={host}
			style="width:{width}%; --pa-stroke:{stroke};"
		></div>
		<p class="note">{ko ? '라이트와 다크 모드는 사이트 테마(헤더의 버튼)를 따릅니다.' : 'Light and dark follow the site theme (button in the header).'}</p>
	</section>
</div>

<style>
	.wrap { padding-top: var(--space-xl); }
	h1 { font-size: clamp(2.25rem, 2vw + 1.5rem, 3.25rem); max-width: none; }
	button, select { font: 500 0.92rem var(--font); color: var(--color-ink); background: var(--color-sheet); border: 0; border-radius: var(--radius-pill); padding: 0.55rem 1.1rem; min-height: 44px; cursor: pointer; box-shadow: 0 0 0 1px var(--shade-1), inset 0 1px 0 var(--hi); transition: transform var(--dur-micro) var(--ease-out); }
	button:active { transform: translateY(1px); }
	select { appearance: none; -webkit-appearance: none; width: 100%; padding-right: 2.6rem; box-shadow: 0 0 0 1px var(--color-muted); text-overflow: ellipsis;
		background-image: linear-gradient(45deg, transparent 50%, var(--color-ink) 50%), linear-gradient(135deg, var(--color-ink) 50%, transparent 50%);
		background-position: calc(100% - 1.35rem) 50%, calc(100% - 1.0rem) 50%; background-size: 0.35rem 0.35rem; background-repeat: no-repeat; }
	select:hover { box-shadow: 0 0 0 1px var(--color-ink); }
	select option, select optgroup { background: var(--color-sheet); color: var(--color-ink); font: 400 0.95rem var(--font); }
	select optgroup { font-weight: 600; font-style: normal; color: var(--color-muted); }
	.tabs { display: none; gap: 0.4rem; margin: 0.75rem 0; }
	.tabs button[aria-selected='true'] { background: var(--color-accent-soft); box-shadow: 0 0 0 1px var(--color-accent); }
	.top { display: grid; grid-template-columns: minmax(0, 3fr) minmax(16rem, 2fr); gap: var(--space-lg); margin: var(--space-md) 0; }
	.ed label { font-size: var(--text-sm); color: var(--color-muted); }
	textarea { width: 100%; font: 0.85rem/1.6 var(--font-code); color: var(--color-ink); background: var(--color-sheet); border: 1px solid var(--color-muted); border-radius: var(--radius-inner); padding: 0.9rem 1.1rem; resize: vertical; tab-size: 2; }
	.ctl { display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: var(--color-ink-2); }
	.ctl label { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
	.ctl output { font: 0.85rem var(--font-code); }
	.colors { border-radius: var(--radius-inner); background: var(--color-paper-2); box-shadow: inset 0 0 0 1px var(--color-rule); }
	.colors summary { cursor: pointer; font-weight: 500; padding: 0.75rem 1rem; min-height: 44px; list-style: none; display: flex; align-items: center; justify-content: space-between; color: var(--color-ink); }
	.colors summary::-webkit-details-marker { display: none; }
	.colors summary::after { content: ''; width: 0.45rem; height: 0.45rem; border-right: 2px solid var(--color-muted); border-bottom: 2px solid var(--color-muted); transform: rotate(45deg); transition: transform var(--dur-short) var(--ease-out); }
	.colors[open] summary::after { transform: rotate(-135deg); }
	.colors[open] { display: flex; flex-direction: column; gap: 0.6rem; align-items: flex-start; padding-bottom: 1rem; }
	.colors[open] > :not(summary) { margin-inline: 1rem; }
	.colors[open] summary { align-self: stretch; }
	.colors input[type='color'] { width: 2.4rem; height: 1.9rem; padding: 0; border: 1px solid var(--color-muted); border-radius: 8px; background: none; cursor: pointer; }
	.colors button:disabled { opacity: 0.45; cursor: default; }
	.btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.note { min-height: 1.4em; font-size: var(--text-sm); color: var(--color-muted); margin: 0; }
	.warn { color: var(--color-muted); font-size: 0.9rem; }
	.err { color: var(--color-error); font: 0.85rem var(--font-code); white-space: pre-wrap; }
	.pv { margin: var(--space-lg) 0 var(--space-xl); }
	.frame { max-width: 100%; min-height: 8rem; margin: 0 auto; }
	/* the playground scene is not a .live one: map it onto the site tokens too */
	.frame :global(.pa-scene) { --pa-bg: var(--scene-bg); --pa-solid: var(--scene-solid); --pa-light: var(--scene-light); --pele-surface: var(--scene-surface); --pele-fg: var(--scene-fg); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
	@media (max-width: 56rem) {
		.top { grid-template-columns: minmax(0, 1fr); }
		.tabs { display: flex; }
		.hide { display: none; }
	}
</style>
