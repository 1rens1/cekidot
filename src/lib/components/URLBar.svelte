<script lang="ts">
	import { goto } from '$app/navigation';
	import SubmitButton from '$lib/Home/SubmitButton.svelte';
	import { addToast } from '$lib/stores';
	import { isValidUrl } from '$lib/utils';
	import type { EventHandler } from 'svelte/elements';

	export let value = '';
	export let loading = false;

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
		if (loading) return;

		const data = new FormData(e.target as HTMLFormElement);

		let url = data.get('url') as string | null | undefined;
		console.log(url);

		if (!url) {
			return;
		}
		if (!/^https?:\/\//gi.test(url)) {
			url = 'https://' + url;
		}

		if (!isValidUrl(url)) {
			return;
		}
		
		loading = true;

		const request = await fetch('/api/existance?' + new URLSearchParams({ url }));
		const response = await request.json();
		loading = false;

		if (response.success) {
			goto('/' + url);
		} else {
			addToast({ type: 'error', title: response.message });
		}
	};
</script>

<form data-colorstransition on:submit|preventDefault={handleSubmit}>
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" placeholder="example-page.com" name="url" autofocus {value} />
	<SubmitButton {loading} />
</form>

<style lang="scss">
	form {
		width: 100%;
		flex-shrink: 0;
		height: 64px;
		border-radius: 9999px;
		background-color: var(--theme-background);
		border: 1px solid #777;

		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;

		// box-shadow: 0 4px 4px rgba(#000, 0.25);

		input {
			flex-grow: 1;
			height: 100%;
			outline: none;
			border: none;
			font: inherit;
			background: none;
			padding: 0 24px;
		}
	}
</style>
