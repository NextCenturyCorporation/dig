'use strict';

angular.module('digApp.directives')
.directive('postsView', function(euiConfigs, textHighlightService) {
    return {
        restrict: 'E',
        scope: {
            doc: '='
        },
        templateUrl: 'components/posts-view/posts-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});