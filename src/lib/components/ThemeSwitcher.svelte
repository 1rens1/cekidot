<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';

	import TablerSun from '~icons/tabler/sun';
	import TablerMoon from '~icons/tabler/moon';
	import { themes } from '../utils';

	const handleSubmit: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');

		if (theme && themes.includes(theme)) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};
</script>

<form class="themeswitcher" method="POST" use:enhance={handleSubmit}>
	<button
		formaction="/?/setTheme&theme=light&redirectTo={$page.url.pathname}"
		class="sun"
		data-colortransition
	>
		<TablerSun font-size="18px" /></button
	>
	<button
		formaction="/?/setTheme&theme=dark&redirectTo={$page.url.pathname}"
		class="moon"
		data-colortransition
	>
		<TablerMoon font-size="18px" /></button
	>
</form>

<style lang="scss">
	@import 'vars';
	.themeswitcher {
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #777;

		button {
			background: none;
			border: none;
			width: 24px;
			height: 24px;
			padding: 4px;
			font: inherit;

			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 9999px;

			cursor: pointer;
			opacity: 0.5;

			$root: &;
			@at-root {
				@mixin active {
					box-shadow: 0 0 0 1px #777;
					opacity: 1;
				}
				@include theme('light') {
					#{$root}:global(.sun) {
						@include active;
					}
				}
				@include theme('dark') {
					#{$root}:global(.moon) {
						@include active;
					}
				}
			}
		}
	}
</style>
