<style lang="sass">
#trainer-multiple-choice {
	flex: 1;
	@media(min-width: 768px) {
		overflow: auto;
	}
}

</style>

<template>
<div id="trainer-multiple-choice">
	<h1>top kek</h1>
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
}
</script>
