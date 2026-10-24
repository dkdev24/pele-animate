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
			<a href="/icons/">Icons</a>
			<a href="/playground/">Playground</a>
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
		<p class="mark" aria-hidden="true">pele-animate</p>
		<div class="fine">
		<p>
			Built on <a href="https://github.com/obsidianmd/pele">Pele</a> by kepano (MIT). Unofficial add-on, not affiliated with or
			endorsed by the Pele or Obsidian teams. Icons from <a href="https://github.com/tabler/tabler-icons">Tabler Icons</a> (MIT).
		</p>
		<p>pele-animate is MIT licensed. <a href="https://github.com/dkdev24/pele-animate">Source on GitHub</a>.</p>
		</div>
	</div>
</footer>

<style>
	header { position: sticky; top: 0; z-index: var(--z-sticky-nav); background: color-mix(in oklab, var(--color-paper) 86%, transparent); backdrop-filter: blur(14px); }
	.bar { display: flex; align-items: center; gap: var(--space-lg); height: 4.5rem; }
	.brand { font-family: var(--font-display); font-weight: 600; font-size: var(--text-lg); letter-spacing: var(--tracking-display); color: var(--color-ink); text-decoration: none; margin-right: auto; white-space: nowrap; }
	nav { display: flex; gap: var(--space-xs); font-size: 0.95rem; font-weight: 500; }
	nav a { color: var(--color-ink-2); text-decoration: none; padding: 0.55rem 0.85rem; border-radius: var(--radius-pill); transition: background-color var(--dur-micro) var(--ease-out); }
	nav a:hover { background: var(--color-accent-soft); color: var(--color-ink); }
	button { height: 44px; width: 44px; border: 0; border-radius: 50%; background: var(--color-sheet); color: var(--color-ink); cursor: pointer; font-size: 1.05rem; box-shadow: 0 0 0 1px var(--shade-1), inset 0 1px 0 var(--hi); }
	button:active { transform: translateY(1px); }
	footer { margin-top: var(--section-gap-s); padding: var(--space-2xl) 0 var(--space-xl); }
	.mark { font-family: var(--font-display); font-weight: 600; font-size: var(--text-display-s); letter-spacing: var(--tracking-display); line-height: 1; margin: 0 0 var(--space-lg); color: var(--color-ink); }
	footer .fine { color: var(--color-muted); font-size: 0.9rem; border-top: 1px solid var(--color-rule); padding-top: var(--space-lg); }
	footer p:not([class]) { max-width: 70ch; margin: 0.4rem 0; }
	@media (max-width: 40rem) { nav a:nth-child(n + 4) { display: none; } .bar { gap: var(--space-2xs); } nav { gap: 0; font-size: 0.85rem; } nav a { padding: 0.5rem 0.4rem; } .brand { font-size: var(--text-md); } button { width: 40px; height: 40px; } }
	@media (max-width: 23rem) { nav a:nth-child(n + 3) { display: none; } }
</style>
