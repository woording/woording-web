<style lang="sass" scoped>
	#account-button {
		user-select: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0;
		margin-right: .5rem;
		padding: .5rem;
		transition: background-color 0.1s ease;
		border-radius: .5rem;
	}

	img {
		height: 2.5rem;
		display: inline;
		margin: 0;
		padding: 0;
	}

	p {
		display: inline;
		color: #727272;
		margin-left: .5rem;
		margin-right: .5rem;
	}

	#account-menu {
		position: absolute;
		height: 16rem;
		width: 16rem;
		background-color: #B6B6B6;
		right: 0;
		top: 77px;
		border-bottom-left-radius: 1rem;

	}
</style>

<template>
<div id="account-button" v-on:click="toggleAccountMenu">
	<img src="img/ui/account-button.png" alt="Account Button">
	<p>Cor Pruijs</p>
</div>
<div id="account-menu" v-show="shouldShowAccountMenu">
	
	<button>Sign Out</button>

</div>
</template>

<script>
export default {
	data : function() {
		return {
			shouldShowAccountMenu: false
		}
	},
	methods : {
		toggleAccountMenu: function() {
			this.shouldShowAccountMenu = !this.shouldShowAccountMenu
		}
	}
}
</script>