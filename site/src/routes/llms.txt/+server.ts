import { getDocs } from '#lib/server/docs';
import { SITE } from '#lib/site';

export const prerender = true;
export const GET = async () => {
	const docs = await getDocs();
	const ko = await getDocs('ko');
	const lines = docs.map((d) => `- [${d.title}](${SITE}/docs/${d.slug}.md): ${d.description}`);
	const text = `# pele-animate

> Step-by-step animated Mermaid diagrams with icons, as an unofficial add-on for the Pele renderer. You choose the order things appear in, readers step through it, nodes can carry icons. Flowcharts and sequence diagrams. Client-side only.

Every docs page is also served as Markdown at the URLs below. The whole documentation in one file: ${SITE}/llms-full.txt

## Docs

${lines.join('\n')}

## Korean docs

The same pages in Korean, written for Korean readers (not word-for-word translations), under /ko/.

${ko.map((d) => `- [${d.title}](${SITE}/ko/docs/${d.slug}.md): ${d.description}`).join('\n')}

## Optional

- [Playground](${SITE}/playground/): edit Mermaid and watch it animate; share links carry the source in ?s= (base64url).
- [Icon browser](${SITE}/icons/): search all bundled icons. The machine-readable list is ${SITE}/icons.json ({ version, icons: [{ name, category, tags }] }); take icon names from it, never from memory.
- [Changelog](${SITE}/changelog/)
- [Source](https://github.com/dkdev24/pele-animate)
- [npm](https://www.npmjs.com/package/pele-animate)
`;
	return new Response(text, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
