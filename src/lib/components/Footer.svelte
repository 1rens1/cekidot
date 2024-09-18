<script>
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<footer>
	<div class="container">
		<div class="bottom">
			<div class="credit">
				<span style="font-family: 'Geist Mono'; font-weight: 800;">CEKIDOT</span> is a software by &copy;
				<a
					href="https://rens.vercel.app/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline-anchor">rens</a
				>, 2024.
			</div>
			<ThemeSwitcher />
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		padding: 32px;
	}

	.container {
		width: 100%;
		margin: auto;
	}

    .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
