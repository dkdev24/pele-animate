import { getDocs } from '#lib/server/docs';
import { SITE } from '#lib/site';

export const prerender = true;
export const GET = async () => {
	const paths = ['/', '/icons/', '/playground/', '/changelog/', '/privacy/', ...(await getDocs()).map((d) => `/docs/${d.slug}/`)];
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `<url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`;
	return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
