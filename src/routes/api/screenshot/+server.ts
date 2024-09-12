import { isValidUrl } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, fetch }) => {
	try {
		const { url: targetUrl } = await request.json();

		if (!isValidUrl(targetUrl)) return json({ success: false, message: 'Invalid url' });

		const req = await fetch('/.netlify/functions/screenshot', {
			method: 'POST',
			body: JSON.stringify({ url: targetUrl })
		});

		return json(await req.json(), {
			headers: { 'Cache-Control': 'public, max-age=' + 60 * 60 * 24 }
		});
	} catch (e) {
		return json({ success: false, message: 'An unexpected error occured', error: e });
	}
};
