'use strict';

angular.module('digApp')
.controller('SaveQueryCtrl', ['$scope', '$modalInstance', '$http', 'User', 'queryString', 'filterStates',
    function($scope, $modalInstance, $http, User, queryString, filterStates) {
    $scope.queryString = queryString;
    $scope.filterStates = filterStates;
    $scope.frequencyOptions = ['daily', 'weekly', 'monthly'];
    $scope.query = {name: '', frequency: 'daily'};
    $scope.currentUser = User.get();

    $scope.saveQuery = function() {
        $scope.query.searchTerms = $scope.queryString;
        $scope.query.email = $scope.currentUser.email;
        $scope.query.filters = $scope.filterStates;
        $scope.query.createDate = new Date();
        $scope.query.lastRunDate = new Date();

        $http.post('api/query', $scope.query);
    };

    $scope.save = function () {
        $scope.saveQuery();
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.close();
    };

}]);