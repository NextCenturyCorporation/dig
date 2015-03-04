'use strict';

angular.module('digApp')
.directive('dateFilter', function($filter) {
    return {
        restrict: 'E',
        scope: {
            aggregationName: '=',
            field: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '=',
            filterStates: '='
        },
        templateUrl: 'components/date-filter/date-filter.partial.html',
        link: function($scope) {
            $scope.filterStates[$scope.field] = {
                beginDate: null,
                endDate: null
            };
            $scope.dateFormat = 'yyyy-MM-dd';

            $scope.dateToString = function(date) {
                return $filter('date')(date, $scope.dateFormat);
            };
        }
    };
});