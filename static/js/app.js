var app = angular.module("myApp", ['ngDialog', 'ngCookies']);

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
});

app.config(function($cookiesProvider) {
	$cookiesProvider.defaults.path = '/';
});
