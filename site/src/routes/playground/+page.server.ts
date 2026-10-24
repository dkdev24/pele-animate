import { getExamples } from '#lib/server/docs';

export const prerender = true;
export const load = async () => ({ examples: await getExamples() });
