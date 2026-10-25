<script lang="ts">
	import { onMount } from 'svelte';

	// Production host only: previews and local builds must not pollute the reports.
	// The tag loads after Accept; the choice lives in localStorage and the privacy page's button clears it.
	const KEY = 'pa-consent';
	const GA_ID = 'G-FVJH7Z0DFY';
	let choice = $state<'granted' | 'denied' | null>('denied'); // prerender and first paint: no banner, no tag

	const load = () => {
		const w = window as unknown as { dataLayer: unknown[] };
		w.dataLayer = w.dataLayer || [];
		// gtag.js needs the `arguments` object itself, so a plain function, not an arrow
		function gtag(..._: unknown[]) { w.dataLayer.push(arguments); }
		gtag('js', new Date());
		gtag('config', GA_ID);
		const s = document.createElement('script');
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
		document.head.append(s);
	};
	const choose = (c: 'granted' | 'denied') => {
		choice = c;
		try { localStorage.setItem(KEY, c); } catch {} // storage blocked: the choice holds for this page only
		if (c === 'granted') load();
	};
	onMount(() => {
		if (location.hostname !== 'pele-animate.danielkimdev.com') return;
		let v: string | null = null;
		try { v = localStorage.getItem(KEY); } catch { return; } // storage blocked: no banner on every page, no tag
		choice = v === 'granted' || v === 'denied' ? v : null;
		if (v === 'granted') load();
	});
</script>

{#if choice === null}
	<div class="consent" role="region" aria-label="Cookie consent">
		<p>This site uses Google Analytics cookies to see which pages are read, only if you accept. <a href="/privacy/">Privacy</a></p>
		<div class="actions">
			<button class="btn" type="button" onclick={() => choose('denied')}>Decline</button>
			<button class="btn" type="button" onclick={() => choose('granted')}>Accept</button>
		</div>
	</div>
{/if}

<style>
	.consent { position: fixed; right: var(--space-md); bottom: var(--space-md); left: var(--space-md); z-index: 50; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-md); max-width: 720px; margin: 0 auto; padding: var(--space-md) 1.25rem; border-radius: var(--radius-inner); background: var(--color-sheet); color: var(--color-ink); box-shadow: 0 0 0 1px var(--color-rule), 0 12px 32px -12px var(--shade-2); font-size: 0.9rem; }
	p { flex: 1 1 280px; margin: 0; }
	a { text-decoration: underline; }
	.actions { display: flex; gap: var(--space-xs); }
</style>
