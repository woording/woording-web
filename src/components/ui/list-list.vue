<style lang="sass" scoped>


#list-list {
	background-color: #4CAF50;

	color: #FFFFFF;	
	padding-top: .5rem;
	min-height: 0;

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
		flex: 0 0 auto;
		min-width: 10rem;
		min-height: 0;
		overflow: auto;
	}

	h2 {
		font-weight: bold;
	}
}

.v-link-active li {
	background-color: #FFFFFF;
	color: #212121;
}


</style>

<template>
	<div id="list-list">
		<ul>
			<li>{{ $route.params.username + "'s lists" | uppercase }}</li>
			<a v-for='list in lists' v-link='{ path: "/" + $route.params.username + "/" + list.listname }'><li class="list-link">{{ list.listname }}</li></a>
		</ul>
	</div>

</template>

<script>
export default {

	data: function () {
		return {
			lists: []
		}
	},

	events : {
		// Call the updateContents() method when the url updates
		'url-update' : function() {
			this.updateContents()
		}
	},

	methods: {
		updateContents: function() {
			var username = this.$parent.$route.params.username
			this.fetchLists(username)
		},

		fetchLists : function(username) {
			var data =  {
				'username' : 'cor',
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