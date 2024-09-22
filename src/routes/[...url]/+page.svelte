<script lang="ts">
	import { page } from '$app/stores';
	import CekidotLogo from '$lib/components/CekidotLogo.svelte';
	import UrlBar from '$lib/components/URLBar.svelte';
	import { addToast } from '$lib/stores';
	import { format } from 'date-fns';
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import TablerAlertTriangle from '~icons/tabler/alert-triangle';
	import TablerMail from '~icons/tabler/mail';
	import Screenshot from './Screenshot.svelte';
	import WhoDatFull from './WhoDatFull.svelte';

	$: urlPath = $page.params.url;
	$: url = new URL($page.params.url);

	interface ContactInfo {
		name: string;
		organization: string;
		street: string;
		city: string;
		province: string;
		postal_code: string;
		country: string;
		phone: string;
		phone_ext: string;
		fax: string;
		fax_ext: string;
		email: string;
	}

	interface Domain {
		id: string;
		domain: string;
		name: string;
		extension: string;
		whois_server: string;
		status: string[];
		name_servers: string[];
		created_date: string;
		updated_date: string;
		expiration_date: string;
	}

	interface WhoIsData {
		domain: Partial<Domain>;
		registrar: Partial<ContactInfo>;
		registrant: Partial<ContactInfo>;
		administrative: Partial<ContactInfo>;
		technichal: Partial<ContactInfo>;
		billing: Partial<ContactInfo>;
	}

	let whoIsData: Partial<WhoIsData> | undefined;

	$: if (typeof window !== 'undefined' && window) fetchWhoIsData(url.host);

	async function fetchWhoIsData(hostname: string) {
		if (!hostname) return;
		whoIsData = undefined;
		try {
			const request = await fetch('/api/who-dat?' + new URLSearchParams({ hostname }));
			const response = await request.json();
			if (!response.success) {
				addToast({ type: 'error', title: 'An unexpected error occurred' });
				console.error(response);
				return;
			}
			whoIsData = response.data;
		} catch (error) {
			addToast({ type: 'error', title: 'An unexpected error occured' });
			console.error(error);
		}
	}
</script>

<div class="wrapper">
	<header class="container" style="padding-bottom: 0;">
		<a href="/" class="logo">
			<CekidotLogo width={45 * 5} height={5 * 5} />
		</a>
		<div class="control">
			<UrlBar bind:value={urlPath} />
		</div>
	</header>
	<div class="container" style="padding-bottom: 0;">
		<h1 class="hostname">
			{#key url.hostname}
				<img src="https://favicone.com/{url.hostname}?s=32" alt={url.hostname} />
			{/key}
			{url.hostname}
		</h1>
	</div>
	<div class="container">
		<h2 class="legend">
			Who is <span style="color: var(--theme-secondary)">{url.hostname}</span>?
		</h2>
		<div class="section s1">
			<div class="box box-1">
				<div class="inner">
					{#if whoIsData}
						{#if whoIsData.domain}
							<h3 style="margin: 0;">
								<span style="font-weight: 600;">Domain:</span>
								{whoIsData.domain.domain}
							</h3>
							<div>Registered</div>
							<div style="margin-left: 1em;">
								<div>
									at
									{#if whoIsData.domain.created_date}
										{format(whoIsData.domain.created_date, 'PPP')} (<strong
											>{formatDistanceToNowStrict(whoIsData.domain.created_date)}</strong
										>)
									{:else}
										???
									{/if}
								</div>
								{#if whoIsData.registrar}
									<div>by {whoIsData.registrar.name || '???'}</div>
								{/if}
							</div>
						{/if}
						{#if whoIsData.registrant}
							<h3 style="margin: 0;margin-top: 0.5em;">
								<span style="font-weight: 600;">Organization:</span>
								{whoIsData.registrant.organization || '???'}
							</h3>
						{/if}
					{:else}
						<div
							class="skeleton"
							style="max-width: 400px; margin-bottom: 8px; font-size: 24px;"
						></div>
						<div
							class="skeleton"
							style="max-width: 250px; height: calc(1em-8px); margin-bottom: 8px;"
						></div>
						<div
							class="skeleton"
							style="max-width: 500px; height: calc(1em-8px); margin-bottom: 8px;"
						></div>
						<div
							class="skeleton"
							style="max-width: 500px; height: calc(1em-8px); margin-bottom: 8px;"
						></div>
						<div
							class="skeleton"
							style="max-width: 300px; margin-bottom: 8px; font-size: 24px;"
						></div>
					{/if}
				</div>
				{#if whoIsData}
					<WhoDatFull {whoIsData} />
				{/if}
			</div>
			<div class="box screenshot">
				<Screenshot url={urlPath} />
			</div>
		</div>
	</div>
	<div class="container">
		<div style="padding-top: 24px; display: flex; gap: 8px;">
			<div
				style="background-color: var(--theme-primary); color: var(--theme-background); padding: 24px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;"
			>
				<TablerAlertTriangle />
				Report Abuse to Domain Registrar
			</div>
			<div
				style="background-color: var(--theme-secondary); color: var(--theme-background); padding: 24px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;"
			>
				<TablerMail />
				Report Abuse Email
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@import 'vars';
	header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;

		.logo {
			padding: 8px;
		}

		.control {
			flex-grow: 1;
		}
	}
	.container {
		padding: 32px;
		max-width: 1200px;
		width: 100%;
		margin: auto;

		@include is-mobile {
			padding: 24px;
		}

		.legend {
			font-size: 32px;
			margin-top: 0;
			margin-bottom: 0.5em;
			color: color-mix(
				in srgb,
				var(--theme-text) 80%,
				color-mix(in srgb, var(--theme-primary) 50%, var(--theme-background)) 20%
			);
			@include is-mobile {
				font-size: 24px;
			}
		}
	}
	.hostname {
		margin: 0;
		font-size: 48px;
	}

	.box {
		border-radius: 32px;
		padding: 32px;
		border: 1px solid #777;
		position: relative;

		.legend {
		}
	}


	.screenshot {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.s1 {
		display: flex;
		gap: 32px;

		@include is-mobile {
			flex-direction: column;
		}
		> :first-child {
			flex-grow: 1;
		}
	}

	.box-1 {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 16px;
		.inner {
			flex-grow: 1;
		}
	}
</style>
