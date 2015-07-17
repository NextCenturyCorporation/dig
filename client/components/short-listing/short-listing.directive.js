'use strict';

angular.module('digApp.directives')
.directive('shortListing', function(euiConfigs) {
    return {
        restrict: 'E',
        scope: {
            doc: '='
        },
        controller: function($scope) {
            $scope.euiConfigs = euiConfigs;
        },
        templateUrl: 'components/short-listing/short-listing.partial.html'
    };
});
