<script lang="ts">
	import TablerArrowRight from '~icons/tabler/arrow-right';
</script>

<button type="submit"><span style="display: none;">Submit</span><TablerArrowRight /></button>

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

		&:hover {
			background: color-mix(in srgb, var(--theme-primary) 90%, #000 10%);
		}
	}
</style>
