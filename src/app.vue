<style>
	
	body {
	   font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
	   font-weight: 300;

	}
</style>

<template>

<div id="app"> 
	<site-header></site-header>
	<p>username: {{user.username}}</p>
	<p>email: {{user.email}}</p>
	<p>lists:</p>
	<ul>
		<li v-for="list in user.lists">
			{{list.listname}}			
		</li>
		
	</ul>
	<p>JSON result for user:</p>
	<pre>{{ user | json }}</pre>
</div>

</template>


<script>

import SiteHeader from './components/ui/header.vue'

export default {
	ready: function() {
		this.getUser()

	},

	components: {
		SiteHeader
	},

	data: function() {
		return {
			user : {

			}
		}
	},

	methods : {
		getUser : function() {
			var data =  {
				'username' : 'cor',
				'password' : 'Hunter2'
			}

			this.$http.post('http://api.woording.com/authenticate', data, function(data, status, request) {

				this.$http.post('http://api.woording.com/cor', data, function(data, status, request) {
					this.user = data
					console.log(this.user)
				})
			})

		}
	}
}

</script>