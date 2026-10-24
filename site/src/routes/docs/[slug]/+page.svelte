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
	.docs { display: grid; grid-template-columns: 14rem minmax(0, 1fr) 12rem; gap: 2.5rem; padding-top: 2rem; }
	article { max-width: 72ch; min-width: 0; }
	article :global(.live) { max-width: none; }
	.side, .toc { position: sticky; top: 4.5rem; align-self: start; max-height: calc(100dvh - 5.5rem); overflow-y: auto; font-size: 0.9rem; }
	.sec { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-muted); margin: 1rem 0 0.35rem; font-weight: 650; }
	ul { list-style: none; margin: 0; padding: 0; }
	li a { display: block; padding: 0.25rem 0.6rem; border-radius: 6px; color: var(--fg-muted); text-decoration: none; }
	li a:hover { color: var(--accent); }
	li a[aria-current='page'] { background: var(--accent-soft); color: var(--accent); font-weight: 650; }
	.toc li a { padding: 0.15rem 0; }
	.toc li.sub a { padding-left: 0.9rem; }
	summary { cursor: pointer; font-weight: 650; display: none; }
	.pn { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; }
	.pn a { border: 1px solid var(--line); border-radius: 8px; padding: 0.7rem 1rem; text-decoration: none; display: block; min-width: 40%; }
	.pn a:hover { border-color: var(--accent); }
	.pn small { display: block; color: var(--fg-muted); font-size: 0.78rem; }
	.next { text-align: right; margin-left: auto; }
	.meta { font-size: 0.85rem; color: var(--fg-muted); }
	@media (max-width: 62rem) {
		.docs { grid-template-columns: minmax(0, 1fr); gap: 0.5rem; }
		.toc { display: none; }
		.side { position: static; max-height: none; border-bottom: 1px solid var(--line); padding-bottom: 0.75rem; }
		summary { display: block; }
	}
</style>
