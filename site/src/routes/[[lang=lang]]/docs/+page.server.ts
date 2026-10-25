import { redirect } from '@sveltejs/kit';
import { prefix } from '#lib/i18n';
export const load = ({ params }) => redirect(308, `${prefix(params.lang ? 'ko' : 'en')}/docs/getting-started/`);
