<style lang="sass" scoped>

$border-style: 0.125rem solid #27333E;

#list-list {
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
	<div id="list-list">
		<ul>
			<li>Your lists</li>
			<li v-for='list in lists'><a v-link='{ path: "/" + $route.params.username + "/" + list.listname }'>{{ list.listname }}</a></li>
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
			lists: []
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