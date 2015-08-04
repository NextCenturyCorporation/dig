'use strict';

angular.module('digApp.directives')
.directive('shortListing', function() {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            fieldsToRender: '='
        },
        templateUrl: 'components/short-listing/short-listing.partial.html'
    };
});
