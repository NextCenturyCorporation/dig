'use strict';

angular.module('digApp.directives').directive('sparkline', function () {
    return {
        restrict: 'EA',
        scope: {             
            data: '=',
            graphType: '@'
        },
        link: function ($scope, elem) {
            
            //TODO: sparkline labels?

            // data has to be in an array for sparklines to work -- parse out aggregation counts
            $scope.getArray = function(structure) {
                if(structure) {
                    return structure.map(function(o) { return o.count; });
                } else {
                    return [];
                }
            };

            elem.sparkline($scope.getArray($scope.data), {type: $scope.graphType, width: 50, height: 50});

            $scope.$watchCollection('data', function (newVal, oldVal) {
                if(newVal !== oldVal) {
                    elem.sparkline($scope.getArray($scope.data), {type: $scope.graphType, width: 50, height: 50});                  
                }
            });
        }
    };
});
