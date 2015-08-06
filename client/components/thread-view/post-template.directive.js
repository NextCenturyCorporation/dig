'use strict';

angular.module('digApp.directives')
.directive('postTemplate', function(textHighlightService) {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            post: '=',
            postFields: '='
        },
        templateUrl: 'components/thread-view/post-template.partial.html',
        link: function($scope) {

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});