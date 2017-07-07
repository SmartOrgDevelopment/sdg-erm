'use strict';
angular.module('myApp.dashboardView', [
    'ngRoute',
    'smartorg.r6.acts.tornado'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboardView', {
            templateUrl: 'dashboardView/dashboardView.html',
            controller: 'DashboardCtrl'
        });
    }])
    .controller('DashboardCtrl', ['$scope', '$location', 'config', '$sce', '$timeout', function ($scope, $location, config, $sce, $timeout) {
        var smartorg = config.smartorg;
        if (!smartorg.protocols.credentials) {
            // Only for my personal debug on my localhost.
            // Password is different on the other servers.
            if ($location.host() === "localhost") {
                smartorg.protocols.credentials = {
                    secret: "200820e3227815ed1756a6b531e7e0d2",
                    username: "Debugger",
                    isAdmin: true
                };
            }
            else {
                $location.path('/login');
            }
        }
        smartorg.treeFor(config.portfolioName)
            .then(function (treeNodes) {
            $scope.treeNodes = treeNodes.filter(function (treeNode) {
                return !treeNode.children || !treeNode.children.length;
            });
            $timeout();
        })
            .catch(function (err) {
            console.error(err);
        });
        $scope.fetchTornadoData = function (treeNode, callBackFn) {
            var reportOptions = JSON.stringify({});
            smartorg.actionFor("tornado", treeNode._id, btoa(reportOptions)).then(function (data) {
                callBackFn(data);
            })
                .catch(function (err) {
                console.error(err);
            });
        };
        $scope.showTornadoInLeftPanelFor = function (treeNode) {
            console.log("(LEFT PANEL): Fetching tornado data for " + treeNode.name + ", _id: " + treeNode._id);
            $scope.fetchTornadoData(treeNode, function (tornadoData) {
                console.log(tornadoData);
                $timeout(function () {
                    $scope.$broadcast("command:TORNADODIST", {
                        "config": tornadoData,
                        "actionMenuItem": "Tornado"
                    });
                });
            });
        };
        $scope.showTornadoInRightPanelFor = function (treeNode) {
            console.log("(RIGHT PANEL): Fetching tornado data for " + treeNode.name + ", _id: " + treeNode._id);
            $scope.fetchTornadoData(treeNode, function (tornadoData) {
                console.log(tornadoData);
            });
        };
    }]);
