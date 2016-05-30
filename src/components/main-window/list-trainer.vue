<style lang="sass">
#list-trainer {
	color: #212121;

	#list-info {
		padding: 1rem 1rem 0 1rem;

		h1 {
			font-size: 2.4rem;
			color: #FF9800;
			font-weight: normal;
		}
	}

	#options {
		padding: 1rem 1rem 0 1rem;
		h3 {
			padding: 0;
			margin-top: .5rem;
		}
	}

	pre {
		font-family: Courier;
		padding: 0;
		margin: 0;
		white-space: pre-wrap;

	}

    input {
        cursor: pointer;
    }

    #mode-1:hover:after, #mode-2:hover:after, #mode-3:hover:after {
        display: block;
        position: relative;
        left: 90px;
        top: -10px;
        color: white;
        background: #222;
        border-radius: 3px;
        padding: 10px 5px 10px 15px;
        font-size: 13px;
        width: 200px;
        box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
    }

    #mode-1:hover:after {
        content: "Think the answer in your head.";
    }

    #mode-2:hover:after {
        content: "Choose the correct answer from four options.";
    }

    #mode-3:hover:after {
        content: "Type the correct translation.";
    }

	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}


	/* Gamemode Styles */
	#gamemode-container {
		display: flex;

		.gamemode {
			flex: 1;
			border: 1px solid black;
			height: 10rem;

			line-height: 10rem;
			text-align: center;
			margin: 1rem;

			cursor: pointer;
			user-select: none;

			transition: background-color 0.25s;

			&:hover {
				background-color: #B5B5B5;
			}
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
		background: #4CAF50;
		border: 0;
		border-bottom: 2px solid #388E3C;
		cursor: pointer;
		-webkit-box-shadow: inset 0 -2px #388E3C;
		box-shadow: inset 0 -2px #388E3C;
	}
	.emerald-flat-button:active {
		top: 1px;
		outline: none;
		-webkit-box-shadow: none;
		box-shadow: none;
	}

	.clouds-flat-button {
		position: relative;
		vertical-align: top;
		width: 100%;
		height: 60px;
		padding: 0;
		font-size: 22px;
		color:#454545;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		background: #ecf0f1;
		border: 0;
		border-bottom: 2px solid #dadedf;
		cursor: pointer;
		-webkit-box-shadow: inset 0 -2px #dadedf;
		box-shadow: inset 0 -2px #dadedf;
	}
	.clouds-flat-button:active {
		top: 1px;
		outline: none;
		-webkit-box-shadow: none;
		box-shadow: none;
	}
}
</style>

<template>
<div id="list-trainer">


	<div id="list-info">
		<h1>
			{{ list.listname }}
		</h1>
	</div>

	<div id="gamemode-container">
		<div class="gamemode">QUIZ</div>
		<div class="gamemode">MULTIPLE CHOICE</div>
		<div class="gamemode">TEST</div>
	</div>

	<div id="options">


		<h3>MODE</h3>
		<input name="mode" type="radio" id="mode-1" v-model="options.selectedMode" value="quiz"  checked/>
		<label for="mode-1">quiz</label>
            <br>
		<input name="mode" type="radio" id="mode-2" v-model="options.selectedMode" value="multipleChoice" />
		<label for="mode-2">multiple choice</label>
            <br>
		<input name="mode" type="radio" id="mode-3" v-model="options.selectedMode" value="test" />
		<label for="mode-3">test </label>

		<h3>OPTIONS</h3>

		<div v-show="options.selectedMode == 'quiz'">
			<input name="quiz-language" type="radio" id="quiz-language-1" v-model="options.quiz.selectedLanguage" value="0" checked/>
			<label for="quiz-language-1">{{ list.language_1_tag }} ➡ {{ list.language_2_tag }} </label>
			<br>

			<input name="quiz-language" type="radio" id="quiz-language-2" v-model="options.quiz.selectedLanguage" value="1" />
			<label for="quiz-language-2">{{ list.language_2_tag }} ➡ {{ list.language_1_tag }} </label>
			<br>

			<input name="quiz-language" type="radio" id="quiz-language-both" v-model="options.quiz.selectedLanguage" value="2" />
			<label for="quiz-language-both">both</label>
			<br>

			<input type="checkbox" id="repeatWrongAnswers" v-model="options.quiz.repeatWrongAnswers" />
			<label for="repeatWrongAnswers">repeat wrong answers</label>
			<br>

			<input type="checkbox" id="randomizeOrder" v-model="options.quiz.randomizeOrder" />
			<label for="randomizeOrder">randomize order</label>
			<br>
		</div>

		<div v-show="options.selectedMode == 'test'">
			<input name="test-language" type="radio" id="test-language-1" v-model="options.test.selectedLanguage" value="0" checked/>
			<label for="test-language-1">{{ list.language_1_tag }} ➡ {{ list.language_2_tag }} </label>
			<br>

			<input name="test-language" type="radio" id="test-language-2" v-model="options.test.selectedLanguage" value="1" />
			<label for="test-language-2">{{ list.language_2_tag }} ➡ {{ list.language_1_tag }} </label>
			<br>

			<input name="test-language" type="radio" id="test-language-both" v-model="options.test.selectedLanguage" value="2" />
			<label for="test-language-both">both</label>
			<br>

			<input type="checkbox" id="repeatWrongAnswers" v-model="options.test.repeatWrongAnswers" />
			<label for="repeatWrongAnswers">repeat wrong answers</label>
			<br>

			<input type="checkbox" id="randomizeOrder" v-model="options.test.randomizeOrder" />
			<label for="randomizeOrder">randomize order</label>
			<br>

			<input type="checkbox" id="caseSensitive" v-model="options.test.caseSensitive" />
			<label for="caseSensitive">case sensitive</label>
			<br>

			<input type="checkbox" id="ignorePunctuation" v-model="options.test.ignorePunctuation" />
			<label for="ignorePunctuation">ignore punctuation</label>
			<br>

			<input type="checkbox" id="ignoreTremas" v-model="options.test.ignoreTremas" />
			<label for="ignoreTremas">ignore tremas</label>
			<br>

		</div>

		<div v-show="options.selectedMode == 'multipleChoice'">
			<input name="language" type="radio" id="multipleChoice-language-1" v-model="options.multipleChoice.selectedLanguage" value="0" checked/>
			<label for="multipleChoice-language-1">{{ list.language_1_tag }} ➡ {{ list.language_2_tag }} </label>
			<br>

			<input name="language" type="radio" id="multipleChoice-language-2" v-model="options.multipleChoice.selectedLanguage" value="1" />
			<label for="multipleChoice-language-2">{{ list.language_2_tag }} ➡ {{ list.language_1_tag }} </label>
			<br>

			<input name="language" type="radio" id="multipleChoice-language-both" v-model="options.multipleChoice.selectedLanguage" value="2" />
			<label for="multipleChoice-language-both">both</label>
			<br>

			<input type="checkbox" id="repeatWrongAnswers" v-model="options.multipleChoice.repeatWrongAnswers" />
			<label for="repeatWrongAnswers">repeat wrong answers</label>
			<br>

			<input type="checkbox" id="multipleChoice-randomizeOrder" v-model="options.multipleChoice.randomizeOrder" />
			<label for="multipleChoice-randomizeOrder">randomize order</label>
			<br>
		</div>

		<button v-link='{ path: url }'>Start</button>
	</div>
</div>
</template>

<script>
import store from '../../store'
import globals from '../../globals'

export default {
	data: function() {
		return {
			list: {},

			options: {
				selectedMode: "quiz",
				quiz: {
					selectedLanguage: 0, // 0 = language_1 first, 1 = language_2 first, 2 = both
					repeatWrongAnswers: false,
					randomizeOrder: false,
				},

				test: {
					selectedLanguage: 0, // 0 = language_1 first, 1 = language_2 first, 2 = both
					repeatWrongAnswers: false,
					randomizeOrder: false,
					caseSensitive: false,
					ignorePunctuation: false,
					ignoreTremas: false
				},

				multipleChoice: {
					selectedLanguage: 0, // 0 = language_1 first, 1 = language_2 first, 2 = both
					repeatWrongAnswers: false,
					randomizeOrder: false
				}
			}
		}
	},

	ready() {
		if (!globals.getCookie('logvalue') && store.username == "") {
			// no one is logged in, redirect to the homepage
			this.$route.router.go({ path: '/' })
		}
	},

	computed: {
		url: function() {
			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname
			let gamemode = this.options.selectedMode

			// Create an array from the options related to the selected mode, and map the converteOption function on it.
			// After that, convert it to a string using .join to append it to the url
			// convertOption converts "2", "1", "0", true and false to either "0", "1" or "2"
			let converteOption = x => typeof x === 'string' ? x : ( x ? "1" : "0")
			let modifiers = Object.values(this.options[gamemode]).map(converteOption).join("")

			return '/' + username + '/' + listname + '/practice/' + gamemode + '/' + modifiers
		}
	},

	route: {
		data () {
			// Do we need this?
			var username = this.$parent.$route.params.username
			var listname = this.$parent.$route.params.listname

			this.fetchList(username, listname)
		}
	},

	methods : {
		// fetch a list from the Woording API server
		fetchList: function(username, listname) {

			var updateList = list => { this.list = list }

			store.fetchList(username, listname).then((list) => {
				updateList(list)
			})
		},

		ready() {
			if (store.username == null) {
				alert("should log out");

			}
		}
	}
}
</script>
