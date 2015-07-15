'use strict';

angular.module('digApp.directives').directive('barGraph', function () {
    return {
        restrict: 'A',
        scope: { 
            data: '=' 
        },
        link: function ($scope, elem) {

            $scope.$watch('data', function (newVal) {
                if(newVal) {
                    elem.sparkline($scope.data, {type: 'bar', width: 50, height: 50});                    
                }
            });


        }
    };
});


