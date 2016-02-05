<style lang="sass" scoped>
	#account-button {
		user-select: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0;
		margin-right: .5rem;
		padding: .5rem;
		transition: background-color 0.1s ease;
		border-radius: .5rem;
        position: absolute;
        right: 0px;
        top: 15px;
	}

	img {
		height: 2.5rem;
		display: inline;
		margin: 0;
		padding: 0;
	}

	p {
		display: inline;
		color: #727272;
		margin-left: .5rem;
		margin-right: .5rem;
	}

	#account-menu {
		position: absolute;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		border-left: 2px solid #B6B6B6;
		border-bottom: 2px solid #B6B6B6;
		right: 0;
		top: 77px;

		p {
			display: block;
			margin-bottom: 0.1rem;
			color: #212121;
		}

		button {
			display: block;
			font-family: Roboto;
			font-size: 1rem;
			width: 100%;
			border-radius: 0;
			background-color: #4CAF50;
			color: white;
			padding: .25rem;
			border: 0;
		}

		#sign-out-button {
			background-color: #FF9800;

		}
		#account-info {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}

		select {
			width: 16rem;
			border-radius: 0;
			border: 0;
			outline: 0;
			font-family: Roboto;
			font-size: 1rem;
			padding: 1rem;
		}

	}
</style>

<template>
<div id="account-button" v-on:click="toggleAccountMenu" v-if="username">
	<img src="img/ui/account-button.png" alt="Account Button">
	<p>{{ username }}</p>
</div>
<div id="account-menu" v-show="shouldShowAccountMenu">
	<div id="account-info">
		<p>{{ username }}</p>
        <br>
		<p>{{ email }}</p>
	</div>
	<div>
		<select name="Language">
			<option value="eng">English</option>
			<option value="dut">Dutch</option>
			<option value="ger">German</option>
		</select>
	</div>
	<div>
		<button v-on:click="changePassword">Change Password</button>
		<button v-on:click="signOut" id="sign-out-button">Sign Out</button>
	</div>
</div>
</template>

<script>
import store from '../../store'
export default {
	data : function() {
		return {
			shouldShowAccountMenu: false,
            username: store.username,
            email: ''
		}
	},

    events: {
        'url-update': function(){
            if (store.username){
                this.username = store.username
                store.fetchUser(store.username).then(response => {
                    this.email = response.email
                })
            }
        }
    },

	methods : {
		signOut: function() {
            store.username = ''
            store.password = ''
            store.cachedToken = null
            this.$parent.$route.router.go({ path: "/" })
            this.shouldShowAccountMenu = false
            this.username = ''
		},
		changePassword: function() {
			alert("Handle password changes here")
		},
		toggleAccountMenu: function() {
			this.shouldShowAccountMenu = !this.shouldShowAccountMenu
		}
	}
}
</script>
