'use strict';

angular.module('digApp.directives')
.directive('offerView', function(euiConfigs) {
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
        templateUrl: 'components/offer-view/offer-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;
        }
    };
});