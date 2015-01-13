'use strict';

angular.module('digApp.directives')
.directive('collapseFilter', function() {
    return {
        restrict: 'EA',
        scope: {
            title: '@',
            closed: '='
        },
        transclude: true,
        templateUrl: 'components/collapse-filter/collapse-filter.html'
    };
});