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
    $scope.frequencyOptions = ['daily', 'weekly', 'monthly'];
    $scope.query = {name: '', frequency: 'daily', digState: {}, elasticUIState: {}};
    $scope.currentUser = User.get();

    $http.get('api/queries/').
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

    $scope.replacePeriods = function(obj) {
        var tempStr = JSON.stringify(obj);
        tempStr = tempStr.replace(/\./g, '\\uff0e'); 
        return JSON.parse(tempStr);
    };

    $scope.saveQuery = function() {
        $scope.query.elasticUIState.queryState = $scope.euiQuery;
        $scope.query.elasticUIState.filterState = $scope.replacePeriods($scope.euiFilters);
        $scope.query.digState.searchTerms = $scope.searchTerms;
        $scope.query.digState.filters = $scope.filters;
        $scope.query.digState.includeMissing = $scope.includeMissing;
        $scope.query.digState.selectedSort = $scope.selectedSort;
        $scope.query.username = $scope.currentUser.username;
        $scope.query.createDate = new Date();
        $scope.query.lastRunDate = new Date();

        if($scope.existingQuery && $scope.existingQuery.name === $scope.query.name) {
            if($window.confirm('Are you sure you want to save over existing query \"' + $scope.query.name + '\"?')) {
                $http.put('api/queries/' + $scope.existingQuery._id, $scope.query);
            }
        } else {
            $http.post('api/queries', $scope.query);
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