'use strict';

angular.module('digApp')
.directive('numericalRangeFilter', function() {
    return {
        restrict: 'E',
        scope: {
            aggregationName: '=',
            title: '@',
            field: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '=',
            filterStates: '='
        },
        templateUrl: 'components/numerical-range-filter/numerical-range-filter.partial.html',
        link: function($scope) {

            if(!$scope.filterStates[$scope.field]) {
               $scope.filterStates[$scope.field] = {
                    begin: null,
                    end: null
               };
            }
        }
    };
});