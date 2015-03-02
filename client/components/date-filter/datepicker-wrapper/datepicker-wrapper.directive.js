'use strict';

angular.module('digApp.directives')
.directive('datepickerWrapper', function() {
    return {
        restrict: 'E',
        scope: {
            dateLabel: '@',
            date: '=',
            format: '='
        },
        templateUrl: 'components/date-filter/datepicker-wrapper/datepicker-wrapper.partial.html',
        link: function($scope) {

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.toggleDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if(!$scope.opened) {
                    $scope.opened = true;
                } else {
                    $scope.opened = false;
                }
            };
        }
    };
});