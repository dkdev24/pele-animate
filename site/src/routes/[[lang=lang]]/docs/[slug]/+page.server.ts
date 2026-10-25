import { error } from '@sveltejs/kit';
import { getDocs } from '#lib/server/docs';

export const entries = async () => (await getDocs()).flatMap((d) => [{ slug: d.slug }, { slug: d.slug, lang: 'ko' }]);

export const load = async ({ params }) => {
	const lang = params.lang ? 'ko' : 'en';
	const docs = await getDocs(lang);
	const i = docs.findIndex((d) => d.slug === params.slug);
	if (i < 0) error(404, 'Not found');
	const { markdown, ...doc } = docs[i];
	const pick = (d?: (typeof docs)[number]) => (d ? { slug: d.slug, title: d.title } : null);
	return {
		doc,
		prev: pick(docs[i - 1]),
		next: pick(docs[i + 1]),
		nav: docs.map(({ slug, title, section }) => ({ slug, title, section }))
	};
};
