'use strict';

angular.module('digApp.directives')
.directive('dateRange', function() {
    return {
        restrict: 'E',
        scope: {
            startDate: '=',
            endDate: '=',
            format: '=',
            min: '=',
            max: '='
        },
        templateUrl: 'components/date-filter/date-range/date-range.partial.html',
        link: function($scope) {
            $scope.startOpened = false;
            $scope.endOpened = false;
            $scope.minDate = null;
            $scope.maxDate = null;
            $scope.today = new Date();

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
            };

            $scope.startOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.startOpened = !$scope.startOpened;

                if($scope.startOpened) {
                    $scope.endOpened = false;
                }
            };

            $scope.endOpen = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.endOpened = !$scope.endOpened;

                if($scope.endOpened) {
                    $scope.startOpened = false;
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