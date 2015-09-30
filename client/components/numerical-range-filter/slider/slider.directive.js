'use strict';

angular.module('digApp')
.directive('slider', function() {
    return {
        restrict: 'E',
        scope: {
            rangeFilter: '=',
            aggregation: '=',
            indexVM: '=indexvm',
            ejs: '='
        },
        templateUrl: 'components/numerical-range-filter/slider/slider.partial.html',
        link: function($scope, element) {
            var chart;
            var toLine = {};
            var fromLine = {};

            var getSliderElem = function() {
                return angular.element(element[0].querySelector('.range-slider'));
            };

            var updateRangeLabel = function(from, to) {
                angular.element(element[0].querySelector('input.range')).val(from + ' - ' + to);
            };    

            var formatData = function(data) {
                var orderedData = _.map(_.sortByOrder(data.buckets, ['key'], ['asc']), _.values);
                var formatted = {
                    x: ['x'],
                    values: ['# results']
                };

                orderedData.forEach(function(item) {
                    formatted.x.push(item[0]);
                    formatted.values.push(item[1]);
                });

                return formatted;
            };

            var createChart = function() {
                chart = c3.generate({
                    size: {
                        height: 200,
                        width: 220
                    },
                    bindto: element[0].querySelector('.slider-chart'),
                    data: {
                        x: 'x',
                        columns: [
                            $scope.formattedData.x,
                            $scope.formattedData.values
                        ],
                        type: 'bar'
                    },
                    axis: {
                        x: {
                            show: false
                        },
                        y: {
                            show: false
                        }
                    },
                    padding: {
                        right: 10
                    }
                });
                
            };

            var resetMinAndMax = function(minVal, maxVal) {
                getSliderElem().slider('option', 'min', minVal);
                getSliderElem().slider('option', 'max', maxVal);
                getSliderElem().slider('option', 'values', [minVal, maxVal]);
                chart.axis.min({x: minVal});
                chart.axis.max({x: maxVal});
            };

            var redrawBounds = function() {
                if(!_.isEmpty(toLine)) {
                    chart.xgrids.add(toLine);
                }

                if(!_.isEmpty(fromLine)) {
                    chart.xgrids.add(fromLine);
                }
            };

            $scope.initialize = function() {
                $scope.formattedData = formatData($scope.aggregation);
                $scope.aggregationMin = $scope.formattedData.x[1];
                $scope.aggregationMax = $scope.formattedData.x[$scope.formattedData.x.length - 1];
                
                // create slider
                getSliderElem().slider({
                    range: true,
                    min: $scope.aggregationMin,
                    max: $scope.aggregationMax === $scope.aggregationMin ? $scope.aggregationMax + 1 : $scope.aggregationMax,
                    values: [$scope.aggregationMin, $scope.aggregationMax],
                    slide: function(event, ui) {
                        updateRangeLabel(ui.values[0], ui.values[1]);
                        chart.xgrids([{value: ui.values[0]}, {value: ui.values[1]}]);
                    },
                    stop: function(event, ui) {
                        $scope.rangeFilter = {
                            begin: ui.values[0],
                            end: ui.values[1],
                            enabled: true
                        };
                        getSliderElem().slider('option', 'values', [$scope.rangeFilter.begin, $scope.rangeFilter.end]);
                        updateRangeLabel(ui.values[0], ui.values[1]);
                        fromLine = {value: ui.values[0]};
                        toLine = {value: ui.values[1]};
    
                        $scope.$apply();
                    }
                });

                updateRangeLabel(getSliderElem().slider('values', 0), getSliderElem().slider('values', 1));
                createChart();
            };

            $scope.initialize();
            redrawBounds();

            $scope.$watch('rangeFilter', function() {
                if(!$scope.rangeFilter.enabled) {
                    var minVal = $scope.aggregationMin;
                    var maxVal = $scope.aggregationMax === $scope.aggregationMin ? $scope.aggregationMax + 1 : $scope.aggregationMax;

                    resetMinAndMax(minVal, maxVal);
                    createChart();
                    fromLine = {};
                    toLine = {};

                    updateRangeLabel(getSliderElem().slider('values', 0), getSliderElem().slider('values', 1));
                } 
            }, true);

            $scope.$watch('aggregation', function() {
                $scope.formattedData = formatData($scope.aggregation);
                $scope.aggregationMin = $scope.formattedData.x[1];
                $scope.aggregationMax = $scope.formattedData.x[$scope.formattedData.x.length - 1];

                var minVal = $scope.aggregationMin;
                var maxVal = $scope.aggregationMax === $scope.aggregationMin ? $scope.aggregationMax + 1 : $scope.aggregationMax;
                createChart();

                if($scope.rangeFilter.enabled) {
                    if($scope.rangeFilter.begin >= minVal) {
                        getSliderElem().slider('option', 'min', minVal); 
                        chart.axis.min({x: minVal});
                    } else {
                        chart.axis.min({x: $scope.rangeFilter.begin});
                    }

                    if($scope.rangeFilter.end <= maxVal) {
                        getSliderElem().slider('option', 'max', maxVal);
                        chart.axis.max({x: maxVal});
                    } else {
                        chart.axis.max({x: $scope.rangeFilter.end});
                    }
                } else {
                    resetMinAndMax(minVal, maxVal);
                } 
                
                redrawBounds();

                updateRangeLabel(getSliderElem().slider('values', 0), getSliderElem().slider('values', 1));  
            }, true);

        }
    };
});