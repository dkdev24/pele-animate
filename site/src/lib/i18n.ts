// English lives at the root, Korean under /ko/. The language comes from the URL, so prerendered pages, the 404 page and client navigation agree.
export type Lang = 'en' | 'ko';
export const langOf = (pathname: string): Lang => (/^\/ko(\/|$)/.test(pathname) ? 'ko' : 'en');
export const prefix = (lang: Lang) => (lang === 'ko' ? '/ko' : '');
/** The same page in the other language: /docs/icons/ <-> /ko/docs/icons/ */
export const swap = (pathname: string) => (langOf(pathname) === 'ko' ? pathname.replace(/^\/ko(?=\/|$)/, '') || '/' : `/ko${pathname}`);

type Dict = Record<string, string>;
const en: Dict = {
	skip: 'Skip to content', docs: 'Docs', icons: 'Icons', playground: 'Playground', changelog: 'Changelog', mainNav: 'Main', darkTheme: 'Dark theme',
	switchTo: '한국어', switchLabel: 'Read this page in Korean',
	footerBuilt: 'Built on', footerBy: 'by kepano (MIT). Unofficial add-on, not affiliated with or endorsed by the Pele or Obsidian teams. Icons from',
	footerLicense: 'pele-animate is MIT licensed.', footerSource: 'Source on GitHub', privacy: 'Privacy',
	copy: 'Copy to clipboard', copied: 'Copied',
	consentLabel: 'Cookie consent', consentText: 'This site uses Google Analytics cookies to see which pages are read, only if you accept.', decline: 'Decline', accept: 'Accept',
	docsMenu: 'Docs menu', onThisPage: 'On this page', prevNext: 'Previous and next page', prev: 'Previous', next: 'Next',
	edit: 'Edit this page on GitHub', viewMd: 'View as Markdown', openPlayground: 'Open in playground', mermaidSource: 'Mermaid source',
	pageTitle: 'pele-animate'
};
const ko: Dict = {
	skip: '본문으로 건너뛰기', docs: '문서', icons: '아이콘', playground: '플레이그라운드', changelog: '변경 내역', mainNav: '주 메뉴', darkTheme: '다크 테마',
	switchTo: 'English', switchLabel: '이 페이지를 영어로 보기',
	footerBuilt: '', footerBy: '',
	footerLicense: 'pele-animate는 MIT 라이선스로 배포됩니다.', footerSource: 'GitHub 소스', privacy: '개인정보 처리',
	copy: '클립보드에 복사', copied: '복사했습니다',
	consentLabel: '쿠키 동의', consentText: '이 사이트는 어떤 페이지를 읽는지 파악하기 위해 Google Analytics 쿠키를 사용하며, 동의하시는 경우에만 적용됩니다.', decline: '거부', accept: '동의',
	docsMenu: '문서 메뉴', onThisPage: '이 페이지의 목차', prevNext: '이전 페이지와 다음 페이지', prev: '이전', next: '다음',
	edit: 'GitHub에서 이 페이지 수정하기', viewMd: 'Markdown으로 보기', openPlayground: '플레이그라운드에서 열기', mermaidSource: 'Mermaid 소스',
	pageTitle: 'pele-animate'
};
export const dict = { en, ko };
export const tr = (lang: Lang) => (k: string) => dict[lang][k] ?? dict.en[k] ?? k;
