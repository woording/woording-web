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
			background: black;
			color: white;
			border: none;

			&:hover {
				background: green;
			}
		}
	}

	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}

/* the message that is shown when a user hasn't selected a list */
.message-container {
	display: flex;
	align-items: center;
	flex: 1;
	.message {
		flex: 1;
		p {
			text-align: center;
			flex: 1;
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

				<button v-on:click="practiceList" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/practice" }'>Practice</button>
				<button v-on:click="editList" v-link='{ path: "/" + $route.params.username + "/" + list.listname + "/edit" }'>Edit</button>
				<button v-on:click="deleteList">Delete</button>
				<button v-on:click="debugList">Debug</button>

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

		<!-- Show this when there isn't a list selected -->
		<template v-else>
			<div class="message-container">
				<div class="message">
					<p>Select a list on the left to open it.</p>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import store from "../../store";

export default {

	data: function() {
		return {
			list : {},
			editMode: false
		}
	},

	events : {
		// Call the updateContents() method when the url updates
		"url-update" : function() {
			this.updateContents()
		},

		'set-list-null' : function(){
			this.list = null
		}
	},

	methods : {
		debugList: function() {
			console.log(this.list)
		},
		// Basic list methods:
		practiceList: function() {
			this.$dispatch('show-template', 'practice', this.list)
		},

		editList: function() {
			this.$dispatch('show-template', 'edit', this.list)
		},	

		deleteList: function() {
			store.deletedList = this.list
			store.deleteList(store.username, this.list).then((response) => {
				console.log(response)
				this.list = null
				this.$route.router.go({ path: '/cor' })
				console.log(store.deletedList)
			})
		},

		// Update the content based on the current url
		updateContents: function(){
			var username = this.$parent.$route.params.username
			var listname = this.$parent.$route.params.listname

			if (listname){
				this.fetchList(username, listname)
			} else {
				this.list = null
			}

		},

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