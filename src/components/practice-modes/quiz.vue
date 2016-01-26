<style lang="sass">


#trainer-quiz {
	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}

</style>

<template>
<div id="trainer-quiz">
	<h1>top kek</h1>
	<h2>{{ list.listname }}</h2>
	<pre>{{ list | json  }}</pre>
</div>
</template>

<script>

import store from '../../store'

export default {

	data () {
		return {
			list: {}
		}
	},

	ready () {
		this.fetchList()
	},

	methods : {

		// fetch the list from the Woording API server
		fetchList () {

			let username = this.$parent.$route.params.username
			let listname = this.$parent.$route.params.listname

			var updateList = list => { this.list = list }

			store.fetchList(username, listname).then((list) => {
				updateList(list)
			})
		}
	}

}
</script>
