import { isValidUrl } from '$lib/utils.js';
import { json, text } from '@sveltejs/kit';

export const POST = async ({ request, fetch }) => {
	try {
		const { url: targetUrl } = await request.json();

		if (!isValidUrl(targetUrl)) return json({ success: false, message: 'Invalid url' });

		const req = await fetch(
			`https://v1.screenshot.11ty.dev/${encodeURIComponent(targetUrl)}/medium`
		);

		return req;
	} catch (e) {
		return text(`An unexpected error occured, ${JSON.stringify(e)}`);
	}
};
