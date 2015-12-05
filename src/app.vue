<style>

	html {
		box-sizing: border-box;
	}

	*, *:before, *:after {
		box-sizing: inherit;
	}
	
	body {

	   color: #27333E;
	   font-family: Inconsolata;

	}
</style>

<template>

<div id="app"> 
	<site-header></site-header>
	<p>username: {{user.username}}</p>
	<p>email: {{user.email}}</p>
	<a v-link="{ path: '/cor' }">Go to Cor</a>
	<list-list></list-list>
	<p>JSON result for user:</p>
	<pre>{{ user | json }}</pre>
</div>

</template>


<script>

import SiteHeader from './components/ui/header.vue'
import ListList from './components/ui/list-list.vue'

export default {
	ready: function() {
		this.getUser()

	},

	components: {
		SiteHeader,
		ListList
	},

	data: function() {
		return {
			user : {

			}
		}
	},

	methods : {
		getUser : function() {
		}
	}
}

</script>