import { getDocs } from '#lib/server/docs';

export const prerender = true;
export const GET = async () => {
	const docs = await getDocs();
	return new Response(docs.map((d) => d.markdown).join('\n---\n\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
