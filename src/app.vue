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

	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>

<template>

<div id="app"> 
	<site-header></site-header>
	<site-body>
		<user-list></user-list>
		<list-list></list-list>
		<translation-list></translation-list>
	</site-body>
	<site-footer></site-footer>
</div>

</template>


<script>

import SiteHeader from './components/ui/header.vue'
import SiteBody from './components/ui/body.vue'
import SiteFooter from './components/ui/footer.vue'

import ListList from './components/ui/list-list.vue'
import UserList from './components/ui/user-list.vue'
import TranslationList from './components/ui/translation-list.vue'

export default {

	components: {
		SiteHeader,
		SiteBody,
		SiteFooter,
		UserList,
		ListList,
		TranslationList
	},

}

</script>