<script lang="ts">
	import { toasts } from '$lib/stores';
	import autoAnimate from '@formkit/auto-animate';
	import Toast from './Toast.svelte';
</script>

<div class="toaster" use:autoAnimate>
	{#each $toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</div>

<style lang="scss">
    .toaster {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 24px;
        max-width: 400px;
        width: 100%;
        height: 100%;
        z-index: 999;
        pointer-events: none;

        display: flex;
        flex-direction: column-reverse;
        gap: 8px;
    }
</style>
