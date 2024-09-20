<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import TablerWorld from '~icons/tabler/world';

	export let url: string;
	let screenshotUrl: string | undefined;
	let modalOpened = true;

	const fetchScreenShot = async (target: string) => {
		screenshotUrl = undefined;
		const req = await fetch('/api/screenshot', {
			method: 'POST',
			body: JSON.stringify({ url: target })
		});

		const res = await req.blob();

		const imageUrl = URL.createObjectURL(res);

		screenshotUrl = imageUrl;
	};

	$: if (typeof window !== 'undefined' && window) fetchScreenShot(url);
</script>

{#if screenshotUrl}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<img
		class="image"
		src={screenshotUrl}
		alt="screenshot preview"
		draggable="false"
		on:click={() => (modalOpened = true)}
	/>
	{#if modalOpened}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="modal-wrapper"
			on:click={() => (modalOpened = false)}
			in:fade={{ duration: 100 }}
			out:fade={{ duration: 50 }}
		>
			<div class="modal-container" transition:scale={{ duration: 100, start: 0.9 }}>
				<div class="url-bar">
					<TablerWorld /> <span>{url.repeat(6)}</span>
				</div>
				<img class="modal-image" src={screenshotUrl} alt="screenshot preview" draggable="false" />
			</div>
		</div>
	{/if}
{:else}
	<div class="skeleton" />
{/if}

<style lang="scss">
	@import 'vars';
	.skeleton,
	.image {
		aspect-ratio: 1/1;
		width: 300px;
		height: 100%;
		border-radius: 8px;
		cursor: zoom-in;

		@include is-mobile {
			max-width: 300px;
			width: 100%;
		}
	}

	.modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(8px);
		background-color: rgba(#000, 0.1);
		z-index: 9999;
		cursor: zoom-out;

		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;

		.modal-container {
			width: min(650px, 100%);
			border-radius: 32px;
			background-color: var(--theme-background);
			box-shadow: 0 8px 16px rgba(#000, 0.25);
		}

		.url-bar {
			height: 32px;
			margin: 16px;
			border-radius: inherit;
			border: 1px solid #777;
			display: flex;
			align-items: center;
			justify-content: center;
			:global(svg) {
				flex-shrink: 0;
			}
			
			span {
				flex-shrink: 1;
				flex-grow: 1;
				width: min-content;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.modal-image {
			width: min(650px, 100%);
			border-bottom-left-radius: inherit;
			border-bottom-right-radius: inherit;
		}
	}
</style>
