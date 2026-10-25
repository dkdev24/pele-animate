import { getDocs } from '#lib/server/docs';
import { SITE } from '#lib/site';

export const prerender = true;
export const GET = async () => {
	const paths = ['/', '/icons/', '/playground/', '/changelog/', '/privacy/', ...(await getDocs()).map((d) => `/docs/${d.slug}/`)];
	// every page exists in English (root) and Korean (/ko/); each entry names both so search engines pair them
	const entry = (p: string, lang: '' | '/ko') =>
		`<url><loc>${SITE}${lang}${p}</loc><xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/><xhtml:link rel="alternate" hreflang="ko" href="${SITE}/ko${p}"/></url>`;
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths.flatMap((p) => [entry(p, ''), entry(p, '/ko')]).join('\n')}\n</urlset>\n`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
