<script lang="ts">
	import { page } from '$app/state';
	import { langOf, prefix } from '#lib/i18n';
	const ko = $derived(langOf(page.url.pathname) === 'ko');
	const px = $derived(prefix(ko ? 'ko' : 'en'));
	let { data } = $props();
</script>

<svelte:head>
	<title>{ko ? '변경 내역' : 'Changelog'} · pele-animate</title>
	<link rel="alternate" type="application/rss+xml" title="pele-animate releases" href="/changelog.xml" />
</svelte:head>

<div class="wrap">
	<article>
		<h1>{ko ? '변경 내역' : 'Changelog'}</h1>
		<p><a href="/changelog.xml">{ko ? 'RSS 피드' : 'RSS feed'}</a> · <a href="https://github.com/dkdev24/pele-animate/releases">{ko ? 'GitHub 릴리스' : 'GitHub releases'}</a></p>
		{#if ko}<p>릴리스 노트는 영어로만 제공됩니다.</p>{/if}
		{@html data.html}
	</article>
</div>

<style>
	article { max-width: 72ch; padding-top: var(--space-xl); }
</style>
