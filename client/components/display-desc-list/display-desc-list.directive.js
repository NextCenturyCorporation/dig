'use strict';

angular.module('digApp.directives')
.directive('displayDescList', function() {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            section: '='
        },
        templateUrl: 'components/display-desc-list/display-desc-list.partial.html'
    };
});
