// Server-only: reads ../docs/*.md and ../CHANGELOG.md at build time. The docs are the single source (see ../../../../SITE_DEV_PLAN.md §4).
import matter from 'gray-matter';
import { Marked, type Token, type Tokens } from 'marked';
import { createHighlighter } from 'shiki';
import { encodeSource } from '../share';
import { prefix, tr, type Lang } from '../i18n';
import changelogRaw from '../../../../CHANGELOG.md?raw';

const files = import.meta.glob('../../../../docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const filesKo = import.meta.glob('../../../../docs/ko/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
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
	themes: ['github-light-high-contrast', 'github-dark-high-contrast'],
	langs: ['js', 'ts', 'sh', 'css', 'json', 'html', 'astro', 'svelte', 'md', 'mermaid']
});
const loaded = new Set(highlighter.getLoadedLanguages());
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

function highlight(text: string, lang: string) {
	return highlighter.codeToHtml(text, {
		lang: loaded.has(lang) ? lang : 'text',
		themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
		defaultColor: false
	});
}

export async function render(markdown: string, ui: Lang = 'en') {
	const tx = tr(ui);
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
				const url = m ? `${prefix(ui)}/docs/${m[1]}/${m[2] ?? ''}` : href;
				const ext = /^https?:/.test(url) ? ' rel="noopener"' : '';
				return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ''}${ext}>${this.parser.parseInline(tokens)}</a>`;
			}
		}
	});
	const tokens = md.lexer(markdown);
	for (const t of tokens as (Token & Tokens.Code)[]) {
		if (t.type !== 'code') continue;
		const [fence, ...meta] = (t.lang ?? '').split(/\s+/);
		// `mermaid-icons` = a Mermaid diagram with @{ icon } nodes: GitHub cannot draw those (it shows "?" boxes), so on GitHub it is
		// plain source; the site animates it like `mermaid`.
		const lang = fence.replace(/-icons$/, '');
		let html = highlight(t.text, lang);
		if (lang === 'mermaid' && meta.includes('live')) {
			for (const [, a, b] of t.text.matchAll(/icon:\s*"([^"]+)"|^\s*(?:service|group)\s+[\w-]+\(([\w-]+)\)/gm)) {
				const name = a ?? b;
				const cat = name.startsWith('doverunner-') ? 'preset' : categoryOf.get(name);
				if (cat) categories.add(cat);
			}
			html = `<div class="live" data-src="${esc(t.text)}"></div><p class="pg"><a href="${prefix(ui)}/playground/?s=${encodeSource(t.text)}">${tx('openPlayground')}</a></p><details class="src"><summary>${tx('mermaidSource')}</summary>${html}</details>`;
		}
		Object.assign(t, { type: 'html', raw: t.raw, text: html, pre: false });
	}
	return { html: md.parser(tokens), headings, categories: [...categories] };
}

export async function getDocs(lang: Lang = 'en'): Promise<Doc[]> {
	const docs = await Promise.all(
		Object.entries(lang === 'ko' ? filesKo : files).map(async ([path, raw]) => {
			const { data, content } = matter(raw);
			const r = await render(content, lang);
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
export const renderChangelog = (lang: Lang = 'en') => render(changelogRaw.replace(/^# Changelog\n/, ''), lang);

// Every `live` diagram in the docs, for the playground's examples menu. The label is the fence's `title="..."`; `group` is the doc page.
export async function getExamples(lang: Lang = 'en') {
	const out: { label: string; group: string; src: string }[] = [];
	for (const d of await getDocs(lang)) {
		for (const t of marked.lexer(d.markdown)) {
			const m = t.type === 'code' && /^mermaid(?:-icons)?\s+live\b(?:\s+title="([^"]*)")?/.exec(t.lang ?? '');
			if (m) out.push({ label: m[1] ?? d.title, group: d.title, src: t.text });
		}
	}
	return out;
}
const marked = new Marked();
