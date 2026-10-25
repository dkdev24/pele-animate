<script lang="ts">
	import { page } from '$app/state';
	import { live } from '#lib/live';
	const lost = `flowchart LR
  %% pa: 1=C 2=C>X
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  X@{ icon: "cloud-computing", form: "square", h: 88, label: "No such page" }
  C -->|${page.status}| X`;
	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Something went wrong'} · pele-animate</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap lost">
	<p class="code">{page.status}</p>
	<h1>{missing ? 'This page took a wrong turn' : 'Something went wrong'}</h1>
	<p class="lead">
		{missing
			? 'The address may be mistyped, or the page may have moved. Try one of these instead.'
			: 'Reload the page, or head back to the docs.'}
	</p>
	<div class="cta">
		<a class="btn primary" href="/docs/getting-started/">Get started</a>
		<a class="btn" href="/">Home</a>
		<a class="btn" href="/docs/">Docs</a>
		<a class="btn" href="/playground/">Playground</a>
	</div>
	<div use:live={['computers']}><div class="live" data-src={lost}></div></div>
</section>

<style>
	.lost { padding-block: var(--space-xl); }
	.code { font-family: var(--font-code); color: var(--color-accent, currentColor); font-size: var(--text-sm); letter-spacing: 0.08em; margin: 0 0 var(--space-xs); }
	.lead { margin-top: var(--space-md); max-width: 52ch; color: var(--color-ink-2); }
	.cta { display: flex; gap: var(--space-sm); margin: var(--space-lg) 0; flex-wrap: wrap; }
	.lost :global(.live) { max-width: 28rem; margin-inline: 0; }
	@media (max-width: 48rem) { .lost :global(.pa-scene svg) { max-width: 100%; height: auto; } }
</style>
