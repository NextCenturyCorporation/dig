'use strict';

angular.module('digApp')
.controller('AboutCtrl', ['$scope', '$modalInstance', 'appVersion', 'euiSearchIndex', 'euiConfigs', 
    function($scope, $modalInstance, appVersion, euiSearchIndex, euiConfigs) {
    $scope.aboutSearchConfig = {
        index: euiSearchIndex,
        field: euiConfigs.lastUpdateQuery ? euiConfigs.lastUpdateQuery.field : null
    };
    $scope.appVersion = appVersion;

    $scope.ok = function () {
        $modalInstance.close();
    };
}]);