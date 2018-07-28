/**
 * Created by carlosgonzalez on 4/5/17.
 */
var myApp = angular.module('myApp',['ui.router','matchMedia']);

$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
    } else {
        $('nav').removeClass('shrink');
    }
});



myApp.config( function ($stateProvider, $locationProvider) {

    $stateProvider

        .state('about',{
            url:'/about',
            templateUrl:'/partials/about.html',
            controller:'AboutController'


        })
        .state('home',{
            url:'/',
            controller:'HomeController'
        })



    // $locationProvider.html5Mode(true).hashPrefix('/#!/');
    $locationProvider.html5Mode(true);
})

// /test.html#!/about