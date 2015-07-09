'use strict';

angular.module('digApp.directives')
.directive('displayDescList', function(textHighlightService) {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            section: '='
        },
        templateUrl: 'components/display-desc-list/display-desc-list.partial.html',
        link: function($scope) {
            $scope.stripOtherHtmlTags = function(field) {
                return textHighlightService.stripOtherHtmlTags(field);
            };

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }     
    };
});
