'use strict';

angular.module('digApp')
.controller('SearchErrorCtrl', function($scope, $state) {
    if(!$scope.indexVM.error) {
        $state.go('search.results.list');
    }

    $scope.error = null;

    $scope.getTitle = function() {
        if(!$scope.error) {
            parseError();
        }
        return $scope.error.title;
    };

    $scope.getErrorMessage = function() {
        if(!$scope.error) {
            parseError();
        }
        return $scope.error.message;
    };

    var parseError = function() {
        $scope.error = {
            message: '',
            title: 'Search Error',
            showDetails: false
        };

        if($scope.indexVM.error) {
            if($scope.indexVM.error.message) {
                $scope.error.message = $scope.indexVM.error.message;
            } else {
                $scope.error.message = $scope.indexVM.error;
            }

            if($scope.indexVM.error.body && $scope.indexVM.error.body.status) {
                if($scope.indexVM.error.body.status === 400 && $scope.indexVM.error.message.indexOf('Parse Failure') > -1) {
                    $scope.error.title = 'Search Parse Error';
                }
            } else {
                if($scope.indexVM.error.message === 'No Living connections') {
                    $scope.error.title = 'Cannot Connect to Database';
                }
            }
        }
    };
});