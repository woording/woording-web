<style scoped lang="sass">

#trainer-quiz {
	flex: 1;
	color: #212121;

	@media (min-width: 768px) {
		overflow: auto;
		padding: 1.5rem;
	}

	h2 {
		font-size: 2.5rem;
		color: #FF9800;
	}

	h4 {
		margin-top: 3rem;
	}

	#current-word-view {
		margin-top: 1rem;
		p {
			font-size: 2rem;
		}
	}

	#controls {
		display: flex;
		background-color: blue;

		.control {
			flex: 1;
			background-color: red;
		}
	}

	/* Button styles */
	.emerald-flat-button {
		// position: relative;
		vertical-align: top;
		width: 100%;
		height: 60px;
		padding: 0;
		font-size: 22px;
		color: white;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		background: #2ecc71;
		border: 0;
		border-bottom: 2px solid #28be68;
		cursor: pointer;
		-webkit-box-shadow: inset 0 -2px #28be68;
		box-shadow: inset 0 -2px #28be68;
	}
	.emerald-flat-button:active {
		top: 1px;
		outline: none;
		-webkit-box-shadow: none;
		box-shadow: none;
	}

	.alizarin-flat-button {
		position: relative;
		vertical-align: top;
		width: 100%;
		height: 60px;
		padding: 0;
		font-size: 22px;
		color: white;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		background: #e74c3c;
		border: 0;
		border-bottom: 2px solid #db4334;
		cursor: pointer;
		-webkit-box-shadow: inset 0 -2px #db4334;
		box-shadow: inset 0 -2px #db4334;
	}

	.alizarin-flat-button:active {
		top: 1px;
		outline: none;
		-webkit-box-shadow: none;
		box-shadow: none;
	}
}

</style>

<template>
<div id="trainer-quiz">
	<h2>{{ list.listname }}</h2>

	<div id="current-word-view">
		<p>{{ currentWord.language_1_text }}</p>
	</div>


	<div v-show="answerButtonMode">
		<div id="controls">
			<a id="correctAnswerButton" class="control">Correct Answer</a>
			<a id="wrongAnswerButton" class="control">Wrong Answer</a>
		</div>
	</div>

	<div v-else>
		<div id="controls">
		<a v-on:click="answerButtonMode = true" class="control">Show Answer</a>
		</div>
	</div>

	<hr>
	<p>Words left: {{ wordStack.length }}</p>
	<p>Wrong answers: </p>



	<h4>Debug info</h4>
	<pre>{{ list | json }}</pre>
</div>
</template>

<script>

import store from '../../store'
const Rx = require('rx')

export default {

	data () {
		return {
			answerButtonMode: false,

			list: {},
			modifiers: {},
			wordStack: [],
			currentWord: {language_1_text: "", language_2_text: ""},
			score: 0
		}
	},

	ready () {
		this.decodeModifiers()
		this.fetchListAndInitialize()


		// let rightAnswerStream = Rx.Observable
		// 	.fromEvent(document.querySelector("#correctAnswerButton"), 'click')
		// 	.map(function(x) { return 1 })

		// let wrongAnswerStream = Rx.Observable
		// 	.fromEvent(document.querySelector("#wrongAnswerButton"), 'click')
		// 	.map(function(x) { return -1 })

		// let answerStream = Rx.Observable
		// 	.merge(rightAnswerStream, wrongAnswerStream)
		// 	.scan(function(acc, x, i, source) { return acc + x}, 0)

		// let score = answerStream.subscribe(
		// 	score => this.score = score,
		// 	error => console.log('error'),
		// 	function(){console.log('')} 
		// )
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
