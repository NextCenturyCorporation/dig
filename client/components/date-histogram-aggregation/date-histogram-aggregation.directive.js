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
        link: function ($scope, element, attrs) {
            var margin = {top: 0, right: 0, bottom: 0, left: 0};
            // var x = d3.scale.
            $scope.chartEl = $(element).find('.date-histogram-aggregation-chart')[0];

            $scope.render = function(data) {
                // Clear the display.
                d3.select($scope.chartEl).html('');
                // Render the new data.
                d3.select($scope.chartEl).html(JSON.stringify(data));
            };

            $scope.$watch('indexVM.results.aggregations', function() {
                var data = $scope.$eval('indexVM.results.aggregations.' + $scope.aggregationName +
                    ' || indexVM.results.aggregations.filtered_' + $scope.aggregationName);
                $scope.render(data);
            }, true);
        }
    };
});