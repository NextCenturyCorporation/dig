'use strict';

angular.module('digApp.directives')
.directive('threadView', function(euiConfigs, textHighlightService) {
    return {
        restrict: 'EA',
        scope: {
            doc: '='
        },
        templateUrl: 'components/thread-view/thread-view.partial.html',
        controller: function($scope) {

            $scope.getArray = function(structure) {
               var arrToReturn = [];

                if(structure) {
                    for(var i = 0; i < structure.length; i++) {
                        arrToReturn.push(structure[i].count);
                    }                
                }

                return arrToReturn;
            };

            /* jshint camelcase:false */
            $scope.numPostsPerUser = $scope.getArray($scope.doc._source.author_name_histogram);
            /* jshint camelcase:true */
        },
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;

            $scope.highlightCheck = function(field, highlightedText) {
                return textHighlightService.highlightCheck(field, highlightedText);
            };
        }
    };
});
