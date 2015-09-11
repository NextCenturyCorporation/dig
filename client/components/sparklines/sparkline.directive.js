'use strict';

angular.module('digApp.directives').directive('sparkline', function(euiConfigs, euiSearchIndex, esclient, $compile) {
    return {
        restrict: 'E',
        scope: {
            doc: '=',
            label: '=',
            variablePath: '=',
            aggregationName: '=',
            query: '=',
            countField: '=',
            graphType: '@'
        },
        controller: function($scope) {
            $scope.data = [];

            // data has to be in an array for sparklines to work -- parse out aggregation counts
            $scope.getArray = function(structure, countField) {
                if(structure) {
                    return structure.map(function(o) { 
                        return o[countField]; 
                    });
                } else {
                    return [];
                }
            };
           
        },
        link: function($scope, elem) {
            $scope.euiConfigs = euiConfigs;

            $scope.renderSparkline = function() {

                _.set($scope.query, $scope.variablePath, $scope.doc._id);

                var queryObj = {
                    index: euiSearchIndex,
                    body: $scope.query
                };

                esclient.search(queryObj)
                .then(function(results) {
                    if(results.hits.total > 0) {
                        $scope.data = $scope.getArray(results.aggregations[$scope.aggregationName].buckets, $scope.countField);
                    }
                }).then(function() {
                    if($scope.data.length > 0) {
                        elem.before($compile('<div class="query-details"><label>' + $scope.label + '</label></div>')($scope));
                        elem.sparkline($scope.data, {type: $scope.graphType, width: 50, height: 50});
                    }
                });
            };

            $scope.renderSparkline();

            $scope.$watchCollection('doc', function (newVal, oldVal) {
                if(newVal !== oldVal) {
                    $scope.renderSparkline();         
                }
            });
        }
    };
});