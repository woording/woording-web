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

		padding: .5rem .5rem 0 .5rem;
		h1 {
			font-size: 2rem;
			color: #FF9800;
			font-weight: normal;
		}

		h2 {
			font-size: 1.2rem;
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
}

#translation-list {
	.container {
		flex: 1;

		button {
			padding: 10px;
			cursor: pointer;
			color: white;
			border-radius: 3px;
			border: 1px solid #ccc;
			color: black;
			background: white;

			&:hover {
				background: #ccc;
			}
		}

		#practiceButton {
			background: green;
			color: white;

			&:hover {
				background: #00C700;
			}
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
		<template v-if="list != null">
		<div class="container">
			<div class="list-header">
				<h1>{{ list.listname }}</h1>

					<button id="practiceButton" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/practice" }'>Practice</button>
				<span v-show="ownList">
					<button id="editButton" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/edit" }'>Edit</button>
					<button id="deleteButton" v-on:click="deleteList">Delete</button>
					<button id="debugButton" v-on:click="debugList">Debug</button>
				</span>
				<span v-show="!ownList">
					<button v-on:click="saveList">Save</button>
				</span>
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

			this.ownList = username == store.username ? true : false

			if(listname){
				this.fetchList(username, listname)
			} else {
				this.list = null
			}
		}
	},

	methods : {
		debugList: function() {
			console.log(this.list)
		},

		deleteList: function() {
			store.deletedList = this.list
			store.deleteList(store.username, this.list).then((response) => {
				console.log(response)
				this.list = null
				this.$route.router.go({ path: '/cor/' })
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
				this.error = 'Successfully saved list.'
				this.list = list_data
				this.$parent.$route.router.go({ path: "/" + store.username + "/" + list_data.listname })
			})
		}

	}
}
</script>
