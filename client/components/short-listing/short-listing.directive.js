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

            $scope.fieldIsArray = function(field) {
                return angular.isArray(field);
            };

        },
        templateUrl: 'components/short-listing/short-listing.partial.html'
    };
});
