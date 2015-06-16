'use strict';

angular.module('digApp.directives')
.directive('postsView', function(euiConfigs, $sce) {
    return {
        restrict: 'E',
        scope: {
            doc: '='
        },
        templateUrl: 'components/posts-view/posts-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;

            $scope.highlightCheck = function(field, highlightedText) {

                if(highlightedText) {
                    for(var i = 0; i < highlightedText.length; i++) {
                        var stripHighlightTags = String(highlightedText[i]).replace(/<[^>]+>/gm, '');
                        if(stripHighlightTags === field) {
                            return $sce.trustAsHtml(String(highlightedText[i]).replace(/<(?!\/?mark\s*\/?)[^>]+>/gm, ''));
                        }
                    }   
                }

                return field;
            };
        }
    };
});