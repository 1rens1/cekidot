import { redirect, type Actions } from '@sveltejs/kit';
import { themes } from '../lib/utils';

export const actions: Actions = {
	async setTheme({ url, cookies }) {
		const theme = url.searchParams.get('theme');
		const redirectTo = url.searchParams.get('redirectTo');

		if (theme && themes.includes(theme)) {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365 // a year
			});
		}

		throw redirect(303, redirectTo ?? '/');
	}
};
