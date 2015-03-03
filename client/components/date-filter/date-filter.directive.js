'use strict';

angular.module('digApp.directives')
.directive('dateFilter', function($filter) {
    return {
        restrict: 'E',
        scope: {
            aggregationName: '=',
            field: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '='
        },
        templateUrl: 'components/date-filter/date-filter.partial.html',
        link: function($scope) {
            $scope.startDate = null;
            $scope.endDate = null;
            $scope.dateFormat = 'yyyy-MM-dd';

            $scope.dateToString = function(date) {
                return $filter('date')(date, $scope.dateFormat);
            };
        }
    };
});