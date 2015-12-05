<style lang="sass" scoped>
#list-list {
	padding: 0.5rem;

	@media (max-width: 768px) {
		border-bottom: 0.25rem solid #27333E;
	}
	@media (min-width: 768px) {
		flex: 0 0 auto;
		border-right: 0.25rem solid #27333E;
		min-width: 8rem;
	}

}

</style>

<template>
	<div id="list-list">
		<ul>
			<li v-for='list in lists'>{{ list.listname }}</li>
		</ul>
	</div>

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