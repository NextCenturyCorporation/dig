'use strict';

angular.module('digApp')
.controller('FilterCtrl', ['$scope', function ($scope) {
    $scope.phone = {live:'', submitted:''};

    $scope.changeFilters = function () {
        $scope.phone.submitted = $scope.phone.live;
    };

    $scope.clearFilters = function () {
        $scope.phone = {live:'', submitted:''};
    };

}]);