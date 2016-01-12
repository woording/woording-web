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

		<input type="checkbox" v-model='duplicate'> Duplicate list
		
		<button v-on:click="saveList" v-link='{ path: "/" + $route.params.username }'>Save list</button>
		<span>{{ error }}</span>
	</div>
</template>

<script>

import store from '../../store'

export default {
	data: function(){
		return {
			list: {},
			listname : '',
			error: '',
			duplicate: false
		}
	},

	events : {
		'start-edit' : function(list){
			this.list = list
			this.listname = list.listname
			this.error = ''
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

			if (this.listname != this.list.listname && this.listname && !this.duplicate){
				store.deleteList(store.username, this.list).then((response) => {
					console.log(response)
				})
			}
			
			store.saveList(store.username, list_data).then((response) => {
				console.log(response)
				this.error = 'Successfully saved list.'
				this.list = list_data
				this.$parent.$route.router.go({ path: "cor/" + list_data.listname })
		 		this.$dispatch('show-template', 'translation')	
			})
		}
	}
}
</script>