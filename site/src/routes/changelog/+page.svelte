<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Changelog · pele-animate</title>
	<link rel="alternate" type="application/rss+xml" title="pele-animate releases" href="/changelog.xml" />
</svelte:head>

<div class="wrap">
	<article>
		<h1>Changelog</h1>
		<p><a href="/changelog.xml">RSS feed</a> · <a href="https://github.com/dkdev24/pele-animate/releases">GitHub releases</a></p>
		{@html data.html}
	</article>
</div>

<style>
	article { max-width: 72ch; padding-top: var(--space-xl); }
</style>
