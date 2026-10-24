import { changelogMarkdown } from '#lib/server/docs';
import { SITE } from '#lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const prerender = true;
export const GET = () => {
	const items = [...changelogMarkdown.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})\n([\s\S]*?)(?=^## \[|^\[Unreleased\]:|(?![\s\S]))/gm)]
		.map(([, v, date, body]) => `<item><title>${v}</title><link>${SITE}/changelog/#${v.replace(/\./g, '')}</link><guid isPermaLink="false">pele-animate-${v}</guid><pubDate>${new Date(date + 'T12:00:00Z').toUTCString()}</pubDate><description>${esc(body.trim())}</description></item>`)
		.join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>pele-animate releases</title><link>${SITE}/changelog/</link><description>Release notes for pele-animate</description>\n${items}\n</channel></rss>\n`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
