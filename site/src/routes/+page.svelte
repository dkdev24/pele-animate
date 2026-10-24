<script lang="ts">
	import { live } from '#lib/live';
	const hero = `flowchart LR
  %% pa: 1=C 2=L 3=S 4=C>L 5=L>S 6=S>L 7=L>C
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  L@{ icon: "load-balancer", form: "square", h: 88, label: "Load balancer" }
  S@{ icon: "cloud-computing", form: "square", h: 88, label: "Cloud service" }
  C -->|request| L
  L -->|forward| S
  S -->|response| L
  L -->|reply| C`;
</script>

<svelte:head>
	<title>pele-animate: step-by-step Mermaid diagrams with icons</title>
	<meta name="description" content="Make a Pele diagram explain itself one step at a time: you choose the order, readers step through it, and nodes can carry icons." />
</svelte:head>

<section class="wrap hero">
		<h1>Diagrams that explain themselves</h1>
		<p class="lead">
			Readers step through a <a href="https://pele.run">Pele</a> diagram in the order you choose, with icons from a set of 4,000+.
		</p>
		<div class="cta">
			<a class="btn primary" href="/docs/getting-started/">Get started</a>
			<a class="btn" href="https://github.com/dkdev24/pele-animate">GitHub</a>
		</div>
		<div class="stage" role="group" aria-label="Live example">
		<div use:live={['computers']}>
			<div class="live" data-src={hero}></div>
		</div>
		<p class="hint">Click the diagram, or focus it and press Enter, to step through it.</p>
		</div>
	</section>

	<section class="wrap split">
		<p class="big num" aria-hidden="true">4,368</p>
		<div class="proofs">
			<div><h2>You set the order</h2><p>Pin steps with one comment line, <code>%% pa: 1=C 2=L 3=S</code>. Without it, the order follows the edges. <a href="/docs/step-order/">Step order</a></p></div>
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
		<h2>Where it fits</h2>
		<table>
			<thead><tr><th></th><th>Renders Mermaid</th><th>Adds step order and playback</th><th>Icons</th></tr></thead>
			<tbody>
				<tr><td><a href="https://mermaid.js.org">Mermaid.js</a></td><td>Yes, all diagram types</td><td>No</td><td>See Mermaid's docs</td></tr>
				<tr><td><a href="https://pele.run">Pele</a></td><td>Yes, small and synchronous</td><td>No</td><td>You supply them</td></tr>
				<tr><td><strong>pele-animate</strong></td><td>Uses Pele</td><td>Yes</td><td>4,368 bundled, or your own</td></tr>
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
	.hint { color: var(--color-muted); font-size: var(--text-sm); text-align: center; margin: var(--space-md) auto 0; }
	.split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--gap-columns); align-items: center; margin-top: var(--section-gap-s); }
	.big { font-family: var(--font-outlier); font-size: clamp(6rem, 14vw, 11rem); line-height: 0.9; letter-spacing: -0.02em; color: var(--color-ink); }
	.proofs { display: grid; gap: var(--space-lg); }
	.proofs h2 { font-size: var(--text-title); max-width: none; margin-bottom: var(--space-2xs); }
	.proofs p { color: var(--color-ink-2); }
	.sec { margin-top: var(--section-gap-s); }
	.sec h2 { font-size: var(--text-section); margin-bottom: var(--space-md); }
	.two { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--gap-columns); align-items: start; }
	.two h2 { margin-bottom: 0; }
	.two pre:first-child { margin-top: 0; }
	@media (max-width: 60rem) { .split, .two { grid-template-columns: minmax(0, 1fr); } }
</style>
