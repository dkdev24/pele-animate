import { renderChangelog } from '#lib/server/docs';
export const load = async () => ({ html: (await renderChangelog()).html });
