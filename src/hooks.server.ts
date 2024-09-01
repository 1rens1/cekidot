import type { Handle } from '@sveltejs/kit';
import { themes } from './lib/utils';

export const handle: Handle = async ({ event, resolve }) => {
	let theme: string | null = null;

	const newTheme = event.url.searchParams.get('theme');
	const cookieTheme = event.cookies.get('colortheme');

	if (newTheme && themes.includes(newTheme)) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
		});
	}

	return await resolve(event);
};
