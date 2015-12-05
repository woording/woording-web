<style lang="sass" scoped>
#translation-list {
	display: block;

	@media (min-width: 768px) {
		flex: 1;
	}

	.translation-record {
		width: 100%;
		display: flex;

		.translation-item {
			flex: 1;
			padding: 0.25rem;

			&:not(:last-child) {
				border-right: 0.125rem solid #27333E;
			}
		}
	}
}
</style>

<template>
	<div id="translation-list">

		<div class="translation-record">
			<div class="translation-item">Green</div>
			<div class="translation-item">Groen</div>
		</div>
		<div class="translation-record">
			<div class="translation-item">Red</div>
			<div class="translation-item">Rood</div>
		</div>
		<div class="translation-record">
			<div class="translation-item">Blue</div>
			<div class="translation-item">Blauw</div>
		</div>
		
	</div>

</template>
