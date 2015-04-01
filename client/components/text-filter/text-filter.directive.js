'use strict';

angular.module('digApp.directives')
.directive('textFilter', function() {
    return {
        restrict: 'E',
        scope: {
            filterTitle: '@',
            filterField: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '=',
            loading: '&',
            filterStates: '='
        },
        templateUrl: 'components/text-filter/text-filter.partial.html',
        link: function($scope) {
            $scope.filterStates[$scope.filterField] = $scope.filterStates[$scope.filterField] || {
                live: '',
                submitted: ''
            };

            $scope.submit = function() {
                $scope.filterStates[$scope.filterField].submitted = $scope.filterStates[$scope.filterField].live;
            };
        }
    };
});