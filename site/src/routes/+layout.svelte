<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();
	let dark = $state(false);

	const apply = (t: 'light' | 'dark') => {
		document.documentElement.dataset.theme = t;
		dark = t === 'dark';
	};
	onMount(() => {
		let saved: string | null = null;
		try { saved = localStorage.getItem('theme'); } catch {}
		if (saved === 'light' || saved === 'dark') apply(saved);
		else dark = matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const toggle = () => {
		const next = dark ? 'light' : 'dark';
		apply(next);
		try { localStorage.setItem('theme', next); } catch {}
	};
</script>

<a class="skip" href="#main">Skip to content</a>
<header>
	<div class="wrap bar">
		<a class="brand" href="/">pele-animate</a>
		<nav aria-label="Main">
			<a href="/docs/getting-started/">Docs</a>
			<a href="/changelog/">Changelog</a>
			<a href="https://github.com/dkdev24/pele-animate">GitHub</a>
			<a href="https://www.npmjs.com/package/pele-animate">npm</a>
		</nav>
		<button type="button" onclick={toggle} aria-pressed={dark} aria-label="Dark theme">{dark ? '☾' : '☀'}</button>
	</div>
</header>
<main id="main">{@render children()}</main>
<footer>
	<div class="wrap">
		<p>
			Built on <a href="https://github.com/obsidianmd/pele">Pele</a> by kepano (MIT). Unofficial add-on, not affiliated with or
			endorsed by the Pele or Obsidian teams. Icons from <a href="https://github.com/tabler/tabler-icons">Tabler Icons</a> (MIT).
		</p>
		<p>pele-animate is MIT licensed. <a href="https://github.com/dkdev24/pele-animate">Source on GitHub</a>.</p>
	</div>
</footer>

<style>
	header { border-bottom: 1px solid var(--line); position: sticky; top: 0; background: var(--bg); z-index: 5; }
	.bar { display: flex; align-items: center; gap: 1.25rem; height: 3.5rem; }
	.brand { font-weight: 650; color: var(--fg); text-decoration: none; margin-right: auto; }
	nav { display: flex; gap: 1.1rem; font-size: 0.95rem; }
	nav a { color: var(--fg-muted); text-decoration: none; }
	nav a:hover { color: var(--accent); }
	button { height: 36px; width: 36px; border: 1px solid var(--line); background: var(--bg); color: var(--fg); border-radius: 8px; cursor: pointer; font-size: 1rem; }
	footer { border-top: 1px solid var(--line); margin-top: 4rem; padding: 1.5rem 0 2.5rem; color: var(--fg-muted); font-size: 0.88rem; }
	footer p { margin: 0.35rem 0; }
	@media (max-width: 34rem) { nav a:nth-child(n + 3) { display: none; } }
</style>
