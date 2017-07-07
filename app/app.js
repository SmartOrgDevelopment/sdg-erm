'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.loginView',
  'myApp.dashboardView',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/loginView'});
}]).
constant("config", {
    "smartorg": new SmartOrg('https://sdg.smartorg.com', 'kirk'),
    "portfolioName": "Product Launch Portfolio"

});
