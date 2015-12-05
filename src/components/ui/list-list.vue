<template>
	<ul>
		<li v-for='list in lists'>{{ list.listname }}</li>
	</ul>

</template>

<script>
export default {

	ready: function() {
		this.fetchLists()
	},

	data: function () {
		return {
			lists: []
		}
	},

	methods: {
		fetchLists : function() {
			var data =  {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				this.$http.post('http://api.woording.com/cor', data, function(data, status, request) {
					this.lists = data.lists
				})
			})

		}
	}
}

</script>