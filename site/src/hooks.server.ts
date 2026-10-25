import type { Handle } from '@sveltejs/kit';
import { langOf } from '#lib/i18n';

// <html lang> follows the URL: /ko/... is Korean, everything else English.
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', langOf(event.url.pathname)) });
