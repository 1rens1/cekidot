import { isValidUrl } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	try {
		const targetUrl = url.searchParams.get('url');
		if (!targetUrl) return json({ success: false, message: 'Url param required' });
		if (!isValidUrl(targetUrl)) return json({ success: false, message: 'Invalid url' });

        
	} catch (e) {
		return json({ success: false, message: 'An unexpected error occured', error: e });
	}
}
