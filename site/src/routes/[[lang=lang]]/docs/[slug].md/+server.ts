import { error } from '@sveltejs/kit';
import { getDocs } from '#lib/server/docs';

export const prerender = true;
export const trailingSlash = 'never';
export const entries = async () => (await getDocs()).flatMap((d) => [{ slug: d.slug }, { slug: d.slug, lang: 'ko' }]);

// Every docs page is also served as Markdown, for agents and for "View as Markdown".
export const GET = async ({ params }) => {
	const doc = (await getDocs(params.lang ? 'ko' : 'en')).find((d) => d.slug === params.slug);
	if (!doc) error(404, 'Not found');
	return new Response(doc.markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
};
