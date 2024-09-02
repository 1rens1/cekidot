<script lang="ts">
	import CekidotLogo from '$lib/components/CekidotLogo.svelte';
	import SubmitButton from '$lib/Home/SubmitButton.svelte';
</script>

<div class="wrapper">
	<div class="container">
		<CekidotLogo />
		<form>
			<!-- svelte-ignore a11y-autofocus -->
			<input type="text" placeholder="example-page.com" autofocus />
			<SubmitButton />
		</form>
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: grid;
		place-items: center;
		min-height: 100vh;
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

	form {
		max-width: 512px;
		width: 100%;
		flex-shrink: 0;
		height: 64px;
		border-radius: 9999px;
		background-color: var(--theme-background);
		border: 1px solid #ccc;

		display: flex;
		align-items: center;
		justify-content: center;

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
