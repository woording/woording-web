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
<div id="translation-list">
		<div class="message-container">
			<div class="message">
				<p>Select a list on the left to open it.</p>
			</div>
		</div>
</div>
</template>

<script></script>
