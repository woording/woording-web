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

		<h3>LANGUAGE</h3>
		<input name="language" type="radio" id="1" v-model="options.selectedLanguage" value="{{ list.language_1_tag }}" />
		<label for="1">{{ list.language_1_tag }} ➡ {{ list.language_2_tag }} </label>
		<br>

		<input name="language" type="radio" id="2" v-model="options.selectedLanguage" value="{{ list.language_2_tag }}" checked />
		<label for="2">{{ list.language_2_tag }} ➡ {{ list.language_1_tag }} </label>
		<br>

		<input name="language" type="radio" id="both" v-model="options.selectedLanguage" value="both" />
		<label for="both">both</label>

		<h3>MODE</h3>
		<input name="mode" type="radio" id="mode-1" v-model="options.selectedMode" value="quiz"  checked/>
		<label for="mode-1">quiz</label>

		<h3>OPTIONS</h3>
		<input type="checkbox" id="caseSensitive" v-model="options.caseSensitive" />
		<label for="caseSensitive">case sensitive</label>
		<br>

		<input type="checkbox" id="ignoreTremas" v-model="options.ignoreTremas" />
		<label for="ignoreTremas">ignore tremas</label>
		<br>

		<button v-link='{ path: "/" + $route.params.username + "/" + $route.params.listname + "/practice/" + "quiz" }'>Start</button>

		<pre>{{ options | json }}</pre>
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
				selectedLanguage: '',
				selectedMode: '',
				caseSensitive: false,
				ignoreTremas: false
			}
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
