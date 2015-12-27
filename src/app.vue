<style lang="sass">

	/* Colors */
	$primary-color-dark:   #388E3C;
	$primary-color:        #4CAF50;
	$primary-color-light:  #C8E6C9;
	$primary-color-text:   #FFFFFF;
	$accent-color:         #FF9800;
	$primary-text-color:   #212121;
	$secondary-text-color: #727272;
	$divider-color:        #B6B6B6;

	html {
		box-sizing: border-box;
	}

	*, *:before, *:after {
		box-sizing: inherit;
	}
	
	body {

	   color: #212121;
	   font-family: 'Roboto';

	}

	#app {
		display: flex;
		flex-direction: column;
		@media (min-width: 768px) {
			height: 100vh;
		}
	}
</style>

<template>

<div id="app"> 

	<!-- usage of the urlParameters computed property to make the url-update event hack work !-->
	<div id='{{ urlParameters }}'></div>
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

	computed: {
		//HACK: fire an url-update event when this property gets computed
		urlParameters: function() {
			var temp = this.$route.params
			this.$broadcast('url-update')
			return temp
		}
	}

}

</script>