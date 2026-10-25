// Run after `vite build` (it is part of `pnpm build`): internal links, Markdown siblings, agent files, first-load JS budget.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const BUILD = 'build';
const DOCS = '../docs';
const FIRST_LOAD_BUDGET_KB = 130; // raw, minified JS referenced by a page before any diagram loads; Pele must not be in it
const problems = [];
const fail = (m) => problems.push(m);

const htmlFiles = [];
(function walk(d) {
	for (const f of readdirSync(d)) {
		const p = join(d, f);
		statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmlFiles.push(p);
	}
})(BUILD);

const resolveTarget = (file, ref) => {
	const t = ref.startsWith('/') ? join(BUILD, ref) : resolve(dirname(file), ref);
	return ref.endsWith('/') || (existsSync(t) && statSync(t).isDirectory()) ? join(t, 'index.html') : t;
};

for (const file of htmlFiles) {
	if (file.endsWith('404.html')) continue;
	const html = readFileSync(file, 'utf8');
	for (const [, ref] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
		const clean = ref.split('#')[0].split('?')[0];
		if (!clean || /^(https?:|mailto:|data:|\/\/)/.test(clean)) continue;
		if (!existsSync(resolveTarget(file, clean))) fail(`${file}: broken link ${ref}`);
	}
}

const slugs = readdirSync(DOCS).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const llms = existsSync(join(BUILD, 'llms.txt')) ? readFileSync(join(BUILD, 'llms.txt'), 'utf8') : '';
const sitemap = existsSync(join(BUILD, 'sitemap.xml')) ? readFileSync(join(BUILD, 'sitemap.xml'), 'utf8') : '';
for (const s of slugs) {
	if (!existsSync(join(BUILD, 'docs', s, 'index.html'))) fail(`docs/${s}.md has no page`);
	if (!existsSync(join(BUILD, 'docs', `${s}.md`))) fail(`docs/${s}.md has no Markdown sibling`);
	if (!llms.includes(`/docs/${s}.md`)) fail(`llms.txt misses ${s}`);
	if (!sitemap.includes(`/docs/${s}/`)) fail(`sitemap.xml misses ${s}`);
}
const slugsKo = existsSync(join(DOCS, 'ko')) ? readdirSync(join(DOCS, 'ko')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')) : [];
for (const s of slugs) if (!slugsKo.includes(s)) fail(`docs/ko/${s}.md is missing (every English page needs a Korean one)`);
for (const s of slugsKo) {
	if (!existsSync(join(BUILD, 'ko', 'docs', s, 'index.html'))) fail(`docs/ko/${s}.md has no page`);
	if (!existsSync(join(BUILD, 'ko', 'docs', `${s}.md`))) fail(`docs/ko/${s}.md has no Markdown sibling`);
	if (!sitemap.includes(`/ko/docs/${s}/`)) fail(`sitemap.xml misses ko/${s}`);
}
for (const f of ['ko/index.html', 'ko/icons/index.html', 'ko/playground/index.html', 'ko/changelog/index.html', 'ko/privacy/index.html']) if (!existsSync(join(BUILD, f))) fail(`missing ${f}`);
for (const f of ['llms-full.txt', 'changelog.xml', 'robots.txt']) if (!existsSync(join(BUILD, f))) fail(`missing ${f}`);

const firstLoad = (page) => {
	const html = readFileSync(join(BUILD, page), 'utf8');
	const files = [...new Set([...html.matchAll(/_app\/immutable\/[^"' )]+\.js/g)].map((m) => m[0]))];
	let bytes = 0;
	for (const f of files) {
		const src = readFileSync(join(BUILD, f), 'utf8');
		bytes += Buffer.byteLength(src);
		if (src.includes('pele-node')) fail(`${page}: Pele is in the first-load JS (${f}); it must load lazily`);
	}
	return Math.round(bytes / 1024);
};
const sizes = { 'index.html': firstLoad('index.html'), 'docs/getting-started/index.html': firstLoad('docs/getting-started/index.html') };
for (const [page, kb] of Object.entries(sizes)) if (kb > FIRST_LOAD_BUDGET_KB) fail(`${page}: first-load JS ${kb} KB over ${FIRST_LOAD_BUDGET_KB} KB`);

console.log(`site check: ${htmlFiles.length} pages, ${slugs.length} docs, first-load JS ${JSON.stringify(sizes)} KB (budget ${FIRST_LOAD_BUDGET_KB}), ${problems.length} problem(s)`);
for (const p of problems) console.error('FAIL', p);
process.exit(problems.length ? 1 : 0);
