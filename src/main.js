var Vue = require('vue')
var App = require('./app.vue');
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

Vue.use(VueRouter)
Vue.use(VueResource)

var router = new VueRouter()


router.start(App, 'app')
