'use strict';

angular.module('digApp')
.controller('SaveQueryCtrl', ['$scope', '$modalInstance', '$http', '$window', 'User', 'digState', 'elasticUIState',
    function($scope, $modalInstance, $http, $window, User, digState, elasticUIState) {
    $scope.searchTerms = digState.searchTerms;
    $scope.filters = digState.filters;
    $scope.includeMissing = digState.includeMissing;
    $scope.selectedSort = digState.selectedSort;
    $scope.euiQuery = elasticUIState.queryState;
    $scope.euiFilters = elasticUIState.filterState;
    $scope.frequencyOptions = ['never', 'hourly', 'daily', 'weekly'];
    $scope.query = {name: '', frequency: 'never', digState: {}, elasticUIState: {}};
    $scope.currentUser = User.get();

    $http.get('api/users/reqHeader/queries').
        success(function(data) {
            $scope.queryResults = data;
    });

    $scope.updateName = function() {
        if($scope.existingQuery && $scope.existingQuery.name) {
            $scope.query.name = $scope.existingQuery.name;
        } else {
            $scope.query.name = '';
        }
    };

    $scope.queryNameExists = function(name) {
        for(var i = 0; i < $scope.queryResults.length; i++) {
            if($scope.queryResults[i].name === name) {
                $scope.existingQuery = $scope.queryResults[i];
                return true;
            }
        }
        return false;
    };

    $scope.saveQuery = function() {
        $scope.query.elasticUIState.queryState = $scope.euiQuery;
        $scope.query.elasticUIState.filterState = $scope.euiFilters;
        $scope.query.digState.searchTerms = $scope.searchTerms;
        $scope.query.digState.filters = $scope.filters;
        $scope.query.digState.includeMissing = $scope.includeMissing;
        $scope.query.digState.selectedSort = $scope.selectedSort;
        $scope.query.username = $scope.currentUser.username;
        $scope.query.createDate = new Date();
        $scope.query.lastRunDate = new Date();

        if($scope.queryNameExists($scope.query.name)) {
            if($window.confirm('Are you sure you want to save over existing query \"' + $scope.query.name + '\"?')) {
                $http.put('api/queries/' + $scope.existingQuery.id, $scope.query);
            }
        } else {
            $http.post('api/users/reqHeader/queries', $scope.query);
        }
    };

    $scope.save = function () {
        $scope.saveQuery();
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.close();
    };


}]);