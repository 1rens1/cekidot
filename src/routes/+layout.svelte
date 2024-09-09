<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import '$lib/styles/globals.scss';
</script>

<svelte:head>
	<title>CEKIDOT</title>
</svelte:head>

<div class="root">
	<Toaster />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<style lang="scss">
	.root {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	main {
		flex-grow: 1;
	}
</style>
