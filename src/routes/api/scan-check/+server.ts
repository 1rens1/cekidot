import { HYBRIDANALISIS_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, fetch }) => {
	try {
		const { id } = await request.json();

		const req = await fetch(`https://www.hybrid-analysis.com/api/v2/quick-scan/${id}`, {
			method: 'GET',
			headers: {
				'api-key': HYBRIDANALISIS_API_KEY,
				accept: 'application/json'
			}
		});

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
		return json(
			{ success: false, message: 'An unexpected error occured', error: e },
			{ status: 500 }
		);
	}
};
