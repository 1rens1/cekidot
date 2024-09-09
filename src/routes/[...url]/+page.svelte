<script lang="ts">
	import UrlBar from '$lib/components/URLBar.svelte';
	import { page } from '$app/stores';
</script>

<div class="wrapper">
	<div class="container">
		<div class="control">
			<UrlBar bind:value={$page.params.url} />
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
</style>
