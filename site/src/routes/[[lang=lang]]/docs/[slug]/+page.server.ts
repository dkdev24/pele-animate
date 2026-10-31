import { error } from '@sveltejs/kit';
import { getDocs } from '#lib/server/docs';

export const entries = async () => (await getDocs()).flatMap((d) => [{ slug: d.slug }, { slug: d.slug, lang: 'ko' }]);

// FAQPage JSON-LD from the curated Q&A format: one paragraph per entry, starting with **Question**
function faqPairs(markdown: string) {
	const pairs: { question: string; answer: string }[] = [];
	const body = markdown.replace(/^---[\s\S]*?---\s*/, '');
	for (const para of body.split(/\n{2,}/)) {
		const m = para.replace(/\n/g, ' ').match(/^\*\*(.+?)\*\*\s+([\s\S]+)$/);
		if (m) pairs.push({ question: m[1].trim(), answer: m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim() });
	}
	return pairs;
}

export const load = async ({ params }) => {
	const lang = params.lang ? 'ko' : 'en';
	const docs = await getDocs(lang);
	const i = docs.findIndex((d) => d.slug === params.slug);
	if (i < 0) error(404, 'Not found');
	const { markdown, ...doc } = docs[i];
	const pick = (d?: (typeof docs)[number]) => (d ? { slug: d.slug, title: d.title } : null);
	const faqJsonLd =
		params.slug === 'faq'
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqPairs(markdown).map((p) => ({
						'@type': 'Question',
						name: p.question,
						acceptedAnswer: { '@type': 'Answer', text: p.answer }
					}))
				}
			: null;
	return {
		doc,
		prev: pick(docs[i - 1]),
		next: pick(docs[i + 1]),
		nav: docs.map(({ slug, title, section }) => ({ slug, title, section })),
		faqJsonLd
	};
};
