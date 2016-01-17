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
export default {
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
