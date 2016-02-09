var Vue = require('vue')
var App = require('./app.vue');
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')
var Rx = require('rx')
var VueRx = require('vue-rx')
require('whatwg-fetch');

Vue.use(VueRx, Rx)
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
import TrainerMultipleChoice from './components/practice-modes/multiple-choice.vue'

import store from './store'

router.map({
	'/': {
		component: HomePage
	},

	':username' : {
		component: UserView
	},

	':username/:listname' : {
		component: ListViewer
	},

	':username/:listname/practice' : {
		component: ListTrainer
	},

	':username/:listname/practice/quiz' : {
		component: TrainerQuiz
	},

	':username/:listname/practice/quiz/:modifiers' : {
		component: TrainerQuiz
	},

	':username/:listname/practice/multipleChoice/:modifiers' : {
		component: TrainerMultipleChoice
	},

	':username/:listname/edit' : {
		component: ListEditor
	},

	':username/add': {
		component: ListEditor
	}
})


router.afterEach(function () {
}),

router.redirect({
	'*': '/'
})

router.start(App, 'app')
