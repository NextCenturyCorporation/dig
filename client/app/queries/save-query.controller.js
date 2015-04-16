'use strict';

angular.module('digApp')
.controller('SaveQueryCtrl', ['$scope', '$modalInstance', '$http', '$window', 'User', 'queryString', 'filterStates', 'includeMissing', 'selectedSort',
    function($scope, $modalInstance, $http, $window, User, queryString, filterStates, includeMissing, selectedSort) {
    $scope.queryString = queryString;
    $scope.filterStates = filterStates;
    $scope.includeMissing = includeMissing;
    $scope.selectedSort = selectedSort;
    $scope.frequencyOptions = ['daily', 'weekly', 'monthly'];
    $scope.query = {name: '', frequency: 'daily'};
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

    $scope.saveQuery = function() {
        $scope.query.searchTerms = $scope.queryString;
        $scope.query.username = $scope.currentUser.username;
        $scope.query.filters = $scope.filterStates;
        $scope.query.includeMissing = $scope.includeMissing;
        $scope.query.createDate = new Date();
        $scope.query.lastRunDate = new Date();
        $scope.query.selectedSort = $scope.selectedSort;

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