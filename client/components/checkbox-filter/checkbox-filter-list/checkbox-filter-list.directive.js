'use strict';

angular.module('digApp.directives')
.directive('checkboxFilterList', function() {
    return {
        restrict: 'E',
        scope: {
            aggregationName: '@',
            aggregationKey: '@',
            searchCount: '=',
            buckets: '=',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '=',
            filterStates: '='
        },
        templateUrl: 'components/checkbox-filter/checkbox-filter-list/checkbox-filter-list.partial.html',
        link: function($scope) {
            $scope.facetCount = 0;
            $scope.buttonStatus = {
                more: false,
                less: false,
                all: false
            };

            $scope.more = function() {
                $scope.searchCount = $scope.facetCount + 10;
            };

            $scope.less = function() {
                if($scope.facetCount % 10 === 0) {
                    $scope.searchCount = $scope.facetCount - 10;
                } else if($scope.facetCount > 20) {
                    $scope.searchCount = $scope.facetCount - (10 + ($scope.facetCount % 10));
                } else {
                    $scope.searchCount = $scope.facetCount - ($scope.facetCount % 10);
                }
            };

            $scope.all = function() {
                $scope.searchCount = 0;
            };

            var disableButtons = function() {
                console.log(($scope.searchCount === $scope.facetCount));
                $scope.buttonStatus.moreButton = ($scope.searchCount === $scope.facetCount);
                $scope.buttonStatus.lessButton = ($scope.searchCount > 10 || $scope.searchCount === 0);
                $scope.buttonStatus.allButton = ($scope.searchCount === $scope.facetCount);
            };

            $scope.$watch('buckets', function() {
                $scope.facetCount = ($scope.buckets ? $scope.buckets.length : 0);
                disableButtons();
            }, true);
        }
    };
});