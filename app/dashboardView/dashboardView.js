'use strict';
angular.module('myApp.dashboardView', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboardView', {
            templateUrl: 'dashboardView/dashboardView.html',
            controller: 'DashboardCtrl'
        });
    }])
    .controller('DashboardCtrl', ['$scope', '$location', 'config', '$sce', function ($scope, $location, config, $sce) {
        var smartorg = config.smartorg;
    }]);
