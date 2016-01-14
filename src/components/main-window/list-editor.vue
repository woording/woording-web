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
					<select name="language_1_tag" v-model="language_1_tag">
						<option value="eng">Eng</option>
						<option value="dut">Dut</option>
						<option value="ger">Ger</option>
					</select>
				</div>

				<div class="language-name">
					<select name="language_2_tag" v-model="language_2_tag">
						<option value="eng">Eng</option>
						<option value="dut">Dut</option>
						<option value="ger">Ger</option>
					</select>
				</div>
			</div>
		</div>

		<div class="translation-record" v-for="word in list.words">
			<input type="text" value="{{ word.language_1_text }}" placeholder="sentence" class="sentence-item">
			<input type="text" value="{{ word.language_2_text }}" placeholder="translation" class="translation-item" v-on:keyup.tab.prevent="newTabRow" name="edit_input">
		</div>
		<button v-on:click="addRow">Add Row</button>
		<div id="translation-bottom"></div>

		Shared with <select name="shared_with" v-model="shared_with">
			<option value="0">No one</option>
			<option value="1">Friends</option>
			<option value="2">Everyone</option>
		</select>
		<br>
		Duplicate list <input type="checkbox" v-model='duplicate'>
		<br><br>	
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
			duplicate: false,
			language_1_tag: '',
			language_2_tag: '',
			shared_with: ''
		}
	},

	events : {
		'start-edit' : function(list){
			this.list = list
			this.listname = list.listname
			this.error = ''
			this.language_1_tag = list.language_1_tag
			this.language_2_tag = list.language_2_tag
			this.shared_with = list.shared_with
		}
	},

	methods: {
		addRow: function() {
			// Create new empty row
			this.list.words.push({language_1_text: '', language_2_text: ''})
		},

		newTabRow: function(e) {
			// If there is no row below current row create a new one
			if(!e.target.parentElement.nextSibling.innerHTML){
				this.addRow()
			}
		},

		saveList: function() {
			var words = []

			var sentences = document.getElementsByClassName('sentence-item')
			var translations = document.getElementsByClassName('translation-item');

			// Add all words from form into words array
			for (var i = 0; i < sentences.length; i++) {
				words.push({
					language_1_text: sentences[i].value,
					language_2_text: translations[i].value
				})
			};

			// Stop function when listname is empty
			if (!this.listname){
				this.error = 'Could not save list: Listname should not be empty.'
				return false
			}

			// Create new list data from form
			var list_data = {
				listname: this.listname,
				language_1_tag: this.language_1_tag,
				language_2_tag: this.language_2_tag,
				shared_with: this.shared_with,
				words: words
			}

			// Check if listname changed and user doesn't want to duplicate it. Also checks if listname was empty (new list)
			if (this.listname != this.list.listname && this.listname && !this.duplicate && this.list.listname){
				store.deleteList(store.username, this.list).then((response) => {
					console.log(response)
				})
			}
			
			// Call savelist in store and after that show the new/edited list
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