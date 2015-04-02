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
            if($scope.filterStates[$scope.field]) {
                if($scope.filterStates[$scope.field].beginDate) {
                    $scope.filterStates[$scope.field].beginDate = new Date($scope.filterStates[$scope.field].beginDate);
                }
                if($scope.filterStates[$scope.field].endDate) {
                    $scope.filterStates[$scope.field].endDate = new Date($scope.filterStates[$scope.field].endDate);
                }
            } else {
                $scope.filterStates[$scope.field] = {
                    beginDate: null,
                    endDate: null
                };
            }
            $scope.dateFormat = 'MM/dd/yyyy';

            $scope.dateToEjsString = function(date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            };
        }
    };
});