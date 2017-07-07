'use strict';

angular.module('myApp.dashboardView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboardView', {
    templateUrl: 'dashboardView/dashboardView.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', [function() {

}]);