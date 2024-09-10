<script lang="ts">
	import { page } from '$app/stores';
	import UrlBar from '$lib/components/URLBar.svelte';
	import { addToast } from '$lib/stores';
	import { format } from 'date-fns';
	import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict';
	import TablerAlertTriangle from '~icons/tabler/alert-triangle';
	import TablerMail from '~icons/tabler/mail';
	import AntDesignQuestionCircleOutlined from '~icons/ant-design/question-circle-outlined';

	$: urlPath = $page.params.url;
	$: url = new URL($page.params.url);

	interface ContactInfo {
		name?: string;
		organization?: string;
		street?: string;
		city?: string;
		province?: string;
		postal_code?: string;
		country?: string;
		phone?: string;
		phone_ext?: string;
		fax?: string;
		fax_ext?: string;
		email?: string;
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
		domain: Domain;
		registrar: ContactInfo;
		registrant: ContactInfo;
		administrative: ContactInfo;
		technichal: ContactInfo;
		billing: ContactInfo;
	}

	let whoIsData: WhoIsData | undefined;

	$: fetchWhoIsData(url.host);

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
	<div class="container" style="padding-bottom: 0;">
		<div class="control">
			<UrlBar bind:value={urlPath} />
		</div>
	</div>
	<div class="container" style="padding-bottom: 0;">
		<h1 class="hostname">
			{#key url.hostname}
				<img src="https://favicone.com/{url.hostname}?s=32" alt={url.hostname} />
			{/key}
			{url.hostname}
		</h1>
	</div>
	<div class="container">
		{#if whoIsData}
			<div class="box">
				<h2 style="margin: 0;">Domain: {whoIsData.domain.domain}</h2>
				<div>Registered</div>
				<div style="margin-left: 1em;">
					<div>
						at {format(whoIsData.domain.created_date, 'PPP')} ({formatDistanceToNowStrict(
							whoIsData.domain.created_date
						)})
					</div>
					<div>by {whoIsData.registrar.name}</div>
				</div>
			</div>
		{:else}
			<div class="box">
				<div class="skeleton" style="max-width: 400px; margin-bottom: 8px; font-size: 24px;"></div>
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
					style="max-width: 500px; height: calc(1em-8px); margin-bottom: 8px;"
				></div>
			</div>
		{/if}
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
	.wrapper {
	}
	.container {
		padding: 32px;
		max-width: 1200px;
		width: 100%;
		margin: auto;
	}
	.hostname {
		margin: 0;
		font-size: 48px;
	}

	.box {
		border-radius: 32px;
		padding: 32px;
		border: 1px solid #777;
	}
</style>
