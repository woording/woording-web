<style lang="sass" scoped>
.language-name-container {
	display: flex;
	.language-name {
		flex: 1;
	}
}

$border-style: 0.125rem solid #B6B6B6;
#translation-list {
	color: #212121;
	display: flex;
	min-height: 0px;

	.translation-record {
		width: 100%;
		display: flex;
		padding-left: .5rem;
		padding-right: .5rem;
		padding: 0.5rem;

		.list-item {
			flex: 1;
			padding: 0.25rem;
			font-size: 16px;
			border: 1px solid #ccc;
			border-radius: 3px;

			&:not(:last-child) {
				margin-right: 0.5rem;
			}
		}
	}

	.list-header {
		width: 100%;

		padding: .5rem .5rem 0 .5rem;
		input {
			border-radius: 5px;
			border: 1px solid #ccc;
			padding: 3px;
			font-size: 1rem;
			color: #FF9800;
			font-weight: normal;
			width: 100%;
		}

		h2 {
			font-size: 1.2rem;
			color: #212121;
		}

		.language-name-container {
			display: flex;
			.language-name {
				flex: 1;
				&:last-child {
					margin-left: 10px;
				}
				select {
					width: 100%;
					background: white;
					border-radius: 3px;
					padding: 3px;
				}
			}

			border-bottom: $border-style;
			padding: 0.25rem;
		}
	}
}

#translation-list {
	.container {
		flex: 1;

		button {
			background: white;
			color: black;
			padding: 5px;
			width: 10rem;
			border: 1px solid #ccc;
			border-radius: 3px;
			cursor: pointer;
			transition: background 0.3s;
			&:hover {
				background: #ccc;
			}
		}

		select {
			background: white;
			border-radius: 3px;
		}

		input[type=checkbox] {
			color: white;
		}
	}

	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}
</style>

<template>
<div id="translation-list">
	<div class="container">
		<div class="list-header">
			List name: <input type="text" placeholder="Listname" v-model='listname' value="{{ list.listname }}" maxlength="20">

			<div class="language-name-container">
				<div class="language-name">
					Language one: <select name="language_1_tag" v-model="language_1_tag">
						<option value="eng">Eng</option>
						<option value="dut">Dut</option>
						<option value="ger">Ger</option>
					</select>
				</div>

				<div class="language-name">
					Language two: <select name="language_2_tag" v-model="language_2_tag">
						<option value="eng">Eng</option>
						<option value="dut">Dut</option>
						<option value="ger">Ger</option>
					</select>
				</div>
			</div>
		</div>

		<div class="translation-record" v-for="word in list.words">
			<input type="text" value="{{ word.language_1_text }}" placeholder="sentence" class="sentence-item list-item">
			<input type="text" value="{{ word.language_2_text }}" placeholder="translation" class="translation-item list-item" v-on:keyup.tab.prevent="newTabRow" name="edit_input">
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
		<button v-on:click="saveList" v-link='{ path: "/" + $route.params.username + "/" + listname }'>Save list</button>
		<span>{{ error }}</span>
	</div>
</div>
</template>

<script>
import store from '../../store'
import globals from '../../globals'

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

	route: {
		data () {
			var username = this.$parent.$route.params.username
			var listname = this.$parent.$route.params.listname
            console.log(store.cachedToken)

			if(listname){
				var updateList = list => {
					this.list = list
					this.listname = list.listname
					this.language_1_tag = list.language_1_tag
					this.language_2_tag = list.language_2_tag
					this.shared_with = list.shared_with
				}

				store.fetchList(username, listname).then((list) => {
					updateList(list)
				})
			} else {
				this.list = {
					listname: '',
					language_1_tag: 'dut',
					language_2_tag: 'eng',
					shared_with: '1',
					words: [
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''},
						{language_1_text: '', language_2_text: ''}
					]
				}
			}
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

            globals.validateInput(this.listname).then(response => {
                console.log(response)
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
                    this.$dispatch('show-template', 'translation')
                })
            }).catch(error => {
                this.error = 'List not saved, reason: Illegal character used. \nPlease only use letters, numbers, spaces, hyphen and emoji'
                alert(this.error)
                console.log(error)
            })
		}
	}
}
</script>
