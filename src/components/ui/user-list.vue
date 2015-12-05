<style lang="sass">

$border-style: 0.125rem solid #27333E;

#user-list {
	padding: 0.5rem;

	@media (max-width: 768px) {
		border-bottom: $border-style;
	}
	@media (min-width: 768px) {
		flex: 0 0 auto;
		border-right: $border-style;
		min-width: 10rem;
	}
}
	
</style>

<template>
	<div id="user-list">
		<ul>
			<li>Cor</li>
			<li>Philip</li>
			<li>Leon</li>
		</ul>
	</div>
</template>