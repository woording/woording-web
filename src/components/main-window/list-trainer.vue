<style lang="sass">

</style>

<template>
	<div id="options">
		Questioned language: 
		<br>
		<input type="radio" id="1" v-model="selected" value="{{ list.language_1_tag }}">
		<label for="1">{{ list.language_1_tag }}</label>
		<br>
		<input type="radio" id="2" v-model="selected" value="{{ list.language_2_tag }}">
		<label for="2">{{ list.language_2_tag }}</label>
		<br>
		<input type="radio" id="both" v-model="selected" value="both">	
		<label for="both">Both</label>

		<br>
		<input type="checkbox" id="case" v-model="case">
		<label for="case">Case sensitive?</label>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			list: {},
			selected: '',
			case: false
		}
	},

	events : {
		'start-practice' : function(list) {
			this.startPractice(list)
		}
	},

	methods : {
		startPractice: function(list) {
			this.list = list
		}
	}
}
</script>
