<script lang="ts">
	import { dismissToast, type Toast } from '$lib/stores';
	import { onMount } from 'svelte';
	import TablerAlertSmall from '~icons/tabler/alert-small';
	import TablerCheck from '~icons/tabler/check';
	import TablerX from '~icons/tabler/x';

	export let toast: Toast;

	const close = () => dismissToast(toast.id);

	onMount(() => {
		setTimeout(close, 3000);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="toast" on:click={close} data-type={toast.type}>
	<div class="heading">
		<span class="icon">
			{#if toast.type === 'success'}
				<TablerCheck style="padding: 2px;" />
			{:else if toast.type === 'error'}
				<TablerX style="padding: 2px;" />
			{:else if toast.type === 'info'}
				<TablerAlertSmall />
			{/if}
		</span>
		<span class="title">
			{toast.title}
		</span>
	</div>
	{#if toast.message}
		<div class="message">{toast.message}</div>
	{/if}
</div>

<style lang="scss">
	.toast {
		background-color: var(--theme-background);
		padding: 16px;
		border-radius: 16px;
		border: 1px solid #777;
		pointer-events: all;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(#000, 0.2);
	}

	.heading {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 8px;

		.icon {
			font-size: 24px;
			line-height: 0;
			background-color: var(--theme-text);
			color: var(--theme-background);
			border-radius: 100%;
		}
	}

	.toast[data-type='error'] .icon {
		background-color: #e00;
		color: #fff;
	}
	.toast[data-type='success'] .icon {
		background-color: #0e0;
		color: #fff;
	}

	.message {
		margin-top: 8px;
		font-size: 14px;
	}
</style>
