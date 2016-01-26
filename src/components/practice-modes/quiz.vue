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
		fetchList() {

			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname

			var updateList = list => { this.list = list }

			store.fetchList(username, listname).then((list) => {
				updateList(list)
			})
		},

		decodeModifiers() {

			// A function that converts a modifier to false, true, or a number if it's bigger than 1
			// x = 0 | false
			// x = 1 | true
			// x > 1 | x 
			let converteModifier = x => x > 1 ? x : x == 1 

			// Create an array from the modifier values in the URL
			let modifierNumbers = this.$parent.$route.params.modifiers.split("")
			let modifierValues = modifierNumbers.map(converteModifier)
			let modifierKeys = ["selectedLanguage", "caseSensitive", "randomizeOrder", "ignorePunctuation", "ignoreTremas"]

			// Merge the array of keys and the array of values into an object
			let modifiers = modifierKeys.reduce((obj, key, i) => { obj[key] = modifierValues[i]; return obj; }, {})

			// Assign the created object to the data of this component
			this.modifiers = modifiers
		}
	}

}
</script>
