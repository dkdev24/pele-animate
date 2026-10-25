<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Consent from '#lib/Consent.svelte';
	import { page } from '$app/state';
	import { langOf, prefix, swap, tr } from '#lib/i18n';
	let { children } = $props();
	const lang = $derived(langOf(page.url.pathname));
	const t = $derived(tr(lang));
	const px = $derived(prefix(lang));
	const other = $derived(swap(page.url.pathname));
	// keep the query string (a playground share link) when switching; url.search is unavailable while prerendering, so read it on click
	const keepQuery = (e: MouseEvent) => { (e.currentTarget as HTMLAnchorElement).href = swap(location.pathname) + location.search; };
	const L = () => langOf(location.pathname); // read at click time: the copy buttons outlive navigation
	const copyLabel = () => tr(L())('copy');
	const copiedLabel = () => tr(L())('copied');
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
	// Tabler "copy" and "copy-check" (MIT)
	const COPY = '<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>';
	const DONE = '<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"/><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/><path d="M11 14l2 2l4 -4"/>';
	const icon = (paths: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

	const PMS = ['npm', 'pnpm', 'yarn', 'bun'];
	const pmOf = (line: string) => line.trim().split(/\s+/)[0];
	let pm = '';
	try { pm = localStorage.getItem('pm') ?? ''; } catch {}

	/** An install block: every non-comment line starts with a package manager, at least two of them. Returns its panes. */
	function splitInstall(pre: HTMLElement) {
		const rows = pre.querySelectorAll<HTMLElement>('.line');
		const lines = rows.length ? [...rows].map((r) => r.textContent ?? '') : (pre.textContent ?? '').trimEnd().split('\n');
		const used = lines.filter((l) => l.trim() && !l.trim().startsWith('#'));
		const names = PMS.filter((n) => used.some((l) => pmOf(l) === n));
		if (names.length < 2 || used.some((l) => !PMS.includes(pmOf(l)))) return null;
		return names.map((name) => {
			const clone = pre.cloneNode(true) as HTMLElement;
			if (rows.length) {
				clone.querySelectorAll<HTMLElement>('.line').forEach((r) => {
					const t = pmOf(r.textContent ?? '');
					if (t !== name) { if (r.nextSibling?.nodeType === 3) r.nextSibling.remove(); r.remove(); }
				});
			} else {
				clone.textContent = lines.filter((l) => pmOf(l) === name).join('\n');
			}
			return { name, pre: clone };
		});
	}

	/** Svelte action: give every <pre> under the node (now and after navigation) a copy button; install blocks get package-manager tabs. */
	function codecopy(node: HTMLElement) {
		const tabbed = new Set<() => void>(); // every install block re-selects together
		const wrap = () => {
			for (const pre of node.querySelectorAll<HTMLElement>('pre:not(.nocopy)')) {
				if (pre.closest('.codewrap')) continue;
				const box = document.createElement('div');
				box.className = 'codewrap';
				const body = document.createElement('div');
				body.className = 'codebody';
				const tabs = splitInstall(pre);
				const panes = tabs ? tabs.map((t) => t.pre) : [pre];
				const shown = () => panes.find((p) => !p.hidden) ?? panes[0];
				if (tabs) {
					const bar = document.createElement('div');
					bar.className = 'codetabs';
					bar.setAttribute('role', 'tablist');
					const buttons = tabs.map((t) => {
						const tb = document.createElement('button');
						tb.type = 'button';
						tb.setAttribute('role', 'tab');
						tb.textContent = t.name;
						tb.onclick = () => {
							pm = t.name;
							try { localStorage.setItem('pm', pm); } catch {}
							tabbed.forEach((f) => f());
						};
						bar.append(tb);
						return tb;
					});
					const select = () => {
						const i = Math.max(0, tabs.findIndex((t) => t.name === pm));
						panes.forEach((p, j) => (p.hidden = j !== i));
						buttons.forEach((tb, j) => tb.setAttribute('aria-selected', String(j === i)));
					};
					tabbed.add(select);
					select();
					box.append(bar);
				}
				const b = document.createElement('button');
				b.type = 'button';
				b.className = 'copy';
				b.title = b.ariaLabel = copyLabel();
				b.innerHTML = icon(COPY);
				let t = 0;
				b.onclick = async () => {
					try { await navigator.clipboard.writeText(shown().innerText.replace(/\n$/, '')); } catch { return; }
					b.innerHTML = icon(DONE);
					b.title = b.ariaLabel = copiedLabel();
					clearTimeout(t);
					t = window.setTimeout(() => { b.innerHTML = icon(COPY); b.title = b.ariaLabel = copyLabel(); }, 1600);
				};
				pre.replaceWith(box);
				body.append(...panes, b);
				box.append(body);
			}
		};
		wrap();
		const mo = new MutationObserver(wrap);
		mo.observe(node, { childList: true, subtree: true });
		return { destroy: () => mo.disconnect() };
	}
	const toggle = () => {
		const next = dark ? 'light' : 'dark';
		apply(next);
		try { localStorage.setItem('theme', next); } catch {}
	};
</script>

<svelte:head>
	<link rel="alternate" hreflang={lang} href="https://pele-animate.danielkimdev.com{page.url.pathname}" />
	<link rel="alternate" hreflang={lang === 'ko' ? 'en' : 'ko'} href="https://pele-animate.danielkimdev.com{swap(page.url.pathname)}" />
</svelte:head>

<a class="skip" href="#main">{t('skip')}</a>
<header>
	<div class="wrap bar">
		<a class="brand" href="{px}/">pele-animate</a>
		<nav aria-label={t('mainNav')}>
			<a href="{px}/docs/getting-started/">{t('docs')}</a>
			<a href="{px}/icons/">{t('icons')}</a>
			<a href="{px}/playground/">{t('playground')}</a>
			<a href="{px}/changelog/">{t('changelog')}</a>
			<a href="https://github.com/dkdev24/pele-animate">GitHub</a>
			<a href="https://www.npmjs.com/package/pele-animate">npm</a>
		</nav>
		<div class="ctl">
			<a class="lang" href={other} hreflang={lang === 'ko' ? 'en' : 'ko'} lang={lang === 'ko' ? 'en' : 'ko'} aria-label={t('switchLabel')} data-sveltekit-reload onclick={keepQuery}>{t('switchTo')}</a>
			<button type="button" onclick={toggle} aria-pressed={dark} aria-label={t('darkTheme')}>{dark ? '☾' : '☀'}</button>
		</div>
	</div>
</header>
<main id="main" use:codecopy>{#key lang}{@render children()}{/key}</main>
<Consent />
<footer>
	<div class="wrap">
		<p class="mark" aria-hidden="true">pele-animate</p>
		<div class="fine">
		{#if lang === 'ko'}
		<p>
			<a href="https://github.com/obsidianmd/pele">Pele</a>(kepano, MIT)를 기반으로 만든 비공식 애드온이며, Pele 및 Obsidian 팀과 제휴하거나 승인을 받지 않았습니다.
			아이콘은 <a href="https://github.com/tabler/tabler-icons">Tabler Icons</a>(MIT)를 사용합니다.
		</p>
		{:else}
		<p>
			Built on <a href="https://github.com/obsidianmd/pele">Pele</a> by kepano (MIT). Unofficial add-on, not affiliated with or
			endorsed by the Pele or Obsidian teams. Icons from <a href="https://github.com/tabler/tabler-icons">Tabler Icons</a> (MIT).
		</p>
		{/if}
		<p>{t('footerLicense')} <a href="https://github.com/dkdev24/pele-animate">{t('footerSource')}</a>. <a href="{px}/privacy/">{t('privacy')}</a>.</p>
		</div>
	</div>
</footer>

<style>
	header { position: sticky; top: 0; z-index: var(--z-sticky-nav); background: color-mix(in oklab, var(--color-paper) 86%, transparent); backdrop-filter: blur(14px); }
	/* Mobile: brand + theme button on row 1, scrollable nav on row 2. Wide: one 4.5rem row. */
	.bar { display: grid; grid-template-areas: 'brand controls' 'nav nav'; grid-template-columns: 1fr auto; align-items: center; column-gap: var(--space-xs); }
	.ctl { grid-area: controls; display: flex; align-items: center; gap: var(--space-xs); }
	.lang { color: var(--color-ink-2); text-decoration: none; font-size: 0.9rem; font-weight: 500; padding: 0.5rem 0.6rem; border-radius: var(--radius-pill); white-space: nowrap; }
	.lang:hover { background: var(--color-accent-soft); color: var(--color-ink); }
	@media (min-width: 56rem) { .bar { grid-template-areas: 'brand nav controls'; grid-template-columns: 1fr auto auto; column-gap: var(--space-lg); height: 4.5rem; } }
	.brand { font-family: var(--font-display); font-weight: 600; font-size: var(--text-lg); letter-spacing: var(--tracking-display); color: var(--color-ink); text-decoration: none; white-space: nowrap; grid-area: brand; display: flex; align-items: center; height: 3.5rem; }
	@media (min-width: 56rem) { .brand { height: auto; } }
	nav { grid-area: nav; min-width: 0; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; padding-bottom: var(--space-xs); margin-left: -0.4rem; font-size: 0.9rem; font-weight: 500; }
	nav::-webkit-scrollbar { display: none; }
	@media (min-width: 56rem) { nav { gap: var(--space-xs); padding-bottom: 0; margin-left: 0; font-size: 0.95rem; } nav a { padding: 0.55rem 0.85rem; } }
	nav a { color: var(--color-ink-2); text-decoration: none; padding: 0.5rem 0.6rem; white-space: nowrap; border-radius: var(--radius-pill); transition: background-color var(--dur-micro) var(--ease-out); }
	nav a:hover { background: var(--color-accent-soft); color: var(--color-ink); }
	button { height: 44px; width: 44px; border: 0; border-radius: 50%; background: var(--color-sheet); color: var(--color-ink); cursor: pointer; font-size: 1.05rem; box-shadow: 0 0 0 1px var(--shade-1), inset 0 1px 0 var(--hi); }
	button:active { transform: translateY(1px); }
	footer { margin-top: var(--section-gap-s); padding: var(--space-2xl) 0 var(--space-xl); }
	.mark { font-family: var(--font-display); font-weight: 600; font-size: var(--text-display-s); letter-spacing: var(--tracking-display); line-height: 1; margin: 0 0 var(--space-lg); color: var(--color-ink); }
	footer .fine { color: var(--color-muted); font-size: 0.9rem; border-top: 1px solid var(--color-rule); padding-top: var(--space-lg); }
	footer p:not([class]) { max-width: 70ch; margin: 0.4rem 0; }
	@media (max-width: 55.99rem) { button { width: 40px; height: 40px; } }
</style>
