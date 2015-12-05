var Vue = require('vue');
var App = require('./app.vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

Vue.use(VueRouter);
Vue.use(VueResource);

new Vue({
	el: 'body',


	ready: function() {


	},

	components: {
		app: App
	}

});
