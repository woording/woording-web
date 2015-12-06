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

	h2 {
		font-weight: bold;
	}
}
	
</style>

<template>
	<div id="user-list">
		<ul>
			<li><h2>You</h2></li>
			<li>cor</li>
			<li><br></li>
			<li><h2>Friends</h2></li>
			<li v-for="friend in friends">{{ friend.username }}</li>
		</ul>
	</div>
</template>

<script>
export default {
	ready: function() {
		this.fetchFriends('cor')
	},

	data: function () {
		return {
			friends: []
		}
	},

	methods: {
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
	
		}
	}

}	
</script>