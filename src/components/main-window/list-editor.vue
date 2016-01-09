<style lang="sass" scoped>
.language-name-container {
	display: flex;
	.language-name {
		flex: 1;
	}
}
</style>

<template>
	<div class="container">
		<div class="list-header">
			<input type="text" placeholder="Listname" v-model='listname' value="{{ list.listname }}">

			<div class="language-name-container">
				<div class="language-name">
					<h2>{{list.language_1_tag}}</h2>
				</div>

				<div class="language-name">
					<h2>{{list.language_2_tag}}</h2>
					
				</div>
				
			</div>
		</div>

		<div class="translation-record" v-for="word in list.words">
			<input type="text" value="{{ word.language_1_text }}" placeholder="sentence" class="sentence-item">
			<input type="text" value="{{ word.language_2_text }}" placeholder="translation" class="translation-item">
		</div>
		<div id="translation-bottom"></div>

		<button v-on:click="saveList" v-link='{ path: "/" + $route.params.username }'>Save list</button>
		<span>{{ error }}</span>
	</div>
</template>

<script>
export default {
	data: function(){
		return {
			list: {},
			listname : '',
			error: '',
			username: ''
		}
	},

	events : {
		'start-edit' : function(list){
			this.list = list
			this.listname = list.listname
			this.error = ''
		},

		'return-user' : function(user){
			this.username = user
		}
	},

	methods: {
		saveList: function() {
			var words = []

			var sentences = document.getElementsByClassName('sentence-item')
			var translations = document.getElementsByClassName('translation-item');

			for (var i = 0; i < sentences.length; i++) {
				words.push({
					language_1_text: sentences[i].value,
					language_2_text: translations[i].value
				})
			};

			if (this.listname == false){
				this.error = 'Could not save list: Listname should not be empty.'
			}

			var list_data = {
				listname: this.listname,
				language_1_tag: this.list.language_1_tag,
				language_2_tag: this.list.language_2_tag,
				shared_with: this.list.shared_with,
				words: words
			}
			
			this.$dispatch('get-username')

			var data = {
				'username' : this.username,
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				var data = {
					'username' : this.username,
					'token' : data.token,
					'list_data' : list_data
				}

				this.$http.post('http://api.woording.com/savelist', data, function(data, status, request){
					console.log('saved list')
					this.error = 'Successfully saved list.'
					this.$dispatch('force-url-update')
				}).error(function(data, status, request) {
					console.log("data: " + data)
					console.log("status: " + status)
					console.log("request: " + request)
				})

			}).error(function(data, status, request) {
				console.log("data: " + data)
				console.log("status: " + status)
				console.log("request: " + request)
			})
		}
	}
}
</script>