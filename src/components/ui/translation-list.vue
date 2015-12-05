<style lang="sass" scoped>

$border-style: 0.125rem solid #27333E;
#translation-list {
	display: block;

	@media (min-width: 768px) {
		flex: 1;
	}


	h1 {
		font-size: 1.8rem;
		font-weight: bold;
		padding: 0.25rem;
	}

	h2 {
		font-size: 1.2rem;
		font-weight: bold;
	}

	.translation-record {
		width: 100%;
		display: flex;

		.translation-item {
			flex: 1;
			padding: 0.25rem;

			&:not(:last-child) {
				border-right: $border-style;
			}
		}
	}
	.list-header {
		width: 100%;

		.language-name-container {
			display: flex;
			.language-name {
				flex: 1;
			}

			border-bottom: $border-style;
			padding: 0.25rem;
		}
	}
}
</style>

<template>
	<div id="translation-list">

		<div class="list-header">
			<h1>{{ list.listname }}</h1>

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
			<div class="translation-item">{{word.language_1_text}}</div>
			<div class="translation-item">{{word.language_2_text}}</div>
		</div>
	</div>

</template>

<script>
export default {

	ready: function() {
		this.fetchList("cor","engelse_woorden")
	},

	data: function() {
		return {
			list : {}
		}
	},

	methods : {
		fetchList: function(username, listname) {
			var data = {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				this.$http.post('http://api.woording.com/' + username + '/' + listname, data, function(data, status, request) {
					this.list = data
				})
			})
		}

	}
}

</script>
