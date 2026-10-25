<script lang="ts">
	import { page } from '$app/state';
	import { live } from '#lib/live';
	import { langOf, prefix } from '#lib/i18n';
	const ko = $derived(langOf(page.url.pathname) === 'ko');
	const px = $derived(prefix(ko ? 'ko' : 'en'));
	const hero = $derived(ko
		? `flowchart LR
  %% pa: 1=M 2=M>O 3=O>I 4=I>R
  M@{ icon: "file-code", form: "square", h: 88, label: "Mermaid 코드" }
  O@{ icon: "list-numbers", form: "square", h: 88, label: "순서가 정해진 단계" }
  I@{ icon: "palette", form: "square", h: 88, label: "아이콘이 있는 장면" }
  R@{ icon: "player-play", form: "square", h: 88, label: "독자가 따라가며 읽기" }
  M -->|순서 고정| O
  O -->|아이콘 추가| I
  I -->|클릭해서 진행| R`
		: `flowchart LR
  %% pa: 1=M 2=M>O 3=O>I 4=I>R
  M@{ icon: "file-code", form: "square", h: 88, label: "Mermaid code" }
  O@{ icon: "list-numbers", form: "square", h: 88, label: "Ordered steps" }
  I@{ icon: "palette", form: "square", h: 88, label: "Illustrated scene" }
  R@{ icon: "player-play", form: "square", h: 88, label: "Reader follows along" }
  M -->|pin the order| O
  O -->|add icons| I
  I -->|click through| R`);

	// A tiny highlighter for the hero source: one pass, so spans never nest. Input is the constant above, escaped anyway.
	const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const hl = (line: string) =>
		esc(line).replace(/^(\s*%%.*)$|("[^"]*")|(\|[^|]*\|)|(--&gt;)|(\bflowchart\b|\bLR\b)|(\b(?:icon|form|h|label)(?=:))/g,
			(m, c, str, lbl, arrow, kw, key) => `<span class="${c ? 'c' : str ? 's' : lbl ? 'l' : arrow ? 'a' : kw ? 'k' : 'p'}">${m}</span>`);
	// The comparison: one 3-step flow written left to right, drawn four ways in panels too narrow for it. Pele re-lays it out; Mermaid scales it down.
	const flow = $derived(ko
		? `flowchart LR
  A[Mermaid 코드] -->|파싱| B[다이어그램 모델]
  B -->|배치 후 그리기| C[페이지의 SVG]`
		: `flowchart LR
  A[Mermaid code] -->|parse| B[Diagram model]
  B -->|lay out and draw| C[SVG on the page]`);
	const flowIcons = $derived(ko
		? `flowchart LR
  %% pa: autoplay
  A@{ icon: "file-code", form: "square", h: 88, label: "Mermaid 코드" }
  B@{ icon: "settings", form: "square", h: 88, label: "다이어그램 모델" }
  C@{ icon: "photo", form: "square", h: 88, label: "페이지의 SVG" }
  A -->|파싱| B
  B -->|배치 후 그리기| C`
		: `flowchart LR
  %% pa: autoplay
  A@{ icon: "file-code", form: "square", h: 88, label: "Mermaid code" }
  B@{ icon: "settings", form: "square", h: 88, label: "Diagram model" }
  C@{ icon: "photo", form: "square", h: 88, label: "SVG on the page" }
  A -->|parse| B
  B -->|lay out and draw| C`);
	const flowAuto = $derived('flowchart LR\n  %% pa: autoplay\n' + flow.split('\n').slice(1).join('\n'));
	const lines = $derived(hero.split('\n').map(hl));
</script>

<svelte:head>
	<title>{ko ? 'pele-animate: 아이콘이 있는 단계별 Mermaid 다이어그램' : 'pele-animate: step-by-step Mermaid diagrams with icons'}</title>
	<meta name="description" content={ko
		? 'Mermaid 다이어그램이 스스로 설명하게 만드세요. 작성자가 순서를 정하면 독자가 한 단계씩 따라가고, 노드에는 아이콘을 넣을 수 있습니다.'
		: 'Make a Mermaid diagram explain itself one step at a time: you choose the order, readers step through it, and nodes can carry icons.'} />
</svelte:head>

<section class="wrap hero">
		<h1>{ko ? '스스로 설명하는 Mermaid 다이어그램' : 'Mermaid diagrams that explain themselves'}</h1>
		<p class="lead">
			{#if ko}
				<a href="https://pele.run">Pele</a>로 그린 Mermaid 다이어그램을 독자가 작성자가 정한 순서대로 한 단계씩 따라갈 수 있으며, 4,000여 개의 아이콘을 사용할 수 있습니다.
			{:else}
				Readers step through a Mermaid diagram, rendered by <a href="https://pele.run">Pele</a>, in the order you choose, with icons from a set of 4,000+.
			{/if}
		</p>
		<div class="cta">
			<a class="btn primary" href="{px}/docs/getting-started/">{ko ? '시작하기' : 'Get started'}</a>
			<a class="btn" href="https://github.com/dkdev24/pele-animate">GitHub</a>
		</div>
		<div class="stage" role="group" aria-label={ko ? '실시간 예제' : 'Live example'}>
		<div use:live={['document', 'text', 'design', 'media']}>
			<div class="live" data-src={hero}></div>
		</div>
		<p class="hint">{ko ? '다이어그램을 클릭하거나 포커스를 맞추고 Enter 키를 누르면 단계별로 진행됩니다.' : 'Click the diagram, or focus it and press Enter, to step through it.'}</p>
		</div>
	</section>

	<section class="wrap split">
		<figure class="editor">
			<figcaption>diagram.md</figcaption>
			<pre aria-label={ko ? '위 다이어그램의 Mermaid 소스' : 'Mermaid source of the diagram above'}><code>{#each lines as l}<span class="ln">{@html l}</span>{/each}</code></pre>
		</figure>
		<div class="proofs">
			{#if ko}
			<div><h2>순서는 직접 정합니다</h2><p>주석 한 줄, <code>%% pa: 1=M 2=M>O 3=O>I 4=I>R</code>로 단계를 고정합니다. 주석이 없으면 엣지의 순서를 따릅니다. <a href="{px}/docs/step-order/">단계 순서</a></p></div>
			<div><h2>독자가 한 단계씩 따라갑니다</h2><p>이전, 재생, 다음 버튼과 Space, 방향키를 지원하며, 완성된 그림이 기본 상태입니다. <a href="{px}/docs/how-it-works/">동작 방식</a></p></div>
			<div><h2>아이콘은 넉넉하게</h2><p>36개 카테고리에 선형 아이콘 4,368개가 있으며, 가져온 카테고리만 불러오고 선 두께도 조절할 수 있습니다. <a href="{px}/docs/icons/">아이콘</a></p></div>
			{:else}
			<div><h2>You set the order</h2><p>Pin steps with one comment line, <code>%% pa: 1=M 2=M>O 3=O>I 4=I>R</code>. Without it, the order follows the edges. <a href="{px}/docs/step-order/">Step order</a></p></div>
			<div><h2>Readers step through it</h2><p>Previous, play and next buttons, plus Space and the arrow keys. The finished picture is the resting state. <a href="{px}/docs/how-it-works/">How it works</a></p></div>
			<div><h2>Icons from a big set</h2><p>4,368 line icons in 36 categories, loaded only for the categories you import, with adjustable stroke width. <a href="{px}/docs/icons/">Icons</a></p></div>
			{/if}
		</div>
	</section>

	<section class="wrap sec two">
		<h2>{ko ? '설치' : 'Install'}</h2>
		<div>
		<pre><code>npm i pele-animate pele
pnpm add pele-animate pele
yarn add pele-animate pele
bun add pele-animate pele</code></pre>
		{#if ko}
		<p>설치한 뒤에는 <a href="{px}/docs/getting-started/">첫 다이어그램 그리기</a>로 이어가시면 됩니다. 브라우저에서 실행되므로 Vite, Astro, SvelteKit, Nuxt, 일반 HTML에서 모두 쓸 수 있으며, 자세한 방법은 <a href="{px}/docs/recipes/">레시피</a>를 참고하시기 바랍니다.</p>
		{:else}
		<p>Then <a href="{px}/docs/getting-started/">render your first diagram</a>. It runs in the browser, so it works in Vite, Astro, SvelteKit, Nuxt and plain HTML: see <a href="{px}/docs/recipes/">recipes</a>.</p>
		{/if}
		</div>
	</section>

	<section class="wrap sec">
		<h2>{ko ? '같은 다이어그램, 네 가지 방식' : 'Same diagram, four ways'}</h2>
		<p class="cmp-lead">{ko
			? '왼쪽에서 오른쪽으로 흐르는 3단계 다이어그램을 폭이 좁은 패널 네 곳에 그렸습니다. Mermaid는 레이아웃을 그대로 두고 축소하기 때문에 글자를 읽기 어려워집니다. Pele는 폭에 맞춰 레이아웃을 다시 계산하고, pele-animate는 여기에 단계 재생을 더합니다. 마지막 두 패널은 스스로 반복 재생되며, 클릭하면 단계별로 진행됩니다.'
			: 'One three-step flow, written left to right, in panels too narrow for it. Mermaid keeps its layout and shrinks it until the text is hard to read. Pele lays it out again to fit, and pele-animate adds the steps: the last two loop on their own, and a click steps through them.'}</p>
		<div class="cmp" use:live={['document', 'system', 'media']}>
			<figure><div class="mermaid-live" data-src={flow}></div><figcaption>{#if ko}<strong>Mermaid.js</strong> 고정 레이아웃, 축소{:else}<strong>Mermaid.js</strong> fixed layout, scaled down{/if}</figcaption></figure>
			<figure><div class="live" data-mode="plain" data-src={flow}></div><figcaption>{#if ko}<strong>Pele</strong> 폭에 맞춰 레이아웃 조정{:else}<strong>Pele</strong> layout adapts to the width{/if}</figcaption></figure>
			<figure><div class="live" data-src={flowAuto}></div><figcaption>{#if ko}<strong>pele-animate</strong> 자동 재생{:else}<strong>pele-animate</strong> with autoplay{/if}</figcaption></figure>
			<figure><div class="live" data-src={flowIcons}></div><figcaption>{#if ko}<strong>pele-animate</strong> 자동 재생과 아이콘{:else}<strong>pele-animate</strong> with autoplay and icons{/if}</figcaption></figure>
		</div>
	</section>

	<section class="wrap sec">
		<h2>{ko ? '어디에 쓰는가' : 'Where it fits'}</h2>
		{#if ko}
		<table>
			<thead><tr><th></th><th>Mermaid 렌더링</th><th>레이아웃</th><th>단계 순서와 재생</th><th>아이콘</th></tr></thead>
			<tbody>
				<tr><td><a href="https://mermaid.js.org">Mermaid.js</a></td><td>가능, 모든 다이어그램 유형</td><td>고정, 폭에 맞춰 축소하므로 글자도 작아짐</td><td>없음</td><td>Mermaid 문서 참고</td></tr>
				<tr><td><a href="https://pele.run">Pele</a></td><td>가능, 가볍고 동기 방식</td><td>컨테이너 폭에 맞춰 조정</td><td>없음</td><td>직접 제공</td></tr>
				<tr><td><strong>pele-animate</strong></td><td>Pele 사용</td><td>Pele와 동일하게 조정</td><td>있음</td><td>4,368개 내장, 직접 추가도 가능</td></tr>
			</tbody>
		</table>
		<p>pele-animate는 플로차트와 시퀀스 다이어그램을 지원하며, 레이아웃, 크기, 문법은 Pele를 그대로 따릅니다. 테마 패키지가 아니라 비공식 애드온입니다.</p>
		{:else}
		<table>
			<thead><tr><th></th><th>Renders Mermaid</th><th>Layout</th><th>Adds step order and playback</th><th>Icons</th></tr></thead>
			<tbody>
				<tr><td><a href="https://mermaid.js.org">Mermaid.js</a></td><td>Yes, all diagram types</td><td>Fixed; scaled down to fit, so text shrinks</td><td>No</td><td>See Mermaid's docs</td></tr>
				<tr><td><a href="https://pele.run">Pele</a></td><td>Yes, small and synchronous</td><td>Adapts to the container width</td><td>No</td><td>You supply them</td></tr>
				<tr><td><strong>pele-animate</strong></td><td>Uses Pele</td><td>Adapts, as Pele does</td><td>Yes</td><td>4,368 bundled, or your own</td></tr>
			</tbody>
		</table>
		<p>pele-animate supports flowcharts and sequence diagrams. Layout, sizing and syntax stay Pele's. It is an unofficial add-on, not a theme package.</p>
		{/if}
	</section>

	<section class="wrap sec two">
		<h2>{ko ? '코딩 에이전트를 위해' : 'For coding agents'}</h2>
		<p>
			{#if ko}
				패키지에는 프로젝트에 pele-animate를 연결하고 브라우저에서 결과를 확인하는 스킬이 들어 있으며, 모든 문서 페이지는 Markdown으로도 제공됩니다
				(<a href="/llms.txt">llms.txt</a>, <a href="/llms-full.txt">llms-full.txt</a>). 자세한 내용은 <a href="{px}/docs/agents/">코딩 에이전트용 가이드</a>를 참고하시기 바랍니다.
			{:else}
				The package ships a skill that wires pele-animate into a project and checks the result in a browser, and every docs page is
				available as Markdown (<a href="/llms.txt">llms.txt</a>, <a href="/llms-full.txt">llms-full.txt</a>). See
				<a href="{px}/docs/agents/">For coding agents</a>.
			{/if}
		</p>
	</section>

<style>
	.hero { display: flex; flex-direction: column; min-height: calc(100dvh - 4.5rem); padding-top: var(--space-2xl); padding-bottom: var(--space-lg); }
	.lead { margin-top: var(--space-md); color: var(--color-ink-2); }
	.cta { display: flex; gap: var(--space-sm); margin-top: var(--space-lg); flex-wrap: wrap; }
	/* the stage: the diagram on its working grid, fading out from the scene */
	.stage { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center; margin-top: var(--space-xl); isolation: isolate; }
	.stage::before { content: ''; position: absolute; inset: 0 calc(var(--gutter) * -1); z-index: -1; --beat: 40px; --row: 14px;
		background-image: linear-gradient(to right, var(--grid-bar) 1px, transparent 1px), linear-gradient(to right, var(--grid-beat) 1px, transparent 1px), linear-gradient(to right, var(--grid-16) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-row) 1px, transparent 1px);
		background-size: calc(var(--beat) * 4) 100%, var(--beat) 100%, calc(var(--beat) / 4) 100%, 100% var(--row);
		-webkit-mask-image: radial-gradient(ellipse closest-side at 50% 50%, #000 35%, transparent 100%); mask-image: radial-gradient(ellipse closest-side at 50% 50%, #000 35%, transparent 100%); }
	.stage :global(.live) { margin: 0 auto; max-width: 60rem; width: 100%; }
	.stage > div { width: 100%; }
	.stage :global(.pa-scene svg) { width: min(100%, 52rem); height: auto; flex: none; }
	/* narrow screens: keep Pele's natural size (as in the playground) instead of stretching a tall diagram to full width */
	@media (max-width: 48rem) { .stage :global(.pa-scene svg) { width: auto; max-width: 100%; } }
	.hint { color: var(--color-muted); font-size: var(--text-sm); text-align: center; margin: var(--space-md) auto 0; }
	.split { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: var(--gap-columns); align-items: center; margin-top: var(--section-gap-s); }
	.editor { margin: 0; border-radius: var(--radius-card); background: var(--color-sheet); box-shadow: var(--shadow-card); overflow: hidden; min-width: 0; }
	.editor figcaption { padding: var(--space-sm) var(--space-md); font: 500 var(--text-sm) var(--font-code); color: var(--color-muted); background: var(--color-paper-3); box-shadow: inset 0 -1px 0 var(--color-rule); }
	.editor pre { margin: 0; padding: var(--space-md) 0; background: none; box-shadow: none; border-radius: 0; font-size: 0.78rem; line-height: 1.75; counter-reset: ln; overflow-x: auto; }
	.editor code { display: block; width: max-content; min-width: 100%; }
	.editor :global(.ln) { display: block; padding: 0 var(--space-md) 0 0; color: var(--color-ink-2); white-space: pre; }
	.editor :global(.ln)::before { counter-increment: ln; content: counter(ln); display: inline-block; width: 3ch; margin-right: var(--space-md); padding-left: var(--space-xs); text-align: right; color: var(--color-muted); opacity: 0.8; user-select: none; }
	.editor :global(.c) { color: var(--color-muted); font-style: normal; }
	.editor :global(.k) { color: var(--color-accent); font-weight: 600; }
	.editor :global(.p) { color: var(--code-key); }
	.editor :global(.s) { color: var(--code-str); }
	.editor :global(.l) { color: var(--code-lbl); }
	.editor :global(.a) { color: var(--color-accent); }
	.proofs { display: grid; gap: var(--space-lg); }
	.proofs h2 { font-size: var(--text-title); max-width: none; margin-bottom: var(--space-2xs); }
	.proofs p { color: var(--color-ink-2); }
	.cmp-lead { color: var(--color-ink-2); max-width: 46rem; margin-bottom: var(--space-md); }
	.cmp { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-md); align-items: stretch; }
	.cmp figure { margin: 0; min-width: 0; display: flex; flex-direction: column; }
	.cmp figcaption { margin-top: var(--space-xs); font-size: var(--text-sm); color: var(--color-muted); text-align: center; }
	.cmp figcaption strong { display: block; color: var(--color-ink); }
	.cmp :global(.live), .cmp :global(.mermaid-live) { margin: 0; display: flex; justify-content: center; align-items: center; flex: 1; min-height: 20rem; padding: var(--space-sm); border-radius: var(--radius-card); box-shadow: var(--shadow-card); background: var(--color-sheet); }
	.cmp :global(.mermaid-live svg), .cmp :global(.pa-scene svg), .cmp :global(.live svg) { max-width: 100%; height: auto; }
	/* plain Pele has no .pa-scene: give it the scene colours so only the behaviour differs */
	.cmp :global(.live[data-mode='plain']) { --pele-bg: var(--scene-bg); --pele-line: var(--scene-fg); --pele-surface: var(--scene-surface); --pele-fg: var(--scene-fg); background: var(--scene-bg); }
	@media (max-width: 70rem) { .cmp { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 36rem) { .cmp { grid-template-columns: minmax(0, 1fr); } }
	.sec { margin-top: var(--section-gap-s); }
	.sec h2 { font-size: var(--text-section); margin-bottom: var(--space-md); }
	.two { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--gap-columns); align-items: start; }
	.two h2 { margin-bottom: 0; }
	.two pre:first-child, .two :global(.codewrap:first-child) { margin-top: 0; }
	@media (max-width: 60rem) { .split, .two { grid-template-columns: minmax(0, 1fr); } }
</style>
