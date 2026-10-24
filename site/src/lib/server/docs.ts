// Server-only: reads ../docs/*.md and ../CHANGELOG.md at build time. The docs are the single source (see ../../../../SITE_DEV_PLAN.md §4).
import matter from 'gray-matter';
import { Marked, type Token, type Tokens } from 'marked';
import { createHighlighter } from 'shiki';
import changelogRaw from '../../../../CHANGELOG.md?raw';

const files = import.meta.glob('../../../../docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const packs = import.meta.glob('../../../../tabler/*.js', { eager: true }) as Record<string, { pack: Record<string, string> }>;

// icon name -> Tabler category module (e.g. "server" -> "devices"); doverunner-* live in the preset
const categoryOf = new Map<string, string>();
for (const [path, m] of Object.entries(packs)) {
	const cat = path.split('/').pop()!.replace(/\.js$/, '');
	for (const name of Object.keys(m.pack)) categoryOf.set(name, cat);
}

export type Doc = {
	slug: string; title: string; description: string; order: number; section: string;
	html: string; markdown: string; headings: { id: string; text: string; depth: number }[]; categories: string[];
};

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['js', 'ts', 'sh', 'css', 'json', 'html', 'astro', 'svelte', 'md', 'mermaid']
});
const loaded = new Set(highlighter.getLoadedLanguages());
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function highlight(text: string, lang: string) {
	return highlighter.codeToHtml(text, {
		lang: loaded.has(lang) ? lang : 'text',
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false
	});
}

export async function render(markdown: string) {
	const headings: Doc['headings'] = [];
	const categories = new Set<string>();
	const md = new Marked({
		renderer: {
			heading({ tokens, depth }) {
				const text = this.parser.parseInline(tokens);
				const id = slugify(text);
				if (depth === 2 || depth === 3) headings.push({ id, text: text.replace(/<[^>]+>/g, ''), depth });
				return `<h${depth} id="${id}">${text}</h${depth}>\n`;
			},
			// ./icons.md  ->  /docs/icons/   (relative .md links keep working on GitHub)
			link({ href, title, tokens }) {
				const m = href.match(/^\.\/([\w-]+)\.md(#.*)?$/);
				const url = m ? `/docs/${m[1]}/${m[2] ?? ''}` : href;
				const ext = /^https?:/.test(url) ? ' rel="noopener"' : '';
				return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ''}${ext}>${this.parser.parseInline(tokens)}</a>`;
			}
		}
	});
	const tokens = md.lexer(markdown);
	for (const t of tokens as (Token & Tokens.Code)[]) {
		if (t.type !== 'code') continue;
		const [lang, ...meta] = (t.lang ?? '').split(/\s+/);
		let html = highlight(t.text, lang);
		if (lang === 'mermaid' && meta.includes('live')) {
			for (const [, name] of t.text.matchAll(/icon:\s*"([^"]+)"/g)) {
				const cat = name.startsWith('doverunner-') ? 'preset' : categoryOf.get(name);
				if (cat) categories.add(cat);
			}
			html = `<div class="live" data-src="${esc(t.text)}"></div><details class="src"><summary>Mermaid source</summary>${html}</details>`;
		}
		Object.assign(t, { type: 'html', raw: t.raw, text: html, pre: false });
	}
	return { html: md.parser(tokens), headings, categories: [...categories] };
}

export async function getDocs(): Promise<Doc[]> {
	const docs = await Promise.all(
		Object.entries(files).map(async ([path, raw]) => {
			const { data, content } = matter(raw);
			const r = await render(content);
			return {
				slug: path.split('/').pop()!.replace(/\.md$/, ''),
				title: String(data.title), description: String(data.description ?? ''), order: Number(data.order), section: String(data.section ?? ''),
				markdown: content.trim() + '\n', ...r
			} satisfies Doc;
		})
	);
	return docs.sort((a, b) => a.order - b.order);
}

export const changelogMarkdown = changelogRaw;
export const renderChangelog = () => render(changelogRaw.replace(/^# Changelog\n/, ''));
