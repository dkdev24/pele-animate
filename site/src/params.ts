import { defineParams } from '@sveltejs/kit/params';

// Route parameter matchers: `[[lang=lang]]` matches only the `ko` segment, so English stays at the root.
export const params = defineParams({ lang: (p) => (p === 'ko' ? p : undefined) });
