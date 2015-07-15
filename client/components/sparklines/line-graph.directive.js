'use strict';

angular.module('digApp.directives').directive('lineGraph', function () {
    return {
        restrict: 'A',
        scope: { 
            data: '=' 
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

            $scope.$watch('data', function (newVal) {
                if(newVal) {
                    elem.sparkline($scope.data, {type: 'line', width: 50, height: 50});                    
                }
            });


        }
    };
});


