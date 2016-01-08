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

		min-height: 100vh;
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
		<translation-list v-if="!addList && !practiceBody && !editBody"></translation-list>
		<add-list v-if="addList"></add-list>
		<practice-body v-show="practiceBody"></practice-body>
		<edit-body v-show="editBody"></edit-body>
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
import PracticeBody from './components/ui/practice-body.vue'
import AddList from './components/ui/add-list.vue'
import EditBody from './components/ui/edit-body.vue'


export default {

	data: function() {
		return {
			addList : false,
			practiceBody : false,
			translationList : false,
			editBody : false
		}
	},

	components: {
		SiteHeader,
		SiteBody,
		SiteFooter,
		UserList,
		ListList,
		PracticeBody,
		TranslationList,
		AddList,
		EditBody
	},

	computed: {
		//HACK: fire an url-update event when this property gets computed
		urlParameters: function() {
			var temp = this.$route.params
			this.$broadcast('url-update')
			return temp
		}
	},

	events: {
		'show-template': function(template, list){
			console.log(list)
			this.addList = false
			this.practiceBody = false
			this.translationList = false
			this.editBody = false

			switch(template) {
				case 'practice':
					this.practiceBody = true
					this.$broadcast('start-practice', list)
					break
				case 'translation':
					this.translationList = true
					break
				case 'add':
					this.addList = true
					break
				case 'edit':
					this.editBody = true
					this.$broadcast('start-edit', list)
					break
			}
		}
	}
}

</script>