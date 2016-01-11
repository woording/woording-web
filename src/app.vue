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
		<list-viewer v-if="!addList && !listTrainer && !listEditor"></list-viewer>
		<add-list v-if="addList"></add-list>
		<list-trainer v-show="listTrainer"></list-trainer>
		<list-editor v-show="listEditor"></list-editor>
	</site-body>
	<site-footer></site-footer>
</div>

</template>


<script>

// Site structure
import SiteHeader from './components/site-structure/header.vue'
import SiteBody from './components/site-structure/body.vue'
import SiteFooter from './components/site-structure/footer.vue'

// Side Bar
import ListList from './components/side-bar/list-list.vue'
import UserList from './components/side-bar/user-list.vue'

// List viewer, editor and trainer (the third column)
import ListEditor from './components/main-window/list-editor.vue'
import ListViewer from './components/main-window/list-viewer.vue'
import ListTrainer from './components/main-window/list-trainer.vue'

// AddList is redundant, should be removed soon
import AddList from './components/add-list.vue'

export default {
	data: function() {
		return {
			addList : false,
			listTrainer: false,
			listViewer : false,
			listEditor : false
		}
	},

	components: {
		SiteHeader,
		SiteBody,
		SiteFooter,
		UserList,
		ListList,
		ListViewer,
		ListEditor,
		ListTrainer,
		AddList
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
			this.listTrainer= false
			this.listViewer = false
			this.listEditor = false

			switch(template) {
				case 'practice':
					this.listTrainer= true
					this.$broadcast('start-practice', list)
					break
				case 'translation':
					this.listViewer = true
					break
				case 'add':
					this.addList = true
					break
				case 'edit':
					this.listEditor = true
					this.$broadcast('start-edit', list)
					break
			}
		},

		'get-username': function(){
			this.$broadcast('return-user', 'cor')
		},

		'set-list-null': function(){
			this.$broadcast('set-list-null')
		}
	}
}

</script>