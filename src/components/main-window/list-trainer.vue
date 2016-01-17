<style lang="sass">
#list-trainer {
	h1 {
		font-size: 2rem;
		color: #FF9800;
		font-weight: normal;
	}

	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}
</style>

<template>
<div id="list-trainer">
	<div id="options">
		<pre>
			{{ list | json }}
		
		</pre>
		<h1>
			{{ list.listname }} 
		</h1>
		<br>
		<input type="radio" id="1" v-model="selected" value="{{ list.language_1_tag }}">
		<label for="1">{{ list.language_1_tag }} ➡ {{ list.language_2_tag }} </label>
		<br>
		<input type="radio" id="2" v-model="selected" value="{{ list.language_2_tag }}">
		<label for="1">{{ list.language_2_tag }} ➡ {{ list.language_1_tag }} </label>
		<br>
		<input type="radio" id="both" v-model="selected" value="both">	
		<label for="both">Both</label>
		<br>
		<input type="checkbox" id="case" v-model="case">
		<label for="case">Case sensitive?</label>

		<button v-on:click="startTraining">Start</button>
	</div>
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
		},

		startTraining: function() {
			alert('go go go')
		}

	}
}
</script>
