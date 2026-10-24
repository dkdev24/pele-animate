<script lang="ts">
	import { live } from '#lib/live';
	const hero = `flowchart LR
  %% pa: 1=C 2=L 3=S
  C@{ icon: "http-get", form: "square", h: 88, label: "Request" }
  L@{ icon: "load-balancer", form: "square", h: 88, label: "Load balancer" }
  S@{ icon: "cloud-computing", form: "square", h: 88, label: "Cloud service" }
  C <-->|route| L
  L <-->|forward| S`;
</script>

<svelte:head>
	<title>pele-animate: step-by-step Mermaid diagrams with icons</title>
	<meta name="description" content="Make a Pele diagram explain itself one step at a time: you choose the order, readers step through it, and nodes can carry icons." />
</svelte:head>

<div class="wrap">
	<section class="hero">
		<h1>Diagrams that explain themselves, one step at a time</h1>
		<p class="lead">
			pele-animate makes a <a href="https://pele.run">Pele</a> diagram appear in the order you choose. Readers step through it with buttons
			or the keyboard, and any node can carry an icon from a set of 4,000+. It is an unofficial add-on, not a theme package.
		</p>
		<div class="cta">
			<a class="btn primary" href="/docs/getting-started/">Get started</a>
			<a class="btn" href="https://github.com/dkdev24/pele-animate">GitHub</a>
		</div>
		<div use:live={['computers']}>
			<div class="live" data-src={hero}></div>
		</div>
		<p class="hint">Click the diagram, or focus it and press Enter, to step through it.</p>
	</section>

	<section class="proofs">
		<div><h2>You set the order</h2><p>Pin steps with one comment line, <code>%% pa: 1=C 2=L 3=S</code>. Without it, the order follows the edges. <a href="/docs/step-order/">Step order</a></p></div>
		<div><h2>Readers step through it</h2><p>Previous, play and next buttons, plus Space and the arrow keys. The finished picture is the resting state. <a href="/docs/how-it-works/">How it works</a></p></div>
		<div><h2>Icons from a big set</h2><p>4,368 line icons in 36 categories, loaded only for the categories you import, with adjustable stroke width. <a href="/docs/icons/">Icons</a></p></div>
	</section>

	<section>
		<h2>Install</h2>
		<pre><code>npm i pele-animate pele
pnpm add pele-animate pele
yarn add pele-animate pele
bun add pele-animate pele</code></pre>
		<p>Then <a href="/docs/getting-started/">render your first diagram</a>. It runs in the browser, so it works in Vite, Astro, SvelteKit, Nuxt and plain HTML: see <a href="/docs/recipes/">recipes</a>.</p>
	</section>

	<section>
		<h2>Where it fits</h2>
		<table>
			<thead><tr><th></th><th>Renders Mermaid</th><th>Adds step order and playback</th><th>Icons</th></tr></thead>
			<tbody>
				<tr><td><a href="https://mermaid.js.org">Mermaid.js</a></td><td>Yes, all diagram types</td><td>No</td><td>See Mermaid's docs</td></tr>
				<tr><td><a href="https://pele.run">Pele</a></td><td>Yes, small and synchronous</td><td>No</td><td>You supply them</td></tr>
				<tr><td><strong>pele-animate</strong></td><td>Uses Pele</td><td>Yes</td><td>4,368 bundled, or your own</td></tr>
			</tbody>
		</table>
		<p>pele-animate supports flowcharts and sequence diagrams. Layout, sizing and syntax stay Pele's.</p>
	</section>

	<section>
		<h2>For coding agents</h2>
		<p>
			The package ships a skill that wires pele-animate into a project and checks the result in a browser, and every docs page is
			available as Markdown (<a href="/llms.txt">llms.txt</a>, <a href="/llms-full.txt">llms-full.txt</a>). See
			<a href="/docs/agents/">For coding agents</a>.
		</p>
	</section>
</div>

<style>
	.hero { padding: 3rem 0 1rem; max-width: 52rem; }
	h1 { font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -0.02em; margin-bottom: 1rem; }
	.lead { font-size: 1.15rem; color: var(--fg-muted); max-width: 46rem; }
	.cta { display: flex; gap: 0.75rem; margin: 1.5rem 0; flex-wrap: wrap; }
	.btn { display: inline-flex; align-items: center; height: 40px; padding: 0 1.1rem; border: 1px solid var(--line); border-radius: 8px; text-decoration: none; color: var(--fg); font-weight: 650; }
	.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--bg); }
	.hint { color: var(--fg-muted); font-size: 0.85rem; margin-top: -0.5rem; }
	.proofs { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: 1.5rem; margin: 2rem 0; }
	.proofs h2 { font-size: 1.1rem; margin-top: 0; }
	.proofs p { color: var(--fg-muted); margin: 0; }
</style>
