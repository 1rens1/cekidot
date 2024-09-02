<svg width="45" height="5" viewBox="0 0 45 5" fill="none" xmlns="http://www.w3.org/2000/svg" class="cekidot-logo">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M1 0H7V1H2V4H7V5H1V4H0V1H1V0ZM8 0H14V1H10V2H13V3H10V4H14V5H8V0ZM17 0H15V5H17V3H18V4H19V5H21V4H20V3H19V2H20V1H21V0H19V1H18V2H17V0ZM24 0H22V5H24V0Z"
		fill="var(--_others)"
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M30 0V1H31V4H30V5H25V0H30ZM27 4H29V1H27V4Z"
		fill="var(--theme-primary)"
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M33 0H37V1H38V4H37V5H33V4H32V1H33V0ZM35 4C35.8284 4 36.5 3.32843 36.5 2.5C36.5 1.67157 35.8284 1 35 1C34.1716 1 33.5 1.67157 33.5 2.5C33.5 3.32843 34.1716 4 35 4Z"
		fill="var(--theme-primary)"
	/>
	<path d="M41 1H39V0H45V1H43V5H41V1Z" fill="var(--theme-primary)" />
</svg>

<style lang="scss">
	@import 'vars';
	svg{
		--_others: #000000;
		width: 37px * 10;
		height: 5px * 10;
		@include theme('dark') {
			--others: #ffffff;
		}
	}
</style>
