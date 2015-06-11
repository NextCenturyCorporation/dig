'use strict';

angular.module('digApp.directives')
.directive('postsView', function(euiConfigs) {
    return {
        restrict: 'E',
        scope: {
            doc: '='
        },
        templateUrl: 'components/posts-view/posts-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;
        }
    };
});