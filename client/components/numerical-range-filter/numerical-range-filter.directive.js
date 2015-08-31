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

            $scope.getRangeAggregation = function() {
                if($scope.indexVM.results) {
                    if($scope.indexVM.results.aggregations['filtered_' + $scope.aggregationName]) {
                        return $scope.indexVM.results.aggregations['filtered_' + $scope.aggregationName];
                    } else {
                        return $scope.indexVM.results.aggregations[$scope.aggregationName];
                    }
                } else {
                    return null;
                }
            };

            if(!$scope.filterStates[$scope.field]) {
               $scope.filterStates[$scope.field] = {
                    begin: null,
                    end: null,
                    enabled: false,
                    min: null,
                    max: null
               };
            }

            $scope.$watch(function() { return $scope.getRangeAggregation();}, 
                function(newValue){
                    if(newValue) {
                        $scope.filterStates[$scope.field].min = $scope.getRangeAggregation().min;
                        $scope.filterStates[$scope.field].max = $scope.getRangeAggregation().max;
                    }
                });

        }
    };
});