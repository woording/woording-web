<style lang="sass">


#trainer-quiz {
	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}

</style>

<template>
<user-list></user-list>
<list-list></list-list>
<div id="trainer-quiz">
	<h1>top kek</h1>
	<h2>{{ list.listname }}</h2>
	<pre>{{ list | json  }}</pre>
</div>
</template>

<script>
// Side Bar
import ListList from '../side-bar/list-list.vue'
import UserList from '../side-bar/user-list.vue'

export default {
	components: {
		UserList,
		ListList
	},

	data: function() {
		return {
			list: {}

		}
	},

	events: {
		'start-trainer-quiz': function(list) {
			this.startTrainingQuiz(list)
		}
	},

	methods: {

		startTrainingQuiz : function(list) {
			this.list = list
			console.log(this.list)
		}

	}
}
</script>
