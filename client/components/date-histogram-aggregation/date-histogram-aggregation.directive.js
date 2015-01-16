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
            $scope.chartEl = $(element).find('.date-histogram-chart')[0];
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
                if(data) {
                    var formattedData = formatData(data);

                    $scope.chart = c3.generate({
                        bindto: $scope.chartEl,
                        data: {
                            type: 'area',
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
                                    format: '%m-%d-%y',
                                    count: 5
                                }
                            },
                            y: {
                                inner: 'true',
                                tick: {
                                    count: 3,
                                    format: function(y) {
                                        var intY = y.toFixed(0);
                                        return (intY !== '0' ? intY : '');
                                    }
                                }
                            }
                        },
                        legend: {
                            show: false
                        },
                        size: {
                            height: 100
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