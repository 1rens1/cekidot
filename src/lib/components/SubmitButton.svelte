<script lang="ts">
	import TablerArrowRight from '~icons/tabler/arrow-right';
	import TablerLoader2 from '~icons/tabler/loader-2';
	export let loading = false;
</script>

<button type="submit" class:loading
	><span style="display: none;">Submit</span><span class="icon"
		>{#if !loading}<TablerArrowRight />{:else}<TablerLoader2 />{/if}</span
	>
</button>

<style lang="scss">
	button {
		$inset: 8px;

		display: flex;
		align-items: center;
		justify-content: center;

		font: inherit;
		font-size: 24px;
		background: var(--theme-primary);
		color: #fff;
		width: 64px - ($inset * 2);
		height: 64px - ($inset * 2);
		margin-right: $inset - 1px;
		border: none;
		border-radius: 100%;
		cursor: pointer;
		transition: 0.2s ease;

		line-height: 0;

		&:hover {
			background: color-mix(in srgb, var(--theme-primary) 90%, #000 10%);
		}

		&.loading {
			cursor: default;
			background-color: rgba(#555,0.5);
			color: rgba(#555,0.5);

			.icon {
				animation: spin 2s linear infinite;
				@keyframes spin {
					to {
						transform: rotate(360deg);
					}
				}
			}
		}
	}
</style>
