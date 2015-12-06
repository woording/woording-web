var Vue = require('vue')
var App = require('./app.vue');
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueRouter)
Vue.use(VueResource)

var router = new VueRouter({
})

router.map({
	':username' : {
		component: App
	},
	':username/:listname' : {
		component: App
	}

})


router.afterEach(function () {
	// this.$dispatch('url-update')	
}),

router.start(App, 'app')
