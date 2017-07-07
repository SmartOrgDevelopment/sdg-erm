///<reference path="../../typeDefinitions/angular.d.ts"/>
'use strict';
var astro;
angular.module('myApp.loginView', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loginView', {
            templateUrl: 'loginView/loginView.html',
            controller: 'LoginViewCtrl'
        });
    }])
    .controller('LoginViewCtrl', ['$scope', '$location', '$route', 'config', function ($scope, $location, $rootScope, config) {
        var smartorg = config.smartorg;
        $scope.login = function (username, password) {
            smartorg.authenticate({ 'username': username, 'password': password })
                .then(function (userInfo) {
                console.info("user ID " + userInfo.uid + " logged in");
                $location.path("/dashboardView");
                $scope.$apply();
                $location.replace();
            })
                .catch(function (err) {
                console.error("Error occurred " + err);
            });
        };
    }]);
