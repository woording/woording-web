<style lang="sass">
#list-trainer {
	color: #212121;

	#list-info {
		padding: .5rem .5rem 0 .5rem;

		h1 {
			font-size: 2rem;
			color: #FF9800;
			font-weight: normal;
		}
	}

	#options {
		padding: .5rem .5rem 0 .5rem;

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


	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
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


	<div id="options">

		<h3>MODE</h3>
		<input name="mode" type="radio" id="mode-1" v-model="options.selectedMode" value="quiz"  checked/>
		<label for="mode-1">quiz</label>

		<input name="mode" type="radio" id="mode-2" v-model="options.selectedMode" value="multipleChoice"  checked/>
		<label for="mode-2">multiple Choice</label>

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

			<input type="checkbox" id="caseSensitive" v-model="options.quiz.caseSensitive" />
			<label for="caseSensitive">case sensitive</label>
			<br>

			<input type="checkbox" id="randomizeOrder" v-model="options.quiz.randomizeOrder" />
			<label for="randomizeOrder">randomize order</label>
			<br>

			<input type="checkbox" id="ignorePunctuation" v-model="options.quiz.ignorePunctuation" />
			<label for="ignorePunctuation">ignore punctuation</label>
			<br>

			<input type="checkbox" id="ignoreTremas" v-model="options.quiz.ignoreTremas" />
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

			<input type="checkbox" id="multipleChoice-randomizeOrder" v-model="options.multipleChoice.randomizeOrder" />
			<label for="multipleChoice-randomizeOrder">randomize order</label>
			<br>
		</div>

		<button v-link='{ path: url }'>Start</button>

		<pre>{{ options | json }}</pre>
		<pre>{{ url }}</pre>
	</div>
</div>
</template>

<script>
import store from '../../store'

export default {
	data: function() {
		return {
			list: {},

			options: {
				selectedMode: "quiz",
				quiz: {
					selectedLanguage: 0, // 0 = language_1 first, 1 = language_2 first, 2 = both
					caseSensitive: false,
					randomizeOrder: false,
					ignorePunctuation: false,
					ignoreTremas: false
				},

				multipleChoice: {
					selectedLanguage: 0, // 0 = language_1 first, 1 = language_2 first, 2 = both
					randomizeOrder: false
				}
			}
		}
	},

	computed: {
		url: function() {
			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname
			let gamemode = this.options.selectedMode

			let result = '/' + username + '/' + listname + '/practice/' + gamemode 
			let modifiers = ""
			let converteOption = x => x == 2 ? x + "" : ( x ? "1" : "0") 

			switch (this.options.selectedMode) {

				case 'quiz': 
					var options = [ this.options.quiz.selectedLanguage, 
					                this.options.quiz.caseSensitive, 
					                this.options.quiz.randomizeOrder,
					                this.options.quiz.ignorePunctuation,
					                this.options.quiz.ignoreTremas]

					var convertedOptions = options.map(converteOption)

					modifiers = convertedOptions.join("")
					break

				case 'multipleChoice':
					var options = [ this.options.multipleChoice.selectedLanguage,
					                this.options.multipleChoice.randomizeOrder ]

					var convertedOptions = options.map(converteOption)

					modifiers = convertedOptions.join("")
					break
			}


			return '/' + username + '/' + listname + '/practice/' + gamemode + '/' + modifiers
		}

	},

	route: {
		data () {
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
		}
	}
}
</script>
