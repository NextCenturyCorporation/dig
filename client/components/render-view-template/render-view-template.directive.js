'use strict';

angular.module('digApp.directives')
.directive('renderViewTemplate', ['$compile', function($compile) {
    return {
        restrict: 'A',
        scope: true,
        controller: function($scope) {
            $scope.templateConfigs = {
                thread: {
                    bindings: {
                        'doc': 'doc'
                    }
                },
                person: {
                    bindings: {
                        'doc': 'doc',
                        'get-display-image-src': 'getDisplayImageSrc',
                        'view-details': 'viewDetails',
                        'parent-state': 'list', //TODO: revisit for list vs gallery
                        'facets' : 'facets', 
                        'image-search': 'imageSearch'
                    }
                },
                offer: {
                    bindings: {
                        'doc': 'doc',
                        'get-display-image-src': 'getDisplayImageSrc',
                        'view-details': 'viewDetails',
                        'parent-state': 'list', //TODO: revisit for list vs gallery
                        'facets' : 'facets', 
                        'image-search': 'imageSearch'
                    }
                }
            };
        },
        link: function($scope, $element) {

            $scope.redraw = function() {
                // Use the ES document type to determine which view to render.
                var docType = $scope.doc._source.a.toLowerCase();

                // Temporary workaround until all data sets have doc._source.a field set to appropriate schema
                if(docType === 'webpage') {
                    docType = 'offer';
                }

                if($scope.templateConfigs && $scope.templateConfigs[docType]) {

                    var viewElement = document.createElement('div');
                    viewElement.setAttribute(docType + '-view', '');

                    // Grab other attributes from templateConfigs
                    if($scope.templateConfigs[docType].bindings) {
                        var bindings = $scope.templateConfigs[docType].bindings;
                        for(var prop in bindings) {
                            if(bindings.hasOwnProperty(prop)) {
                                viewElement.setAttribute(prop, bindings[prop]);
                            }
                        }
                    }

                    $element.html($compile(viewElement)($scope));
                }
            };

            $scope.redraw();

            // Need to redraw the component if the type changes 
            $scope.$watch('doc._source.a', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    $scope.redraw();
                }
            });
            
        }
    };
}]);