<script lang="ts">
	import CekidotLogo from '$lib/components/CekidotLogo.svelte';
	import SubmitButton from '$lib/Home/SubmitButton.svelte';
	import { isValidUrl } from '$lib/utils';
	import type { EventHandler } from 'svelte/elements';

	let errors: any = {};

	const handleSubmit: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
		const data = new FormData(e.target as HTMLFormElement);

		const url = data.get('url') as string | null | undefined;

		if (!url) {
			return;
		}
		if (!isValidUrl(url)) {
			return;
		}
	};
</script>

<div class="wrapper">
	<div class="container">
		<CekidotLogo />
		<div class="control">
			<form
				data-colorstransition
				on:submit|preventDefault={handleSubmit}
				on:change={() => (errors = {})}
				class:has-error={Object.keys(errors).length > 0}
			>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					type="text"
					placeholder="example-page.com"
					name="url"
					on:keydown={() => (errors = {})}
					autofocus
				/>
				<SubmitButton />
			</form>
			{#if errors.url}
				<div class="url-error">{errors.url}</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		height: 100%;
		display: grid;
		place-items: center;
		position: relative;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		:global(.cekidot-logo) {
			margin-bottom: 32px;
		}
	}

	.control {
		max-width: 512px;
		width: 100%;
	}

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
