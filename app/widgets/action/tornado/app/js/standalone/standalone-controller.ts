angular.module('smartorg.r6.standalone', [
    'smartorg.r6.cmpts.stickybar',
    'smartorg.r6.acts.tornado'
]).controller('standaloneCtrl', ['$scope', function ($scope) {

    let args = smartorg.r6.acts.tornado.standalone.testData;

    //if you don't want shadow, uncomment line below
    args.config.data.shadowInputData = {};
    setTimeout(function () {
        $scope.$broadcast('command:TORNADODIST', args);
    }, 100);
}]);
