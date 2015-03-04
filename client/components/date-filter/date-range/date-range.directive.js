'use strict';

angular.module('digApp')
.directive('dateRange', function() {
    return {
        restrict: 'E',
        scope: {
            beginDate: '=',
            endDate: '=',
            dateFormat: '=',
            min: '=',
            max: '='
        },
        templateUrl: 'components/date-filter/date-range/date-range.partial.html',
        link: function($scope) {
            $scope.beginOpened = false;
            $scope.endOpened = false;
            $scope.minDate = null;
            $scope.maxDate = null;
            $scope.today = new Date();

            $scope.beginOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.beginOpened = !$scope.beginOpened;

                if($scope.beginOpened) {
                    $scope.endOpened = false;
                }
            };

            $scope.endOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.endOpened = !$scope.endOpened;

                if($scope.endOpened) {
                    $scope.beginOpened = false;
                }
            };

            $scope.$watch('min',
                function(newValue) {
                    if(newValue) {
                        $scope.minDate = new Date($scope.min);
                    }
                }
            );

            $scope.$watch('max',
                function(newValue) {
                    if(newValue) {
                        $scope.maxDate = new Date($scope.max);
                    }
                }
            );
        }
    };
});