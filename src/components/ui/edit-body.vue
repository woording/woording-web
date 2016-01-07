<style lang="sass">

</style>

<template>
	<div class="container">
		<div class="list-header">
			<input type="text" value="{{ list.listname }}" placeholder="Listname">

			<div class="language-name-container">
				<div class="language-name">
					<h2>{{list.language_1_tag}}</h2>
				</div>

				<div class="language-name">
					<h2>{{list.language_2_tag}}</h2>
					
				</div>
				
			</div>
		</div>

		<div class="translation-record" v-for="word in list.words">
			<input type="text" value="{{ word.language_1_text }}" placeholder="sentence" class="translation-item">
			<input type="text" value="{{ word.language_2_text }}" placeholder="translation" class="translation-item">
		</div>
		<div id="translation-bottom"></div>

	</div>
</template>

<script>
export default {
	data: function(){
		return {
			list: {}
		}
	},

	events : {
		'start-edit' : function(list){
			this.list = list
		}
	}
}
</script>