<style lang="sass">

#user-list {
	display: flex;
	flex-direction: column;
	@media (min-width: 768px) {
		min-width: 10rem;
	}

	#users {
		background-color: #388E3C;
		color: #FFFFFF;
		padding-top: .5rem;
		min-height: 0;
		flex: 1;

		a {
			text-decoration: none;
			color: #FFFFFF;
			&:visited {
				color: #FFFFFF;
			}
		}

		li {
			padding-left: .5rem;
			padding-top: .25rem;
			padding-bottom: .25rem;
		}

		.user-link {
			transition: 0.1s;

			&:hover {
				background-color: #4CAF50;
			}
		}

		.v-link-active > li {
			background-color: #4CAF50;

		}

		@media (min-width: 768px) {
			min-height: 0;
			overflow: auto;

		}
	}

	#add-friend-button {
		background-color: #4CAF50;
		color: white;
		text-align: center;
		font-size: 2rem;
		cursor: pointer;
	}

}

</style>

<template>
	<div id="user-list">
		<div id="users">
			<ul>
				<li>YOU</li>
				<a v-link='{ path: username }'><li class="user-link">cor</li></a>
				<li><br></li>
				<li>FRIENDS</li>
				<a v-link='{ path: "/" + friend.username}' v-for="friend in friends" ><li class="user-link">{{ friend.username }}</li></a>
			</ul>
		</div>
		<div id="add-friend-button" v-on:click="addFriend">
			<p>+</p>
		</div>
	</div>
</template>

<script>
import store from '../../store'

export default {

	data: function () {
		var username = this.$parent.$route.params.username
		this.fetchFriends(username)
		return {
			friends: [],
			username: username
		}
	},

	methods: {
		updateActiveUserHighlight: function() {
			var username = this.$parent.$route.params.username
		},

		addFriend: function() {
			var friendname = prompt('Who would you like to be friends with?')

			store.friendRequest(store.username, friendname).then(response => {
				console.log(response)
			}, response => {
				console.log(response)
			})
		},

		fetchFriends: function(username) {
			var updateFriends = friends => { this.friends = friends }

			store.fetchFriends().then( friends => {
				updateFriends(friends)
			})
		}
	}


}
</script>
