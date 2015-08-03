'use strict';

angular.module('digApp.directives').directive('sparkline', function () {
    return {
        restrict: 'EA',
        scope: {             
            data: '=',
            graphType: '@'
        },
        link: function ($scope, elem) {
            
            /* 
            $scope.getHeight = function() {
                return elem.height();
            };
            $scope.$watch($scope.getHeight, function(newVal) {
                if(newVal > 0) {
                    elem.sparkline($scope.data, {type: 'line', width: 50, height: 50});   
                }  
            });
            */

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
