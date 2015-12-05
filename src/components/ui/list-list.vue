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