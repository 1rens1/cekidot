<script lang="ts">
	import { addToast, scanScore } from '$lib/stores';

	export let url: string;

	let scanResponse: any | undefined;
	const refetch = async (_url: string) => {
		const req = await fetch('/api/scan-check', {
			method: 'POST',
			body: JSON.stringify({ id: scanResponse.id })
		});

		const res = await req.json();

		if (res.success && req.ok) {
			scanResponse = res.data;
			if (!scanResponse.finished && _url === url) {
				setTimeout(async () => {
					await refetch(_url);
					console.log('Refetching', res);
				}, 2000);
			}
		} else {
			addToast({ type: 'error', title: `${res.message} when scanning (${req.status})` });
			console.log('Scan error', res);
		}
	};
	const fetchScanResult = async (url: string) => {
		const req = await fetch('/api/scan', { method: 'POST', body: JSON.stringify({ url }) });

		req.json().then(async (res) => {
			if (res.success && req.ok) {
				scanResponse = res.data;
				if (!scanResponse.finished) {
					setTimeout(async () => {
						await refetch(url);
						console.log('Refetching', res);
					}, 2000);
				}
			} else {
				addToast({ type: 'error', title: `${res.message} when scanning (${req.status})` });
				console.log('Scan error', res);
			}
		});
	};

	$: if (typeof window !== 'undefined') fetchScanResult(url);

	const updateScanScore = (data: typeof scanResponse) => {
		let result = 100;
		let statuses: string[] = [];

		console.log(scanResponse);

		(scanResponse.scanners as any[]).forEach((s) => s && statuses.push(s.status));
		Object.keys(scanResponse.scanners_v2 as { [key: string]: null | object }).forEach(
			(s) => scanResponse.scanners_v2[s] && statuses.push(scanResponse.scanners_v2[s].status)
		);

		statuses.forEach((s) => {
			if (s.includes('suspicious')) result -= (1 / statuses.length) * 100 * 0.8 * 2;
			if (s.includes('malicious')) result -= (1 / statuses.length) * 100 * 1 * 2;
		});

		$scanScore = result;
	};
	$: if (typeof window !== 'undefined' && typeof scanResponse !== 'undefined')
		updateScanScore(scanResponse);
</script>

<div class="box">
	{$scanScore}
	<pre>

        {JSON.stringify(scanResponse, null, 4)}
    </pre>
</div>
