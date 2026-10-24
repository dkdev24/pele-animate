<script lang="ts">
	import { onMount } from 'svelte';
	import { live } from '#lib/live';
	let { data } = $props();
	let menu: HTMLDetailsElement;
	// the menu starts open for no-JS readers and closes on narrow screens, where it sits above the content
	onMount(() => { if (matchMedia('(max-width: 62rem)').matches) menu.open = false; });
	const sections = $derived([...new Set(data.nav.map((n) => n.section))]);
</script>

<svelte:head>
	<title>{data.doc.title} · pele-animate</title>
	<meta name="description" content={data.doc.description} />
	<link rel="alternate" type="text/markdown" href="/docs/{data.doc.slug}.md" />
</svelte:head>

<div class="wrap docs">
	<aside class="side">
		<details open bind:this={menu}>
			<summary>Docs menu</summary>
			{#each sections as s}
				<p class="sec">{s}</p>
				<ul>
					{#each data.nav.filter((n) => n.section === s) as n}
						<li><a href="/docs/{n.slug}/" aria-current={n.slug === data.doc.slug ? 'page' : undefined}>{n.title}</a></li>
					{/each}
				</ul>
			{/each}
		</details>
	</aside>

	<article use:live={data.doc.categories}>
		{@html data.doc.html}
		<nav class="pn" aria-label="Previous and next page">
			{#if data.prev}<a href="/docs/{data.prev.slug}/"><small>Previous</small>{data.prev.title}</a>{:else}<span></span>{/if}
			{#if data.next}<a class="next" href="/docs/{data.next.slug}/"><small>Next</small>{data.next.title}</a>{/if}
		</nav>
		<p class="meta">
			<a href="https://github.com/dkdev24/pele-animate/edit/main/docs/{data.doc.slug}.md">Edit this page on GitHub</a> ·
			<a href="/docs/{data.doc.slug}.md">View as Markdown</a>
		</p>
	</article>

	<aside class="toc" aria-label="On this page">
		{#if data.doc.headings.length}
			<p class="sec">On this page</p>
			<ul>{#each data.doc.headings as h}<li class:sub={h.depth === 3}><a href="#{h.id}">{h.text}</a></li>{/each}</ul>
		{/if}
	</aside>
</div>

<style>
	.docs { display: grid; grid-template-columns: 15rem minmax(0, 1fr) 13rem; gap: var(--space-xl); padding-top: var(--space-xl); }
	article { max-width: 72ch; min-width: 0; }
	article :global(.live) { max-width: none; }
	.side, .toc { position: sticky; top: 5.5rem; align-self: start; max-height: calc(100dvh - 6.5rem); overflow-y: auto; font-size: 0.92rem; }
	.sec { font-size: var(--text-sm); color: var(--color-muted); margin: 1.25rem 0 0.35rem; font-weight: 500; }
	ul { list-style: none; margin: 0; padding: 0; }
	li a { display: block; padding: 0.4rem 0.8rem; border-radius: var(--radius-pill); color: var(--color-ink-2); text-decoration: none; transition: background-color var(--dur-micro) var(--ease-out); }
	li a:hover { background: var(--color-accent-soft); color: var(--color-ink); }
	li a[aria-current='page'] { background: var(--color-sheet); color: var(--color-ink); font-weight: 500; box-shadow: 0 0 0 1px var(--shade-1), 0 8px 18px -12px var(--shade-2), inset 0 1px 0 var(--hi); }
	.toc li a { padding: 0.2rem 0; border-radius: 0; }
	.toc li a:hover { background: none; color: var(--color-accent); }
	.toc li.sub a { padding-left: 0.9rem; }
	summary { cursor: pointer; font-weight: 500; display: none; }
	.pn { display: flex; justify-content: space-between; gap: var(--space-md); margin-top: var(--space-2xl); }
	.pn a { border-radius: var(--radius-inner); padding: 0.9rem 1.15rem; text-decoration: none; display: block; min-width: 40%; color: var(--color-ink); background: var(--color-sheet); box-shadow: var(--shadow-card); transition: transform var(--dur-short) var(--ease-out); }
	.pn a:hover { transform: translateY(-2px); }
	.pn small { display: block; color: var(--color-muted); font-size: var(--text-xs); }
	.next { text-align: right; margin-left: auto; }
	.meta { font-size: var(--text-sm); color: var(--color-muted); }
	@media (max-width: 62rem) {
		.docs { grid-template-columns: minmax(0, 1fr); gap: 0.5rem; }
		.toc { display: none; }
		.side { position: static; max-height: none; border-bottom: 1px solid var(--color-rule); padding-bottom: 0.75rem; }
		summary { display: block; padding: 0.6rem 0; }
	}
</style>
