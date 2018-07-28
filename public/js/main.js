var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function ($stateProvider, $locationProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'HomeController'
        })


    // $locationProvider.html5Mode(true).hashPrefix('/#!/');
    $locationProvider.html5Mode(true);
})