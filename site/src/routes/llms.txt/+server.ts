import { getDocs } from '#lib/server/docs';
import { SITE } from '#lib/site';

export const prerender = true;
export const GET = async () => {
	const docs = await getDocs();
	const lines = docs.map((d) => `- [${d.title}](${SITE}/docs/${d.slug}.md): ${d.description}`);
	const text = `# pele-animate

> Step-by-step animated Mermaid diagrams with icons, as an unofficial add-on for the Pele renderer. You choose the order things appear in, readers step through it, nodes can carry icons. Flowcharts and sequence diagrams. Client-side only.

Every docs page is also served as Markdown at the URLs below. The whole documentation in one file: ${SITE}/llms-full.txt

## Docs

${lines.join('\n')}

## Optional

- [Changelog](${SITE}/changelog/)
- [Source](https://github.com/dkdev24/pele-animate)
- [npm](https://www.npmjs.com/package/pele-animate)
`;
	return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
