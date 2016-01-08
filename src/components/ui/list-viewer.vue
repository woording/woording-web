<style lang="sass" scoped>

$border-style: 0.125rem solid #B6B6B6;
#translation-list {
	color: #212121;
	display: flex;
	min-height: 0;

	



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

.container {
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
export default {

	data: function() {
		return {
			list : {},
			editMode: false,
		}
	},

	events : {
		// Call the updateContents() method when the url updates
		"url-update" : function() {
			this.updateContents()
		},
	},

	methods : {
		// Basic list methods:
		practiceList: function() {
			this.$dispatch('show-template', 'practice', this.list)
		},

		editList: function() {
			this.$dispatch('show-template', 'edit', this.list)
		},	

		deleteList: function() {
			var data = {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {
				console.log(data.token)

				var data = {
					'username': 'cor',
					'token': data.token,
					'listname': this.list.listname
				}
				this.$http.post('http://api.woording.com/deleteList', data, function(data, status, request) {
					console.log('deleted list')
					console.log(this.list)
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
		},

		// Update the content based on the current url
		updateContents: function(){
			var username = this.$parent.$route.params.username
			var listname = this.$parent.$route.params.listname

			// If the listname is null, then the user hasn't selected a list and
			// list should be null, so that we can use it with v-if's
			if (listname == null) {
				this.list = null;
			} else {
				this.fetchList(username, listname)
			}
		},

		// fetch a list from the Woording API server
		fetchList: function(username, listname) {
			var data = {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				this.$http.post('http://api.woording.com/' + username + '/' + listname, data, function(data, status, request) {
					this.list = data
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
