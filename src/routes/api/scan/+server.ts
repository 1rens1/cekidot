import { CORSANYWHERE_PROXY, HYBRIDANALISIS_API_KEY } from '$env/static/private';
import { isValidUrl } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const { url: targetUrl } = await request.json();

		if (!isValidUrl(targetUrl))
			return json({ success: false, message: 'Invalid url' }, { status: 400 });

		const formData = new FormData();
		formData.append('scan_type', 'all');
		formData.append('url', targetUrl);

		const req = await fetch(
			(CORSANYWHERE_PROXY ? CORSANYWHERE_PROXY : '') +
				`https://www.hybrid-analysis.com/api/v2/quick-scan/url`,
			{
				method: 'POST',
				headers: {
					'api-key': HYBRIDANALISIS_API_KEY,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				body: new URLSearchParams(formData as any).toString()
			}
		);

		const res = await req.json();

		if (req.ok)
			return json({
				success: true,
				data: res
			});
		else
			return json(
				{ success: false, message: 'An unexpected error occured', data: res },
				{ status: 400 }
			);
	} catch (e) {
		console.log(e);
		
		return json(
			{ success: false, message: 'An unexpected error occured', error: e },
			{ status: 500 }
		);
	}
};
