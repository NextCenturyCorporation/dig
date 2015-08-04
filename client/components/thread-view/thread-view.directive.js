'use strict';

angular.module('digApp.directives')
.directive('threadView', function(textHighlightService) {
    return {
        restrict: 'EA',
        scope: {
            doc: '=',
            threadFields: '='
        },
        templateUrl: 'components/thread-view/thread-view.partial.html',
        link: function($scope) {
            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});
