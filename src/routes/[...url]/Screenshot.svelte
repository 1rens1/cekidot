<script lang="ts">
	import { onMount } from 'svelte';

	export let url: string;
	let screenshotUrl: string | undefined;

	const fetchScreenShot = async (target: string) => {
		screenshotUrl = undefined;
		const req = await fetch('/api/screenshot', {
			method: 'POST',
			body: JSON.stringify({ url: target })
		});
	};

	$: if (typeof window !== 'undefined' && window) fetchScreenShot(url);
</script>

<div class="skeleton" />

<style lang="scss">
	@import 'vars';
	.skeleton {
		aspect-ratio: 4/3;
		width: 300px;
		height: 100%;

		@include is-mobile{
			max-width: 300px;
			width: 100%;
		}
	}
</style>