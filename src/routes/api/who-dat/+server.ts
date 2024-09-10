import { json } from '@sveltejs/kit';
import { parseDomain, ParseResultType } from 'parse-domain';

export async function GET({ url }) {
	try {
		const targetHostname = url.searchParams.get('hostname');
		if (!targetHostname)
			return json({ success: false, message: 'Hostname required' }, { status: 400 });

		const parsed = parseDomain(targetHostname);

		if (parsed.type !== ParseResultType.Listed)
			return json(
				{ success: false, message: 'Cannot parse domain from hostname: ' + targetHostname },
				{ status: 404 }
			);

		const domain = [parsed.icann.domain, ...parsed.icann.topLevelDomains].join(".");

		const request = await fetch('https://who-dat.as93.net/' + domain);

		if (!request.ok)
			return json(
				{ success: false, message: 'No whois server found for domain: ' + domain },
				{ status: 404 }
			);

		const response = await request.json();

		return json(
			{ success: true, data: response },
			{ headers: { 'Cache-Control': 'public, max-age=' + 60 * 60 * 24 } }
		);
	} catch (e) {
		return json(
			{ success: false, message: 'An unexpected error occured', error: e },
			{ status: 500 }
		);
	}
}
