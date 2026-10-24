import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// docs/, tabler/ and CHANGELOG.md live at the repo root, one level above this package
	server: { fs: { allow: ['..'] } },
	plugins: [sveltekit({ adapter: adapter({ fallback: '404.html', strict: true }) })]
});
