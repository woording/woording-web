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
	ready() {
		if (store.username == "") {
			// No one logged in, redirect to homepage
			this.$route.router.go({ path: '/' })
		}
	},
	data: function() {
		return {
			list: {}

		}
	},
}
</script>
