<script lang="ts">
	import { expoOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import TablerWorld from '~icons/tabler/world';

	export let url: string;
	let screenshotUrl: string | undefined;
	let modalOpened = false;

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
			in:fade={{ duration: 500, easing: expoOut }}
			out:fade={{ duration: 200, easing: expoOut }}
		>
			<div
				class="modal-container"
				transition:scale={{ duration: 500, start: 0.9, easing: expoOut }}
			>
				<div class="url-bar">
					<TablerWorld />
					<span>
						{url}
					</span>
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
		border-radius: 16px;
		user-select: none;

		@include is-mobile {
			max-width: 300px;
			width: 100%;
		}
	}

	.image {
		cursor: zoom-in;
		border: 1px solid #777;
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

		display: grid;
		place-items: center;
		padding: 16px;

		.modal-container {
			width: min(650px, 100%);
			border-radius: 32px;
			background-color: var(--theme-background);
			box-shadow: 0 8px 16px rgba(#000, 0.5);
			user-select: none;
			display: flex;
			flex-direction: column;
			transform-origin: top center;
			$root: &;
			@at-root {
				@include theme('dark') {
					#{$root} {
						background-color: color-mix(
							in srgb,
							var(--theme-background) 90%,
							var(--theme-text) 10%
						);
					}
				}
			}
		}

		.url-bar {
			height: 32px;
			margin: 16px;
			padding: 0 8px;
			gap: 8px;
			border-radius: inherit;
			border: 1px solid #777;
			display: flex;
			align-items: center;
			justify-content: center;
			> :global(*) {
				opacity: 0.8;
			}
			:global(svg) {
				flex-shrink: 0;
			}

			span {
				flex-grow: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.modal-image {
			width: 100%;
			border-bottom-left-radius: inherit;
			border-bottom-right-radius: inherit;
		}
	}
</style>
