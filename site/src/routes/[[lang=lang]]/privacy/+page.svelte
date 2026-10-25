<script lang="ts">
	import { page } from '$app/state';
	import { langOf, prefix } from '#lib/i18n';
	const ko = $derived(langOf(page.url.pathname) === 'ko');
	const px = $derived(prefix(ko ? 'ko' : 'en'));
	// Forget the choice so the banner asks again (a reload also drops an already-loaded tag).
	const reset = () => {
		try { localStorage.removeItem('pa-consent'); } catch {}
		location.reload();
	};
</script>

<svelte:head>
	<title>{ko ? '개인정보 처리' : 'Privacy'} · pele-animate</title>
	<meta name="description" content={ko ? 'pele-animate 웹사이트가 수집하는 정보: Google Analytics, 글꼴, 호스팅 로그, 그리고 브라우저에만 저장되는 항목을 안내합니다.' : 'What the pele-animate website collects: Google Analytics, fonts, hosting logs and what stays in your browser.'} />
</svelte:head>

<div class="wrap">
	<article>
		{#if ko}
		<h1>개인정보 처리</h1>
		<p class="meta">최종 수정 2026-10-25</p>
		<p>
			이 사이트는 Daniel Kim(<a href="https://github.com/dkdev24">dkdev24</a>)이 운영하는 개인 오픈소스 프로젝트입니다. 계정, 입력 양식, 댓글, 광고가 없으며
			데이터를 판매하지 않습니다. 이 페이지에서는 어떤 정보를 누가 수집하는지 안내합니다.
		</p>

		<h2>Google Analytics</h2>
		<p>
			어떤 페이지를 읽고 방문자가 어떤 경로로 들어오는지 파악하기 위해 Google Analytics 4를 사용합니다. 쿠키 배너에서 동의를 누른 뒤에만, 그리고 실제 운영 사이트에서만
			불러옵니다. 거부하시면 분석 태그를 불러오지 않고 분석용 쿠키도 저장하지 않습니다. 동의한 뒤에 거부로 바꾸면 다음 페이지부터 태그가 중단되며, 이미 저장된 쿠키는 만료될 때까지 남습니다.
		</p>
		<p><button class="btn" type="button" onclick={reset}>쿠키 설정 변경</button></p>
		<ul>
			<li><strong>수집 항목:</strong> 조회한 페이지 주소(쿼리 문자열 포함), 유입 경로, 대략적인 위치, 브라우저, 기기와 화면 크기, 언어, 외부 링크 클릭과 스크롤 같은 상호작용 이벤트입니다.</li>
			<li><strong>쿠키:</strong> <code>_ga</code>와 <code>_ga_</code>로 시작하는 쿠키가 하나 더 저장되며, 재방문 시 브라우저를 익명으로 구분하는 데 쓰입니다.</li>
			<li><strong>IP 주소:</strong> Google Analytics 4는 IP 주소를 기록하거나 저장하지 않으며, 태그를 전달하는 요청 과정에서 Google이 IP 주소를 받습니다.</li>
			<li><strong>처리 업체:</strong> Google이며, <a href="https://policies.google.com/privacy">Google 개인정보처리방침</a>이 적용됩니다. 데이터는 거주 국가 밖에서 처리될 수 있습니다.</li>
			<li><strong>수집 거부:</strong> 배너에서 거부를 누르거나, 콘텐츠 차단기, 브라우저의 추적 방지 기능, <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics 선택 해제 부가기능</a>을 사용하시면 됩니다.</li>
		</ul>

		<h2>플레이그라운드 공유 링크</h2>
		<p>
			<a href="{px}/playground/">플레이그라운드</a>는 브라우저에서 실행되므로 입력한 Mermaid가 이 사이트로 전송되지 않습니다. 다만 공유 링크는 소스를 주소(<code>?s=…</code>)에 담습니다.
			링크를 가진 사람은 누구나 소스를 읽을 수 있고, 분석 도구가 페이지 주소를 기록하기 때문에 공유 링크를 열면 그 소스가 Google Analytics로 전송됩니다.
			공유할 다이어그램에는 비밀 정보나 내부 명칭을 넣지 않으시기 바랍니다.
		</p>

		<h2>글꼴</h2>
		<p>
			글꼴은 Indian Type Foundry가 운영하는 Fontshare(<code>api.fontshare.com</code>, <code>cdn.fontshare.com</code>)에서 불러옵니다. 브라우저가 해당 서버에 직접 접속하므로
			IP 주소와 브라우저 정보가 전달됩니다. 자세한 내용은 <a href="https://www.fontshare.com/terms">Fontshare 약관</a>을 참고하시기 바랍니다.
		</p>

		<h2>호스팅</h2>
		<p>
			사이트는 Cloudflare Pages로 제공됩니다. Cloudflare는 서비스를 운영하고 보호하기 위해 요청을 처리하며 IP 주소, 요청 주소, 브라우저 같은 기술 로그를 보관합니다.
			이는 <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare 개인정보처리방침</a>에 따릅니다.
		</p>

		<h2>브라우저에 저장되는 항목</h2>
		<p>다음 항목은 사용자의 기기에만 저장되며, 이 사이트가 어디에도 전송하지 않습니다.</p>
		<ul>
			<li><code>theme</code>: 라이트 또는 다크 테마 선택</li>
			<li><code>pm</code>: 설치 코드에서 선택한 패키지 매니저</li>
			<li><code>pa-consent</code>: 쿠키 동의 여부(동의 또는 거부)</li>
		</ul>
		<p>브라우저의 사이트 설정에서 언제든 삭제할 수 있습니다. 복사 버튼은 직접 클릭했을 때만 클립보드를 사용합니다.</p>

		<h2>다른 사이트로의 링크</h2>
		<p>
			GitHub, npm 등 다른 사이트로 연결되는 링크는 각 사이트의 정책을 따릅니다. pele-animate 패키지 자체는 브라우저에서 실행되며 아무것도 수집하지 않습니다.
		</p>

		<h2>이용자의 권리와 문의</h2>
		<p>
			거주 지역에 따라(GDPR, 한국의 개인정보 보호법 등) 보유 중인 정보의 열람이나 삭제를 요청할 수 있습니다. 분석 데이터는 익명이며 브라우저 쿠키에만 연결되어 있으므로,
			쿠키를 삭제하면 초기화됩니다. 그 밖의 문의는 <a href="https://github.com/dkdev24/pele-animate/issues">github.com/dkdev24/pele-animate</a>에 이슈로 남겨 주시기 바랍니다.
		</p>
		<p>이 페이지의 변경 내역은 저장소 기록에서 확인할 수 있습니다.</p>
		{:else}
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
			The <a href="{px}/playground/">playground</a> runs in your browser; the Mermaid you type is not sent to this site. A share link, however,
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
		{/if}
	</article>
</div>

<style>
	article { max-width: 72ch; padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
	.meta { color: var(--color-muted); font-size: var(--text-sm); margin-top: 0; }
</style>
