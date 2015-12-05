<style lang="sass">
#user-list {
	background-color: #74CA97;
	padding: 0.5rem;

	@media (max-width: 768px) {
		border-bottom: 0.25rem solid #27333E;
	}
	@media (min-width: 768px) {
		flex: 0 0 auto;
		border-right: 0.25rem solid #27333E;
		min-width: 8rem;
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