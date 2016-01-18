var Vue = require('vue')
var App = require('./app.vue');
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.config.debug = true

var router = new VueRouter({
})

// List viewer, editor, trainer and the default user view
import ListViewer from './components/main-window/list-viewer.vue'
import ListEditor from './components/main-window/list-editor.vue'
import ListTrainer from './components/main-window/list-trainer.vue'
import UserView from './components/main-window/user-view.vue'

import HomePage from './components/main-window/homepage.vue'

// Trainer Modes
import TrainerQuiz from './components/practice-modes/quiz.vue'

router.map({
	'/': {
		component: HomePage
		// create new homepage component
	},

	':username' : {
		component: UserView
	},

	':username/:listname' : {
		component: ListViewer
	},

	// For Cor: you should probably create some new components
	// put them in a folder named practice-modes?
	//':username/:listname/practice/:practicemode' : {
		//component: ListTrainer
	//},

	':username/:listname/practice' : {
		component: ListTrainer
	},

	':username/:listname/practice/quiz' : {
		component: TrainerQuiz
	},

	':username/:listname/practice/quiz/:modifiers' : {
		component: TrainerQuiz
	},

	':username/:listname/edit' : {
		component: ListEditor
	},

	':username/add': {
		component: ListEditor
	}
})


router.afterEach(function () {
	// this.$dispatch('url-update')
}),

router.redirect({
	'*': '/'
})

router.start(App, 'app')
