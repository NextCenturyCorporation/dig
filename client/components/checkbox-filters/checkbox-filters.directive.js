'use strict';

angular.module('digApp')
.directive('checkboxFilters', function() {
    return {
        restrict: 'EA',
        scope: {
            title: '@',
            closed: '='
        },
        transclude: true,
        templateUrl: 'components/checkbox-filters/checkbox-filters.html'
    };
});