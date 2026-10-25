<script lang="ts">
	import { page } from '$app/state';
	import { live } from '#lib/live';
	import { langOf, prefix } from '#lib/i18n';
	const ko = $derived(langOf(page.url.pathname) === 'ko');
	const px = $derived(prefix(ko ? 'ko' : 'en'));
	const lost = `flowchart LR
  %% pa: 1=C 2=C>X
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  X@{ icon: "cloud-computing", form: "square", h: 88, label: "No such page" }
  C -->|${page.status}| X`;
	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? (ko ? '페이지를 찾을 수 없습니다' : 'Page not found') : ko ? '문제가 발생했습니다' : 'Something went wrong'} · pele-animate</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap lost">
	<p class="code">{page.status}</p>
	<h1>{missing ? (ko ? '찾으시는 페이지가 없습니다' : 'This page took a wrong turn') : ko ? '문제가 발생했습니다' : 'Something went wrong'}</h1>
	<p class="lead">
		{missing
			? (ko ? '주소가 잘못 입력되었거나 페이지가 이동했을 수 있습니다. 아래 링크를 이용해 보시기 바랍니다.' : 'The address may be mistyped, or the page may have moved. Try one of these instead.')
			: ko ? '페이지를 새로고침하거나 문서로 돌아가 보시기 바랍니다.' : 'Reload the page, or head back to the docs.'}
	</p>
	<div class="cta">
		<a class="btn primary" href="{px}/docs/getting-started/">{ko ? '시작하기' : 'Get started'}</a>
		<a class="btn" href="{px}/">{ko ? '홈' : 'Home'}</a>
		<a class="btn" href="{px}/docs/">{ko ? '문서' : 'Docs'}</a>
		<a class="btn" href="{px}/playground/">{ko ? '플레이그라운드' : 'Playground'}</a>
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
