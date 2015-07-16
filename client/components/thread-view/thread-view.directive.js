'use strict';

angular.module('digApp.directives')
.directive('threadView', function(euiConfigs, textHighlightService) {
    return {
        restrict: 'EA',
        scope: {
            doc: '='
        },
        templateUrl: 'components/thread-view/thread-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});
