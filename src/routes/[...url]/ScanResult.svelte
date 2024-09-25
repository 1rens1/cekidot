<script lang="ts">
	import HybridAnalisisLogo from '$lib/components/HybridAnalisisLogo.svelte';
	import { addToast, scanScore } from '$lib/stores';
	import TablerLoader2 from '~icons/tabler/loader-2';

	export let url: string;

	let scanners: { name: string; status: string }[] = [];
	let generalScore = '. . .';

	const updateScanners = () => {
		scanners = [];
		if (!scanResponse) return;

		(scanResponse.scanners as any[]).forEach(
			(s) => (scanners = [...scanners, { name: s.name, status: s.status }])
		);
		Object.keys(scanResponse.scanners_v2 as { [key: string]: null | object }).forEach(
			(s) =>
				scanResponse.scanners_v2[s] &&
				(scanners = [
					...scanners,
					{ name: scanResponse.scanners_v2[s].name, status: scanResponse.scanners_v2[s].status }
				])
		);

		const statusPriority = ['malicious', 'suspicious', 'clean'];
		let highestStatus: string | null = null;

		scanners.forEach(({ status }) => {
			// Ignore statuses like 'no-classification', 'pending', 'no-status'
			if (statusPriority.includes(status)) {
				// Check if current status has higher priority
				if (
					!highestStatus ||
					statusPriority.indexOf(status) < statusPriority.indexOf(highestStatus)
				) {
					highestStatus = status;
				}
			}
		});

		// Only set generalScore if we found a relevant status
		if (highestStatus) {
			generalScore = highestStatus;
		} else {
			generalScore = '. . .'; // Or leave unchanged if you prefer
		}
	};

	let scanResponse: any | undefined;
	const refetch = async (_url: string) => {
		const req = await fetch('/api/scan-check', {
			method: 'POST',
			body: JSON.stringify({ id: scanResponse.id })
		});

		const res = await req.json();

		if (res.success && req.ok) {
			scanResponse = res.data;
			updateScanners();
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
		generalScore = '. . .';
		$scanScore = 100;
		scanResponse = undefined;
		const req = await fetch('/api/scan', { method: 'POST', body: JSON.stringify({ url }) });

		req.json().then(async (res) => {
			if (res.success && req.ok) {
				scanResponse = res.data;
				updateScanners();
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

	const updateScanScore = (..._: any[]) => {
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
		updateScanScore(scanResponse, url);
</script>

<div class="box">
	<div class="gs-container">
		<div data-score={generalScore} class="general-score">
			{generalScore}
		</div>
	</div>
	<ul>
		{#if scanResponse && scanners.length > 0}
			{#each scanners as scanner}
				<li>
					<span class="name">{scanner.name}</span>:
					{#if scanner.status === 'in-queue'}
						<TablerLoader2 class="spinner" />
					{:else}
						<span class="status" data-status={scanner.status}>{scanner.status}</span>
					{/if}
				</li>
			{/each}
		{:else}
			<div class="skeleton" style="max-width: 200px; height: 18px; margin-bottom: 5px;"></div>
			<div class="skeleton" style="max-width: 220px; height: 18px; margin-bottom: 5px;"></div>
			<div class="skeleton" style="max-width: 150px; height: 18px; margin-bottom: 5px;"></div>
			<div class="skeleton" style="max-width: 280px; height: 18px; margin-bottom: 5px;"></div>
			<div class="skeleton" style="max-width: 250px; height: 18px; margin-bottom: 5px;"></div>
			<div class="skeleton" style="max-width: 190px; height: 18px; margin-bottom: 5px;"></div>
		{/if}
	</ul>
	<div class="ha-logo">
		<a
			href="https://www.hybrid-analysis.com/sample/{scanResponse?.sha256}"
			target="_blank"
			rel="noopener noreferrer"
			style="color: currentColor;"
		>
			<HybridAnalisisLogo />
		</a>
	</div>
</div>

<style lang="scss">
	@import 'vars';
	.box {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		@include is-mobile {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
		.gs-container {
			grid-area: 1 / 2 / 2 / 3;
			display: flex;
			justify-content: end;
			align-items: start;
			@include is-mobile {
				justify-content: center;
				align-items: center;
			}
		}
		.general-score {
			padding: 12px 16px;
			border-radius: 8px;
			font-size: 28px;
			font-weight: 600;
			background-color: #555;
			color: #fff;
			user-select: none;

			&[data-score='clean'] {
				background-color: #42d95e !important;
			}
			&[data-score='suspicious'] {
				background-color: #fac823 !important;
			}
			&[data-score='malicious'] {
				background-color: #df1627 !important;
			}
		}
		.ha-logo {
			grid-area: 2 / 2 / 3 / 3;
			display: flex;
			align-items: end;
			justify-content: end;
			:global(svg) {
				width: 512px * 0.3;
				height: 123px * 0.3;
			}
		}
		ul {
			grid-area: 1 / 1 / 3 / 2;
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				font-size: 18px;
				.name {
					font-weight: 600;
				}
				:global(.spinner) {
					animation: spin 2s linear infinite;
					@keyframes spin {
						to {
							transform: rotate(360deg);
						}
					}
				}
				.status {
					color: #555;
					$root: &;
					@at-root {
						@include theme('dark') {
							#{$root} {
								color: #ccc;
							}
						}
					}
					&[data-status='clean'] {
						color: #42d95e !important;
					}
					&[data-status='suspicious'] {
						color: #fac823 !important;
					}
					&[data-status='malicious'] {
						color: #df1627 !important;
					}
				}
			}
		}
	}
</style>
