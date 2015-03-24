'use strict';

angular.module('digApp')
.controller('SearchErrorCtrl', function($scope) {
    $scope.error = null;

    $scope.getErrorMessage = function() {
        if(!$scope.error) {
            parseError();
        }
        return $scope.error.message;
    };

    var parseError = function() {
        if($scope.indexVM.error) {
            if($scope.indexVM.error.message) {
                $scope.error = {
                    message: $scope.indexVM.error.message
                };
            } else {
                $scope.error = {
                    message: $scope.indexVM.error
                };
            }
        } else {
            $scope.error = {
                message: ''
            };
        }
    };
});