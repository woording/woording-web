<style lang="sass" scoped>


#list-list {
	display: flex;
	flex-direction: column;
	@media (min-width: 768px) {
		min-width: 10rem;
	}

	#lists {
		background-color: #4CAF50;
		color: #FFFFFF;	
		padding-top: .5rem;
		min-height: 0;
		flex: 1;

		a {
			text-decoration: none;
			color: #FFFFFF;
			&:visited {
				color: #FFFFFF;
			}
		}

		li {
			padding-left: .5rem;
			padding-top: .25rem;
			padding-bottom: .25rem;
			transition: 0.1s;

		}
		.list-link:hover {
			background-color: #FFFFFF;
			color: #212121;
		}

		@media (min-width: 768px) {
			min-height: 0;
			overflow: auto;
		}

		h2 {
			font-weight: bold;
		}

	}
	#add-list-button {
		background-color: #388E3C;
		color: white;

		text-align: center;
		font-size: 2rem;
		cursor: pointer;
	}
}

.v-link-active li {
	background-color: #FFFFFF;
	color: #212121;
}


</style>

<template>
	<div id="list-list">
		<div id="lists">
			<ul>
				<li>{{ $route.params.username + "'s lists" | uppercase }}</li>
				<a v-for='list in lists' v-link='{ path: "/" + $route.params.username + "/" + list.listname }' v-on:click="showTranslation"><li class="list-link">{{ list.listname }}</li></a>
			</ul>
		</div>
		<div v-on:click="addList" v-link='{ path: "/" + $route.params.username + "/addList" }' id="add-list-button">
			<p>+</p>
		</div>
	</div>

</template>

<script>
export default {

	data: function () {
		return {
			lists: [],
			username: ''
		}
	},

	events : {
		// Call the updateContents() method when the url updates
		'url-update' : function() {
			this.updateContents()
		},

		'return-user' : function(user){
			this.username = user
		}
	},

	methods: {
		updateContents: function() {
			var username = this.$parent.$route.params.username
			this.fetchLists(username)
		},

		addList: function() {
			this.$dispatch('show-template', 'add')
		},

		showTranslation: function() {
			this.$dispatch('show-template', 'translation')
		},
		
		fetchLists : function(username) {
			this.$dispatch('get-username')

			var data = {
				'username' : this.username,
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				this.$http.post('http://api.woording.com/' + username, data, function(data, status, request) {
					this.lists = data.lists
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