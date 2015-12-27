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

.list-listitem {

}

</style>

<template>
	<div id="list-list">
		<ul>
			<li>{{ $route.params.username + "'s lists" | uppercase }}</li>
			<li v-for='list in lists' class="list-listitem"><a v-link='{ path: "/" + $route.params.username + "/" + list.listname }'>{{ list.listname }}</a></li>
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