<script lang="ts">
	// Forget the choice so the banner asks again (a reload also drops an already-loaded tag).
	const reset = () => {
		try { localStorage.removeItem('pa-consent'); } catch {}
		location.reload();
	};
</script>

<svelte:head>
	<title>Privacy · pele-animate</title>
	<meta name="description" content="What the pele-animate website collects: Google Analytics, fonts, hosting logs and what stays in your browser." />
</svelte:head>

<div class="wrap">
	<article>
		<h1>Privacy</h1>
		<p class="meta">Last updated 2026-10-25</p>
		<p>
			This site is a personal open-source project run by Daniel Kim (<a href="https://github.com/dkdev24">dkdev24</a>). It has no accounts,
			forms, comments or ads, and it does not sell data. This page lists what is collected and by whom.
		</p>

		<h2>Google Analytics</h2>
		<p>
			The site uses Google Analytics 4 to see which pages are read and how people arrive. It
			loads only after you press Accept in the cookie banner, and only on the live site. If you decline, no analytics tag loads and no
			analytics cookies are set. Declining after accepting stops the tag from the next page load; cookies already set stay until they expire.
		</p>
		<p><button class="btn" type="button" onclick={reset}>Change cookie settings</button></p>
		<ul>
			<li><strong>Collected:</strong> pages viewed (the full address, including any query string), referrer, approximate location, browser, device and screen size, language, and interaction events such as outbound clicks and scrolls.</li>
			<li><strong>Cookies:</strong> <code>_ga</code> and a second cookie starting with <code>_ga_</code>, which identify a browser anonymously across visits.</li>
			<li><strong>IP address:</strong> Google Analytics 4 does not log or store IP addresses; Google receives it with the request to deliver the tag.</li>
			<li><strong>Processor:</strong> Google, under <a href="https://policies.google.com/privacy">Google's privacy policy</a>. Data may be processed outside your country.</li>
			<li><strong>Opting out:</strong> press Decline, or use a content blocker, your browser's tracking protection, or the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a>.</li>
		</ul>

		<h2>Playground share links</h2>
		<p>
			The <a href="/playground/">playground</a> runs in your browser; the Mermaid you type is not sent to this site. A share link, however,
			stores your source in the address (<code>?s=…</code>). Anyone who has the link can read it, and because analytics records page
			addresses, opening a share link sends that source to Google Analytics. Do not put secrets or internal names into a diagram you share.
		</p>

		<h2>Fonts</h2>
		<p>
			Fonts are loaded from Fontshare (<code>api.fontshare.com</code>, <code>cdn.fontshare.com</code>), run by the Indian Type Foundry. Your
			browser contacts them directly, so they receive your IP address and browser details. See the
			<a href="https://www.fontshare.com/terms">Fontshare terms</a>.
		</p>

		<h2>Hosting</h2>
		<p>
			The site is served by Cloudflare Pages. Cloudflare processes requests and keeps technical logs (such as IP address, requested
			address and browser) to run and secure the service, under <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy policy</a>.
		</p>

		<h2>Stored in your browser</h2>
		<p>These stay on your device and are never sent anywhere by this site:</p>
		<ul>
			<li><code>theme</code>: your light or dark choice.</li>
			<li><code>pm</code>: your preferred package manager for install snippets.</li>
			<li><code>pa-consent</code>: your cookie choice (accepted or declined).</li>
		</ul>
		<p>Clear them any time in your browser's site settings. Copy buttons use your clipboard only when you click them.</p>

		<h2>Links to other sites</h2>
		<p>
			Links to GitHub, npm and other sites are governed by their own policies. The pele-animate package itself runs in the browser and
			collects nothing.
		</p>

		<h2>Your rights and contact</h2>
		<p>
			Depending on where you live (for example under the GDPR or Korea's PIPA) you may be able to ask what is held about you or have it
			deleted. Analytics data is anonymous and tied only to a browser cookie, so clearing cookies is the practical way to reset it. For
			anything else, open an issue at <a href="https://github.com/dkdev24/pele-animate/issues">github.com/dkdev24/pele-animate</a>.
		</p>
		<p>Changes to this page are listed in the repository history.</p>
	</article>
</div>

<style>
	article { max-width: 72ch; padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
	.meta { color: var(--color-muted); font-size: var(--text-sm); margin-top: 0; }
</style>
