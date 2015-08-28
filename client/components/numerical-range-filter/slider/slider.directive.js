'use strict';

angular.module('digApp')
.directive('numericalRange', function() {
    return {
        restrict: 'E',
        scope: {
            begin: '=',
            end: '=',
            min: '=',
            max: '='
        },
        templateUrl: 'components/numerical-range-filter/slider/slider.partial.html',
        link: function($scope, element) {
            $scope.initSlider = function() {
 
                angular.element(element[0].querySelector('.slider-range')).slider({
                    range: true,
                    min: $scope.min,
                    max: $scope.max,
                    values: [$scope.min, $scope.max],
                    slide: function(event, ui) {
                        $scope.updateRange(ui.values[0], ui.values[1]);
                    },
                    stop: function(event, ui) {
                        $scope.$apply(function() {

                            $scope.begin = ui.values[0];
                            $scope.end = ui.values[1];
                            angular.element(element[0].querySelector('.slider-range')).slider('option', 'values', [$scope.begin, $scope.end]);
                            $scope.updateRange(ui.values[0], ui.values[1]);
                        });
                    }

                });

                $scope.updateRange(angular.element(element[0].querySelector('.slider-range')).slider('values', 0), 
                    angular.element(element[0].querySelector('.slider-range')).slider('values', 1));

            };

            $scope.updateRange = function(from, to) {
                angular.element(element[0].querySelector('input.range')).val(from + ' - ' + to);
            };

            $scope.initSlider();

            $scope.$watch('min',
                function(newValue) {
                    if(newValue) {
                        angular.element(element[0].querySelector('.slider-range')).slider('option', 'min', $scope.min);

                        if($scope.begin !== null && $scope.begin < $scope.min) {
                            angular.element(element[0].querySelector('.slider-range')).slider('values', 0, $scope.min);
                        }

                        $scope.updateRange(angular.element(element[0].querySelector('.slider-range')).slider('values', 0), 
                                angular.element(element[0].querySelector('.slider-range')).slider('values', 1));
                        
                        
                    }
                }
            );


            $scope.$watch('max',
                function(newValue) {
                    if(newValue) {
                        angular.element(element[0].querySelector('.slider-range')).slider('option', 'max', $scope.max);
                        
                        if($scope.end !== null && $scope.end > $scope.max) {
                            angular.element(element[0].querySelector('.slider-range')).slider('values', 1, $scope.max);
                        }

                        $scope.updateRange(angular.element(element[0].querySelector('.slider-range')).slider('values', 0), 
                                angular.element(element[0].querySelector('.slider-range')).slider('values', 1));
                    }
                }
            );
        }
    };
});