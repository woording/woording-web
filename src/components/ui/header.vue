<style lang="sass" scoped>
	header {
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		h1 {
			font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
			font-weight: 300;
			font-size: 2rem;
		}

		color: #F5F5F6;
		// background-color: #56AD7A;

		padding: 0.25rem;

		border-bottom: 0.125rem solid #B6B6B6;

		img  {
			height: 4rem;
		}

	}
</style>

<template>
	<header>
		<div id="wording-logo">
			<img src="img/logo-alpha.png" alt="Woording Logo">
		</div> 

		<account-button>
		</account-button>
	</header>
</template>

<script>
import AccountButton from './account-button.vue'

export default {
	components: {
		AccountButton
	}
}

</script>