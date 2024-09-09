import { isValidUrl } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	try {
		const targetUrl = url.searchParams.get('url');
		if (!targetUrl) return json({ success: false, message: 'Url param required' });
		if (!isValidUrl(targetUrl)) return json({ success: false, message: 'Invalid url' });

		const headRequest = fetch(targetUrl, { method: 'HEAD' });
		const getRequest = fetch(targetUrl, { method: 'GET' });

		const response = await Promise.race([headRequest, getRequest]);

		if (response.ok)
			return json({ success: true, message: 'Url exists', statusCode: response.status });
		else return json({ success: false, message: "Url doesn't exist", statusCode: response.status });
	} catch (e) {
		return json({ success: false, message: "An unexpected error occured", error: e });
	}
}
