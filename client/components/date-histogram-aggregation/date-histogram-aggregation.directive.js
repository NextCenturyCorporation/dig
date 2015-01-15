'use strict';

angular.module('digApp').directive('dateHistogramAggregation', function () {
    return {
        templateUrl: 'components/date-histogram-aggregation/date-histogram-aggregation.html',
        restrict: 'E',
        scope: {
            aggregationName: '@',
            aggregationKey: '@',
            dateInterval: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '='
        },
        link: function ($scope, element) {
            //var margin = {top: 0, right: 0, bottom: 0, left: 0};
            // var x = d3.scale.
            $scope.chartEl = $(element).find('.date-histogram-aggregation-chart')[0];
            $scope.chart = null;

            var formatData = function(data) {
                var formatted = {
                    x: ['x'],
                    values: ['count']
                };

                data.buckets.forEach(function(item) {
                    formatted.x.push(item.key);
                    formatted.values.push(item.doc_count);
                });

                return formatted;
            };

            $scope.render = function(data) {
                // Clear the display.
                d3.select($scope.chartEl).html('');
                // Render the new data.
                //d3.select($scope.chartEl).html(JSON.stringify(data));

                if(data) {
                    //build data
                    var formattedData = formatData(data);

                    var renderElement = d3.select($(element).find('.date-histogram-chart')[0]);

                    $scope.chart = c3.generate({
                        bindto: renderElement,
                        data: {
                            type: 'bar',
                            x: 'x',
                            columns: [
                                formattedData.x,
                                formattedData.values
                            ]
                        },
                        axis: {
                            x: {
                                type: 'timeseries',
                                tick: {
                                    format: '%Y-%m-%d',
                                    rotate: 80
                                }
                            }
                        }
                    });
                }
            };

            $scope.$watch('indexVM.results.aggregations', function() {
                var data = $scope.$eval('indexVM.results.aggregations.' + $scope.aggregationName +
                    ' || indexVM.results.aggregations.filtered_' + $scope.aggregationName + '.' + $scope.aggregationName);
                $scope.render(data);
            }, true);
        }
    };
});