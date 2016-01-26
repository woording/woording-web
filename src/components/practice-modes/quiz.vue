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
	<pre>{{ wordStack | json  }}</pre>
</div>
</template>

<script>

import store from '../../store'

export default {

	data () {
		return {
			list: {},
			modifiers: {},
			wordStack: []
		}
	},

	ready () {
		this.decodeModifiers()
		this.fetchListAndInitialize()
	},

	methods : {

		// fetch the list from the Woording API server
		fetchListAndInitialize() {

			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname

			let updateList = list => { this.list = list }
			let initStack = () => { this.initalizeWordStack() }
			

			store.fetchList(username, listname).then((list) => {
				updateList(list)
				initStack()
			})
		},

		initalizeWordStack() {

			// Shuffle the words if the user wants the words shuffled
			if (this.modifiers.randomizeOrder) {

				// from stackoverflow: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
				function shuffle(o){
					for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
					return o;
				}

				this.wordStack = shuffle(this.list.words)

			} else {
				this.wordStack = this.list.words
			}

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
