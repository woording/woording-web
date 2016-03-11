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
			margin-top: 1rem;
			margin-bottom: 1rem;
			font-size: 2rem;
		}
	}

    .thingy {
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 2rem;
    }

    #correctAnswer {
        font-size: 30px;
    }

	#controls {
		display: flex;
		background-color: blue;
		margin-top: 1rem;

		.control {
			flex: 1;
			text-align: center;
			padding: 1rem;
		}

        .input {
            flex: 2;
            text-align: left;
            font-size:20px;
        }

        .inputWrong {
            outline: none !important;
            border:1px solid red;
            box-shadow: 0 0 10px #719ECE;
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


	// Results
	.invalid-answer-record {
		width: 100%;
		display: flex;
		padding-left: .5rem;
		padding-right: .5rem;

        &:nth-child(odd){
            background:#FAFAFA;
        }

		.translation-item {
			flex: 1;
			padding: 0.25rem;

			&:not(:last-child) {
				// border-right: $border-style;
			}
		}
	}

	hr {
		border: 0;
		height: 0;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}
}

</style>

<template>
<div id="trainer-quiz">

	<h2>{{ list.listname }}</h2>


	<!-- THE WORD ITSELF -->
	<div v-show="displayMode == 'question'" id="current-word-view">
		<p>{{ currentWord.language_1_text }}</p>
	</div>

	<div v-show="displayMode == 'answerButtons'" id="current-word-view">
		<p>{{ currentWord.language_1_text }}</p>
		<p>{{ currentWord.language_2_text }}</p>
	</div>



	<!-- THE BUTTONS -->
	<div v-show="displayMode == 'question'">
		<div id="controls">
        <input type="text" class="control input" v-model="typedWord">
		<a v-on:click="checkAnswer" class="control emerald-flat-button check">Check Answer</a>
		</div>
	</div>

    <div v-show="displayMode == 'correctAnswer'">
		<p class="thingy">{{ currentWord.language_1_text }}</p>
        <p class="thingy" id="correctAnswer">Correct Answer: {{ currentWord.language_2_text }}</p>
		<div id="controls">
        <input type="text" class="control inputWrong input" v-model="typedWord" id="input">
		<a v-on:click="nextWord" class="control emerald-flat-button check">Next</a>
		</div>
    </div>

	<div v-show="displayMode == 'answerButtons'">
		<div id="controls">
			<a v-on:click="answeredCorrectly" id="correctAnswerButton" class="control emerald-flat-button">Correct Answer</a>
			<a v-on:click="answeredWrongly" id="wrongAnswerButton" class="control alizarin-flat-button">Wrong Answer</a>
		</div>
	</div>

	<!-- STATS -->
	<div v-show="displayMode != 'results'">
		<hr>
		<p>Words left: {{ wordStack.length }}</p>
		<p>Wrong answers: {{ invalidAnswerStack.length }} </p>
	</div>

	<div v-show="displayMode == 'results'">
		<h3>RESULTS</h3>
		<h3>WRONG ANSWERS</h3>
		<hr>
		<div class="invalid-answer-record" v-for="answer in invalidAnswerStack">
			<div class="translation-item">{{answer.language_1_text}}</div>
			<div class="translation-item">{{answer.language_2_text}}</div>
		</div>
	</div>

</div>
</template>

<script>

import store from '../../store'
const Rx = require('rx')

export default {

	data () {
		return {
			answerButtonMode: false,
			displayMode: "question",
			list: {},
			modifiers: {},
			wordStack: [],
			invalidAnswerStack: [],
			currentWord: {language_1_text: "", language_2_text: ""},
            typedWord: '',
			score: 0
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
            console.log('test')
            this.typedWord = ''
            this.displayMode = "question"
			// check if there are any words left
			if (this.wordStack.length > 0) {
				this.currentWord = this.wordStack.pop()
			} else {
				// show the user how well they did
				this.showResult();
			}
		},

        checkAnswer() {
            console.log('Currentword: ' + this.currentWord.language_2_text)
            console.log('Typedword: ' + this.typedWord)
            if (this.currentWord.language_2_text == this.typedWord){
                console.log('Correct bitch')
                this.answeredCorrectly()
            } else {
                console.log('WLONG')
                this.displayMode = 'correctAnswer'
                this.answeredWrongly()
            }
        },

		showResult() {
			this.displayMode = "results"
		},

		answeredCorrectly() {
			this.displayMode = "question"
			this.nextWord()
		},

		answeredWrongly() {
			this.invalidAnswerStack.push(this.currentWord)

			if (this.modifiers.repeatWrongAnswers) {

				// the index of the wrongly answered word
				const newWordIndex = this.wordStack.length - 2
				this.wordStack.splice(newWordIndex, 0, this.currentWord)
			}
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
			let modifierKeys = ["selectedLanguage", "repeatWrongAnswers", "randomizeOrder", "caseSensitive",  "ignorePunctuation", "ignoreTremas"]

			// Merge the array of keys and the array of values into an object
			let modifiers = modifierKeys.reduce((obj, key, i) => { obj[key] = modifierValues[i]; return obj; }, {})

			// Assign the created object to the data of this component
			this.modifiers = modifiers
		}
	}

}
</script>
