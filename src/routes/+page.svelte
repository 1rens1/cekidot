<script lang="ts">
	import CekidotLogo from '$lib/components/CekidotLogo.svelte';
	import UrlBar from '$lib/components/URLBar.svelte';
</script>

<div class="wrapper">
	<!-- <div
		style="background-image: url(/carisa.jpg); width: 200px; height: 200px; background-size: cover; border-radius: 20px; position: fixed; top: 200px; left: 200px;"
	></div> -->
	<div class="container">
		<CekidotLogo />
		<div class="control">
			<UrlBar />
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
</style>
