<style lang="sass">
$border-style: 0.125rem solid #B6B6B6;
#translation-list {
	color: #212121;
	display: flex;
	min-height: 0px;
}

/* the message that is shown when a user hasn't selected a list */
.message-container {
	display: flex;
	align-items: center;
	flex: 1;
	.message {
		flex: 1;
		p {
			text-align: center;
			flex: 1;
		}
	}
}
</style>

<template>
<user-list></user-list>
<list-list></list-list>
<div id="translation-list">
		<div class="message-container">
			<div class="message">
				<p>Select a list on the left to open it.</p>
			</div>
		</div>
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
}
</script>
