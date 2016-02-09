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
	<h2>{{ list.listname }}</h2>
	<p>Words left: {{ wordStack.length }}</p>
	<p>Current Word: {{ currentWord.language_1_text }}</p>

	<button id="correctHorse">Correct Answer</button>
	<button v-on:click="simulateWrongAnswer">Wrong Answer</button>


	<h2>Debug info</h2>
	<pre>{{ clickCount }}</pre>
	<pre>{{ list | json }}</pre>
</div>
</template>

<script>

import store from '../../store'
const Rx = require('rx')

export default {

	data () {
		return {
			list: {},
			modifiers: {},
			wordStack: [],
			currentWord: {language_1_text: "", language_2_text: ""},
			clickCount: 0
		}
	},

	ready () {
		this.decodeModifiers()
		this.fetchListAndInitialize()
		var button = document.querySelector("#correctHorse")
		var clickStream = Rx.Observable.fromEvent(button, 'click')
			.pluck("x")
			.scan(function(acc, x, i, source) {return acc + x }, 0)

		var updateClickCount = (count) => this.clickCount = count

		var buttonClickCount = clickStream.subscribe(
			function(count){updateClickCount(count)},
			function(e){console.log('error')},
			function(){console.log('')},
			)
	},

	methods : {

		// fetch the list from the Woording API server
		fetchListAndInitialize() {

			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname

			let updateList = list => { this.list = list }

			let completion = () => {
				this.initalizeWordStack()
				this.addWronglyAnsweredCountToWordsInList()
				this.nextWord()
			}

			store.fetchList(username, listname).then((list) => {
				updateList(list)
				completion()
			})
		},

		addWronglyAnsweredCountToWordsInList() {
			console.log(this.list.words)
			for (var i = this.list.words.length - 1; i >= 0; i--) {
				this.list.words[i].wronglyAnsweredCount = 0
			};
		},

		nextWord() {
			this.currentWord = this.wordStack.pop()
		},

		simulateCorrectAnswer() {

		},

		simulateWrongAnswer() {

		},

		initalizeWordStack() {

			// Shuffle the words if the user wants the words shuffled
			if (this.modifiers.randomizeOrder) {

				// from stackoverflow: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
				function shuffle(o){
					for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
					return o;
				}

				// .slice() copies the array by value instead of by reference
				this.wordStack = shuffle(this.list.words.slice())

			} else {

				// .slice() copies the array by value instead of by reference
				this.wordStack = this.list.words.slice()
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
