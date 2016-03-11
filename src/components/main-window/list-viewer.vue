<style lang="sass">
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

        &:nth-child(odd){
            background:#FAFAFA;
        }

		.translation-item {
			flex: 1;
			padding: 0.25rem;

			&:not(:last-child) {
				border-right: $border-style;
			}
		}
	}

	.list-header {
		width: 100%;

		h1 {
			font-size: 2.4rem;
			color: #FF9800;
			font-weight: normal;
		}

		h2 {
			font-size: 1.4rem;
			color: #212121;
		}

		.language-name-container {
			display: flex;
			.language-name {
				flex: 1;
			}

			border-bottom: $border-style;
			padding: 0.25rem;
		}
	}

	/* Button styles */
	.emerald-flat-button {
		// position: relative;
		vertical-align: top;
		width: 100%;
		// height: 60px;
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
		flex: 1;
		position: relative;
		vertical-align: top;
		width: 100%;
		// height: 60px;
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

#translation-list {
	.container {
		flex: 1;

		@media(min-width: 768px) {
			padding: 1rem;
		}

		// button {
		// 	padding: 10px;
		// 	cursor: pointer;
		// 	color: white;
		// 	border-radius: 3px;
		// 	border: 1px solid #ccc;
		// 	color: black;
		// 	background: white;

		// 	&:hover {
		// 		background: #ccc;
		// 	}
		// }

	}

	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}

	#controls {
		display: flex;
		background-color: blue;
		margin-top: 1rem;
		margin-bottom: 1rem;

		.control {
			flex: 1;
			text-align: center;
			padding: 0.5rem;
		}
	}

}
</style>

<template>
<div id="translation-list">
		<template v-if="list != null">
		<div class="container">
			<div class="list-header">
				<h1>{{ list.listname }}</h1>

					<div id="controls">
						<a class="emerald-flat-button control" id="practiceButton" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/practice" }'>Practice</a>
						<a class="clouds-flat-button control" id="editButton" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/edit" }'>Edit</a>
						<a class="clouds-flat-button control" id="deleteButton" v-on:click="deleteList">Delete</a>
						<a class="clouds-flat-button control" v-show="!ownList" v-on:click="saveList">Save</a>
					</div>
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
				<div class="translation-item">{{word.language_1_text}}</div>
				<div class="translation-item">{{word.language_2_text}}</div>
			</div>
			<div id="translation-bottom"></div>
		</div>
		</template>
	</div>
</template>

<script>
import store from "../../store";
import globals from "../../globals";

export default {
	data: function() {

		return {
			list : null,
			editMode: false,
			ownList: null
		}
	},

	route: {
		data () {
			var username = this.$parent.$route.params.username
			var listname = this.$parent.$route.params.listname

            store.fetchToken().then(response => {
                this.ownList = username == store.username ? true : false
            })

            if(listname){
                this.fetchList(username, listname)
            } else {
                this.list = null
            }
	    }
    },

	methods : {

		deleteList: function() {
			store.deletedList = this.list
			store.deleteList(store.username, this.list).then((response) => {
				console.log(response)
				this.list = null
				this.$route.router.go({ path: '/' + store.username + '/' })
			})
		},

		// fetch a list from the Woording API server
		fetchList: function(username, listname) {

			var updateList = list => { this.list = list }

			store.fetchList(username, listname).then((list) => {
				updateList(list)
			})
		},

		saveList: function() {
			// Create new list data from form
			var list_data = {
				listname: this.list.listname,
				language_1_tag: this.list.language_1_tag,
				language_2_tag: this.list.language_2_tag,
				shared_with: this.list.shared_with,
				words: this.list.words
			}

			// Call savelist in store and after that show the new/edited list
			store.saveList(store.username, list_data).then((response) => {
                console.log(response)
                if(response.response == "List exists"){
                    if(!confirm('There is already a list with this name, do you want to continue and delete the old list?')){
                        list_data = {
                            listname: response.old_list.listname,
                            language_1_tag: response.old_list.language_1_tag,
                            language_2_tag: response.old_list.language_2_tag,
                            shared_with: response.old_list.shared_with,
                            words: response.old_words
                        }
                        store.saveList(store.username, list_data).then(response => {
                            console.log('Undo')
                        })
                    }
                }
				this.error = 'Successfully saved list.'
				this.list = list_data
				this.$parent.$route.router.go({ path: "/" + store.username + "/" + list_data.listname })
			})
		}

	}
}
</script>
