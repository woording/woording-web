<style lang="sass">
.site-body {

	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;

	@media (min-width: 768px) {
		flex-direction: row;
		flex: 1;
	}

}
</style>
<template>
	<div class="site-body">
		<slot>
	</div>
</template>