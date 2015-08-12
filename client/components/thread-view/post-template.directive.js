'use strict';

angular.module('digApp.directives')
.directive('postTemplate', function(euiConfigs, textHighlightService) {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            doc: '=',
            postFields: '='
        },
        templateUrl: 'components/thread-view/post-template.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;

            $scope.fieldIsArray = function(field) {
                return angular.isArray(field);
            };

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});
