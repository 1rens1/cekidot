import { isValidUrl } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		if (!isValidUrl(params.url)) {
			throw Error();
		}
		const request = await fetch('/api/existance?' + new URLSearchParams({ url: params.url }));
		const response = await request.json();
		if (!response.success) {
			throw Error();
		}
	} catch {
		redirect(307, '/');
	}
};
