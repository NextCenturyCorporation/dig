'use strict';

angular.module('digApp.directives')
.directive('datepickerWrapper', function() {
    return {
        restrict: 'E',
        scope: {
            dateLabel: '@',
            date: '=',
            format: '=',
            min: '=',
            max: '='
        },
        templateUrl: 'components/date-filter/datepicker-wrapper/datepicker-wrapper.partial.html',
        link: function($scope) {
            $scope.opened = false;

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.toggleDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = !$scope.opened;
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