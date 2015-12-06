<style lang="sass">

$border-style: 0.125rem solid #27333E;

#user-list {
	padding: 0.5rem;

	@media (max-width: 768px) {
		border-bottom: $border-style;
	}
	@media (min-width: 768px) {
		flex: 0 0 auto;
		border-right: $border-style;
		min-width: 10rem;
	}

}
	
</style>

<template>
	<div id="user-list">
		<ul>
			<li>You</li>
			<li><a v-link='{ path: "/cor" }' >cor</a></li>
			<li><br></li>
			<li>Friends</li>
			<li v-for="friend in friends"><a v-link='{ path: "/" + friend.username}'>{{ friend.username }}</a></li>
		</ul>
	</div>
</template>

<script>
export default {
	ready: function() {
		this.updateContents()
	},

	data: function () {
		return {
			friends: []
		}
	},

	events : {
		'url-update' : function() {
			this.updateContents()
		}
	},

	methods: {
		updateContents: function() {
			var username = this.$parent.$route.params.username
			this.fetchFriends(username)
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