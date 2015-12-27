<style lang="sass">

#user-list {
	background-color: #388E3C;
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
	}

	.user-link {
		transition: 0.1s;

		&:hover {
			background-color: #4CAF50;
		}
	}

	#active {
		background-color: #4CAF50;

	}

	@media (min-width: 768px) {
		flex: 0 0 auto;
		min-width: 10rem;
		min-height: 0;
		overflow: auto;
	}

}
	
</style>

<template>
	<div id="user-list">
		<ul>
			<li>YOU</li>
			<a v-link='{ path: "/cor" }' ><li id="active" class="user-link">cor</li></a>
			<li><br></li>
			<li>FRIENDS</li>
			<a v-link='{ path: "/" + friend.username}' v-for="friend in friends"><li class="user-link">{{ friend.username }}</li></a>
		</ul>
	</div>
</template>

<script>
export default {

	data: function () {
		return {
			friends: []
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
			this.fetchFriends(username)
		},

		updateActiveUser: function() {
			var username = this.$parent.$route.params.username
		},

		fetchFriends: function(username) {

			var data =  {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				// Add the username parameter to the retrieved json data object containing the token
				data.username = username

				this.$http.post('http://api.woording.com/getFriends', data, function(data, status, request) {
					this.friends = data
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
	}


}	
</script>