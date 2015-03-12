'use strict';

angular.module('digApp')
.controller('AboutCtrl', ['$scope', '$modalInstance', 'appVersion', 
    function($scope, $modalInstance, appVersion) {

    $scope.appVersion = appVersion;

    $scope.ok = function () {
        $modalInstance.close();
    };

}]);