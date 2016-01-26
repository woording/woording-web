<style lang="sass">


#trainer-quiz {
	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}

</style>

<template>
<div id="trainer-quiz">
	<h1>top kek</h1>
	<h2>{{ list.listname }}</h2>
	<pre>{{ modifiers | json }}</pre>
	<pre>{{ list | json  }}</pre>
</div>
</template>

<script>

import store from '../../store'

export default {

	data () {
		return {
			list: {},
			modifiers: {}
		}
	},

	ready () {
		this.fetchList()
		this.decodeModifiers()
	},

	methods : {

		// fetch the list from the Woording API server
		fetchList () {

			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname

			var updateList = list => { this.list = list }

			store.fetchList(username, listname).then((list) => {
				updateList(list)
			})
		},

		decodeModifiers() {
			// Create an array from the modifiers in the URL
			let modifiers = this.$parent.$route.params.modifiers.split("")
			let converteModifier = x => x > 1 ? x : x == 1 
			let convertedModifiers = modifiers.map(converteModifier)

			this.modifiers = { nonConvertedModifiers: modifiers, convertedModifiers: convertedModifiers }

		}
	}

}
</script>
