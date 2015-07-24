'use strict';

angular.module('digApp.directives')
.directive('personView', function(euiConfigs) {
    return {
        restrict: 'EA',
        scope: {
            doc: '=',
            parentState: '@',
            getDisplayImageSrc: '=', //this should be in a service instead of on a controller scope
            viewDetails: '=',
            facets: '=',
            imageSearch: '='
        },
        templateUrl: 'components/person-view/person-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;
        }
    };
});