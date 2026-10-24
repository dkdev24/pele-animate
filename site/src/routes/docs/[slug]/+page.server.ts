import { error } from '@sveltejs/kit';
import { getDocs } from '#lib/server/docs';

export const entries = async () => (await getDocs()).map((d) => ({ slug: d.slug }));

export const load = async ({ params }) => {
	const docs = await getDocs();
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
