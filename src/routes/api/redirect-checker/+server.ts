import { isValidUrl } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	try {
		const targetUrl = url.searchParams.get('url');
		if (!targetUrl) return json({ success: false, message: 'Url param required' });
		if (!isValidUrl(targetUrl)) return json({ success: false, message: 'Invalid url' });

		const req = await fetch(
			`https://api.redirect-checker.net/?url=${encodeURIComponent(targetUrl)}&timeout=5&maxhops=10&meta-refresh=1&format=json`
		);

		const res = await req.json();

		if (res.result === 'success') {
			const redirects = res.data;
			const finalResponse = redirects[redirects.length - 1].response;
            if (!finalResponse) return json({ success: true, isRedirect: false, finalUrl: null, message: 'No redirects because no response from url' });
			const finalResponseInfo = finalResponse.info;

			// Check if the final URL is significantly different
			const originalUrl = redirects[0].response.info.url;
			const finalUrl = finalResponseInfo.url;

			// Remove minor differences like 'www.' or trailing slashes
			const normalizeUrl = (url: string) =>
				url
					.replace(/(^\w+:|^)\/\//, '')
					.replace(/^www\./, '')
					.replace(/\/$/, '');

			if (normalizeUrl(originalUrl) !== normalizeUrl(finalUrl)) {
				return json({ success: true, isRedirect: true, finalUrl, message: 'Redirect found' });
			} else {
				return json({ success: true, isRedirect: false, finalUrl: null, message: 'Url is simlar' });
			}
		} else
			return json({
				success: false,
				message: "Result didn't succeed",
				data: res
			});
	} catch (e) {
		return json({ success: false, message: 'An unexpected error occured', error: e });
	}
}
