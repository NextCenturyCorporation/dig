'use strict';

angular.module('digApp.directives')
.directive('expandedListingView', function(euiConfigs) {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            parentState: '@',
            getDisplayImageSrc: '=', //this should be in a service instead of on a controller scope
            viewDetails: '=',
            facets: '=',
            imageSearch: '='
        },
        templateUrl: 'components/expanded-listing-view/expanded-listing-view.partial.html',
        link: function($scope) {
            $scope.euiConfigs = euiConfigs;
        }
    };
});