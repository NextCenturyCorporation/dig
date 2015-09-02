'use strict';

angular.module('digApp.directives')
.directive('shortListing', function(euiConfigs) {
    return {
        restrict: 'E',
        scope: {
            doc: '='
        },
        controller: function($scope) {

            $scope.getFieldsToRender = function() {
                // Use the ES document type to determine which view to render.
                var index = $scope.doc._source.a.indexOf('Thread') > -1 ? $scope.doc._source.a.indexOf('Thread') : $scope.doc._source.a.indexOf('Offer');
                var docType;
                if(index > -1) {
                    docType = $scope.doc._source.a[index].toLowerCase();
                } else {
                    docType = $scope.doc._source.a.toLowerCase();
                }

                // Temporary workaround until all data sets have doc._source.a field set to appropriate schema
                if(docType === 'webpage') {
                    docType = 'offer';
                }

                $scope.fieldsToRender = euiConfigs[docType + 'Fields']; 
            };

            $scope.getFieldsToRender();
            
            // Need to redraw the component if the type changes 
            $scope.$watch('doc._source.a', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    $scope.getFieldsToRender();
                }
            });

        },
        templateUrl: 'components/short-listing/short-listing.partial.html'
    };
});
