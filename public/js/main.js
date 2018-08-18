var myApp = angular.module("myApp", ["ui.router", "ui.select", "ngSanitize"]);

myApp.config(function($stateProvider, $locationProvider) {
  $stateProvider.state("home", {
    url: "/",
    controller: "HomeController"
  });

  // $locationProvider.html5Mode(true).hashPrefix('/#!/');
  $locationProvider.html5Mode(true);
});
