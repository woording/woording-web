var Vue = require('vue')
var App = require('./app.vue');
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.config.debug = true

var router = new VueRouter({
})

router.map({
	':username' : {
		component: App
	},

	':username/:listname' : {
		component: App
	},

	':username/:listname/edit' : {
		component: App
	},

	':username/:listname/practice' : {
		component: App
	}

})


router.afterEach(function () {
	// this.$dispatch('url-update')	
}),

router.redirect({
	'*': '/cor'
})

router.start(App, 'app')