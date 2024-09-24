<script lang="ts">
	import { page } from '$app/stores';
	import CekidotLogo from '$lib/components/CekidotLogo.svelte';
	import UrlBar from '$lib/components/URLBar.svelte';
	import { addToast, openFirstLink } from '$lib/stores';
	import { Tooltip } from 'bits-ui';
	import { format } from 'date-fns';
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import { differenceInYears } from 'date-fns/fp';
	import { fade } from 'svelte/transition';
	import TablerAlertTriangle from '~icons/tabler/alert-triangle';
	import TablerMail from '~icons/tabler/mail';
	import TablerExternalLink from '~icons/tabler/external-link';
	import Screenshot from './Screenshot.svelte';
	import WhoDatFull from './WhoDatFull.svelte';
	import ScanResult from './ScanResult.svelte';

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
										{format(whoIsData.domain.created_date, 'PPP')}
										{#if differenceInYears(whoIsData.domain.created_date, new Date()) < 2}
											(<Tooltip.Root openDelay={0}
												><Tooltip.Trigger class="warning" style="font: inherit; border: none;"
													><TablerAlertTriangle style="vertical-align: middle;" />
													{formatDistanceToNowStrict(
														whoIsData.domain.created_date
													)}</Tooltip.Trigger
												><Tooltip.Content
													transition={fade}
													transitionConfig={{ duration: 100 }}
													class="tooltip-content"
													><Tooltip.Arrow class="tooltip-arrow" />
													<TablerAlertTriangle /> Newly registered domains have low reputation
												</Tooltip.Content></Tooltip.Root
											>)
										{:else}
											(<strong>{formatDistanceToNowStrict(whoIsData.domain.created_date)}</strong>)
										{/if}
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
		<ScanResult url={urlPath} />
	</div>
	<div class="container actions">
		<div style="padding-top: 24px; display: flex; gap: 8px;">
			<Tooltip.Root openDelay={0}>
				<Tooltip.Trigger asChild let:builder>
					<a
						use:builder.action
						{...builder}
						style="background-color: var(--theme-primary); "
						href="https://google.com/search?q={encodeURIComponent(
							(whoIsData?.registrar?.name || whoIsData?.registrar?.organization) + ' report abuse'
						)}{$openFirstLink ? '&btnI' : ''}"
						target="_blank"
					>
						<TablerAlertTriangle />
						Report Abuse to Domain Registrar
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content
					class="tooltip-content"
					transition={fade}
					transitionConfig={{ duration: 100 }}
				>
					<Tooltip.Arrow class="tooltip-arrow" />
					<img
						src="/assets/google-g.svg"
						width="18px"
						height="18px"
						alt="(G)"
						style="background-color: #fff; border-radius: 999px; padding: 2px;"
					/>
					<div>
						How to report abuse to registrant: <strong
							>{whoIsData?.registrar?.name || whoIsData?.registrar?.organization}</strong
						>
					</div>
					<TablerExternalLink />
				</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root openDelay={0}>
				<Tooltip.Trigger asChild let:builder>
					<a
						use:builder.action
						{...builder}
						style="background-color: var(--theme-secondary); "
						href="mailto:{whoIsData?.registrar?.email}"
						target="_blank"
					>
						<TablerMail />
						Send a Report Abuse Email
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content
					class="tooltip-content"
					transition={fade}
					transitionConfig={{ duration: 100 }}
				>
					<Tooltip.Arrow class="tooltip-arrow" />
					<TablerMail />
					<div>Open mail to: <strong>{whoIsData?.registrar?.email}</strong></div>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<div style="margin-top: 8px;">
			<label
				><input type="checkbox" bind:checked={$openFirstLink} /> Open the first link of search result</label
			>
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

	:global(.box) {
		border-radius: 32px;
		padding: 32px;
		border: 1px solid #777;
		position: relative;

		:global(.legend) {
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

	.actions {
		a {
			text-decoration: none;
			color: #fff;

			padding: 24px;
			border-radius: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			padding: 24px;
			border-radius: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
		}
	}
</style>
