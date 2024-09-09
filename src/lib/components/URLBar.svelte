<script>
	import SubmitButton from '$lib/Home/SubmitButton.svelte';
	import { handleSubmit } from '$lib/urlbar';

	export let value = '';
</script>

<form data-colorstransition on:submit|preventDefault={handleSubmit}>
	<!-- svelte-ignore a11y-autofocus -->
	<input type="text" placeholder="example-page.com" name="url" autofocus {value} />
	<SubmitButton />
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
