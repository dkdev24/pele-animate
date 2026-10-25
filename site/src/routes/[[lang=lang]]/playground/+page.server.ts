import { getExamples } from '#lib/server/docs';

export const prerender = true;
export const load = async ({ params }) => {
	const en = await getExamples();
	// the default diagram is the English "Icons" example in both languages
	return { examples: await getExamples(params.lang ? 'ko' : 'en'), defaultSrc: en.find((e) => e.label.startsWith('Icons'))?.src ?? en[0]?.src };
};
