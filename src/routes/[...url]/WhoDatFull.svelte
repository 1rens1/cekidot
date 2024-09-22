<script lang="ts">
	import { capFirst } from '$lib/utils';
	import { format, isValid } from 'date-fns';
	import { expoOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import TablerArrowRight from '~icons/tabler/arrow-right';
	import TablerX from '~icons/tabler/x';
	export let whoIsData: any;
	let modalOpened = false;
</script>

<button class="view-full" on:click={() => (modalOpened = true)}
	>View full <TablerArrowRight /></button
>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if modalOpened}
	<div
		class="modal-wrapper"
		in:fade={{ duration: 500, easing: expoOut }}
		out:fade={{ duration: 200, easing: expoOut }}
		on:click|self={() => (modalOpened = false)}
	>
		<div class="modal-container" transition:scale={{ duration: 500, start: 0.9, easing: expoOut }}>
			<button class="x" on:click={() => (modalOpened = false)}>
				<TablerX />
			</button>
			{#each Object.keys(whoIsData) as key}
				<div class="section">
					<div class="key">
						{capFirst(key)}
					</div>
					<ul>
						{#each Object.keys(whoIsData[key]) as subkey}
							<li>
								<span>{capFirst(subkey)}</span><span
									>{isValid(whoIsData[key][subkey])
										? format(whoIsData[key][subkey], 'PPP')
										: whoIsData[key][subkey]}</span
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	.view-full {
		font: inherit;
		background-color: color-mix(in srgb, var(--theme-primary) 25%, transparent 75%);
		color: var(--theme-primary);
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		transition: 0.2s ease;
		$root: &;
		@at-root {
			@include theme('dark') {
				#{$root} {
					color: color-mix(in srgb, var(--theme-primary) 25%, #fff 75%);
				}
			}
		}
		&:hover {
			background-color: color-mix(
				in srgb,
				color-mix(in srgb, var(--theme-primary) 50%, #000 50%) 35%,
				transparent 65%
			);
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
		overflow: auto;

		display: grid;
		place-items: center;
		padding: 16px;

		.modal-container {
			width: min(650px, 100%);
			border-radius: 32px;
			background-color: var(--theme-background);
			box-shadow: 0 8px 16px rgba(#000, 0.5);
			padding: 24px;
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

			.x {
                float: right;
                font: inherit;
                border: 0;
                padding: 8px;
                line-height: 0;
                cursor: pointer;
                border-radius: 8px;
                background: none;
			}
		}

		.section {
			margin-block: 16px;

			.key {
				font-size: 20px;
				font-weight: 600;
			}

			ul {
				list-style: none;
				margin: 0;
				padding: 0;
				font-size: 14px;

				li {
					display: flex;
					justify-content: space-between;
					gap: 8px;

					> span:first-child {
						opacity: 0.8;
					}

					> span:last-child {
						text-align: right;
					}

					&:not(:last-child) {
						border-bottom: 1px solid rgba(#777, 0.2);
						margin-bottom: 0.3em;
					}
				}
			}
		}
	}
</style>
