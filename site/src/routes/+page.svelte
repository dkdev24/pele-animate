<script lang="ts">
	import { live } from '#lib/live';
	const hero = `flowchart LR
  %% pa: 1=M 2=M>O 3=O>I 4=I>R
  M@{ icon: "file-code", form: "square", h: 88, label: "Mermaid code" }
  O@{ icon: "list-numbers", form: "square", h: 88, label: "Ordered steps" }
  I@{ icon: "palette", form: "square", h: 88, label: "Illustrated scene" }
  R@{ icon: "player-play", form: "square", h: 88, label: "Reader follows along" }
  M -->|pin the order| O
  O -->|add icons| I
  I -->|click through| R`;

	// A tiny highlighter for the hero source: one pass, so spans never nest. Input is the constant above, escaped anyway.
	const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	const hl = (line: string) =>
		esc(line).replace(/^(\s*%%.*)$|("[^"]*")|(\|[^|]*\|)|(--&gt;)|(\bflowchart\b|\bLR\b)|(\b(?:icon|form|h|label)(?=:))/g,
			(m, c, str, lbl, arrow, kw, key) => `<span class="${c ? 'c' : str ? 's' : lbl ? 'l' : arrow ? 'a' : kw ? 'k' : 'p'}">${m}</span>`);
	// The comparison: one 3-step flow written left to right, drawn four ways in panels too narrow for it. Pele re-lays it out; Mermaid scales it down.
	const flow = `flowchart LR
  A[Mermaid code] -->|parse| B[Diagram model]
  B -->|lay out and draw| C[SVG on the page]`;
	const flowIcons = `flowchart LR
  %% pa: autoplay
  A@{ icon: "file-code", form: "square", h: 88, label: "Mermaid code" }
  B@{ icon: "settings", form: "square", h: 88, label: "Diagram model" }
  C@{ icon: "photo", form: "square", h: 88, label: "SVG on the page" }
  A -->|parse| B
  B -->|lay out and draw| C`;
	const flowAuto = `flowchart LR
  %% pa: autoplay
  A[Mermaid code] -->|parse| B[Diagram model]
  B -->|lay out and draw| C[SVG on the page]`;
	const lines = hero.split('\n').map(hl);
</script>

<svelte:head>
	<title>pele-animate: step-by-step Mermaid diagrams with icons</title>
	<meta name="description" content="Make a Mermaid diagram explain itself one step at a time: you choose the order, readers step through it, and nodes can carry icons." />
</svelte:head>

<section class="wrap hero">
		<h1>Mermaid diagrams that explain themselves</h1>
		<p class="lead">
			Readers step through a Mermaid diagram, rendered by <a href="https://pele.run">Pele</a>, in the order you choose, with icons from a set of 4,000+.
		</p>
		<div class="cta">
			<a class="btn primary" href="/docs/getting-started/">Get started</a>
			<a class="btn" href="https://github.com/dkdev24/pele-animate">GitHub</a>
		</div>
		<div class="stage" role="group" aria-label="Live example">
		<div use:live={['document', 'text', 'design', 'media']}>
			<div class="live" data-src={hero}></div>
		</div>
		<p class="hint">Click the diagram, or focus it and press Enter, to step through it.</p>
		</div>
	</section>

	<section class="wrap split">
		<figure class="editor">
			<figcaption>diagram.md</figcaption>
			<pre aria-label="Mermaid source of the diagram above"><code>{#each lines as l}<span class="ln">{@html l}</span>{/each}</code></pre>
		</figure>
		<div class="proofs">
			<div><h2>You set the order</h2><p>Pin steps with one comment line, <code>%% pa: 1=M 2=M>O 3=O>I 4=I>R</code>. Without it, the order follows the edges. <a href="/docs/step-order/">Step order</a></p></div>
			<div><h2>Readers step through it</h2><p>Previous, play and next buttons, plus Space and the arrow keys. The finished picture is the resting state. <a href="/docs/how-it-works/">How it works</a></p></div>
			<div><h2>Icons from a big set</h2><p>4,368 line icons in 36 categories, loaded only for the categories you import, with adjustable stroke width. <a href="/docs/icons/">Icons</a></p></div>
		</div>
	</section>

	<section class="wrap sec two">
		<h2>Install</h2>
		<div>
		<pre><code>npm i pele-animate pele
pnpm add pele-animate pele
yarn add pele-animate pele
bun add pele-animate pele</code></pre>
		<p>Then <a href="/docs/getting-started/">render your first diagram</a>. It runs in the browser, so it works in Vite, Astro, SvelteKit, Nuxt and plain HTML: see <a href="/docs/recipes/">recipes</a>.</p>
		</div>
	</section>

	<section class="wrap sec">
		<h2>Same diagram, four ways</h2>
		<p class="cmp-lead">One three-step flow, written left to right, in panels too narrow for it. Mermaid keeps its layout and shrinks it until the text is hard to read. Pele lays it out again to fit, and pele-animate adds the steps: the last two loop on their own, and a click steps through them.</p>
		<div class="cmp" use:live={['document', 'system', 'media']}>
			<figure><div class="mermaid-live" data-src={flow}></div><figcaption><strong>Mermaid.js</strong> fixed layout, scaled down</figcaption></figure>
			<figure><div class="live" data-mode="plain" data-src={flow}></div><figcaption><strong>Pele</strong> layout adapts to the width</figcaption></figure>
			<figure><div class="live" data-src={flowAuto}></div><figcaption><strong>pele-animate</strong> with autoplay</figcaption></figure>
			<figure><div class="live" data-src={flowIcons}></div><figcaption><strong>pele-animate</strong> with autoplay and icons</figcaption></figure>
		</div>
	</section>

	<section class="wrap sec">
		<h2>Where it fits</h2>
		<table>
			<thead><tr><th></th><th>Renders Mermaid</th><th>Layout</th><th>Adds step order and playback</th><th>Icons</th></tr></thead>
			<tbody>
				<tr><td><a href="https://mermaid.js.org">Mermaid.js</a></td><td>Yes, all diagram types</td><td>Fixed; scaled down to fit, so text shrinks</td><td>No</td><td>See Mermaid's docs</td></tr>
				<tr><td><a href="https://pele.run">Pele</a></td><td>Yes, small and synchronous</td><td>Adapts to the container width</td><td>No</td><td>You supply them</td></tr>
				<tr><td><strong>pele-animate</strong></td><td>Uses Pele</td><td>Adapts, as Pele does</td><td>Yes</td><td>4,368 bundled, or your own</td></tr>
			</tbody>
		</table>
		<p>pele-animate supports flowcharts and sequence diagrams. Layout, sizing and syntax stay Pele's. It is an unofficial add-on, not a theme package.</p>
	</section>

	<section class="wrap sec two">
		<h2>For coding agents</h2>
		<p>
			The package ships a skill that wires pele-animate into a project and checks the result in a browser, and every docs page is
			available as Markdown (<a href="/llms.txt">llms.txt</a>, <a href="/llms-full.txt">llms-full.txt</a>). See
			<a href="/docs/agents/">For coding agents</a>.
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
	.cmp :global(.live[data-mode='plain']) { --pele-bg: var(--scene-bg); --pele-surface: var(--scene-surface); --pele-fg: var(--scene-fg); background: var(--scene-bg); }
	@media (max-width: 70rem) { .cmp { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 36rem) { .cmp { grid-template-columns: minmax(0, 1fr); } }
	.sec { margin-top: var(--section-gap-s); }
	.sec h2 { font-size: var(--text-section); margin-bottom: var(--space-md); }
	.two { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--gap-columns); align-items: start; }
	.two h2 { margin-bottom: 0; }
	.two pre:first-child, .two :global(.codewrap:first-child) { margin-top: 0; }
	@media (max-width: 60rem) { .split, .two { grid-template-columns: minmax(0, 1fr); } }
</style>
