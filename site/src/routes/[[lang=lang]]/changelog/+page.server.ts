import { renderChangelog } from '#lib/server/docs';
export const load = async ({ params }) => ({ html: (await renderChangelog(params.lang ? 'ko' : 'en')).html });
