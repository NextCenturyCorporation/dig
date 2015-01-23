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
        link: function($scope, $element) {
            $scope.facetCount = 0;
            $scope.showAll = false;
            $scope.userDisplayCount = -1;
            $scope.displayBuckets = [];

            $scope.buttonStatus = {
                more: false,
                less: false,
                all: false
            };

            $element.addClass('checkbox-filter-list');

            $scope.more = function() {
                if($scope.userDisplayCount < $scope.facetCount) {
                    $scope.userDisplayCount += 10;
                    $scope.resetDisplayBuckets();
                }
            };

            $scope.less = function() {
                if($scope.userDisplayCount > 10) {
                    $scope.userDisplayCount -= 10;
                    if ($scope.userDisplayCount < 10) {
                        $scope.userDisplayCount = 10;
                    }
                    $scope.resetDisplayBuckets();
                }
            };

            $scope.all = function() {
                if($scope.facetCount > 10) {
                    if ($scope.showAll) {
                        $scope.userDisplayCount = $scope.lastDisplayCount;
                    } else {
                        $scope.lastDisplayCount = $scope.userDisplayCount;
                        $scope.userDisplayCount = (Math.floor($scope.facetCount / 10) * 10) + 10;
                    }
                    $scope.showAll = !$scope.showAll;

                    $scope.resetDisplayBuckets();
                }
            };

            var disableButtons = function() {
                $scope.buttonStatus.moreButton = ($scope.userDisplayCount >= $scope.facetCount);
                $scope.buttonStatus.lessButton = ($scope.userDisplayCount <= 10);
                $scope.buttonStatus.allButton = ($scope.facetCount <= 10);
            };

            $scope.getAggregationTermBucket = function(term) {
                var aggObj = null;

                // Return false if we have no aggregations or none on that field.
                if (!$scope.buckets) {
                    return false;
                }

                aggObj = (_.filter($scope.buckets, function(bucket) {
                        return (bucket.key && bucket.key == term);
                    }));

                return (aggObj.length !== 0) ? aggObj[0] : false;
            };

            $scope.resetDisplayBuckets = function() {
                disableButtons();

                $scope.displayBuckets = [];
                var checkedItems = [];
                var bucket;

                // Reset display count if necessary.
                $scope.userDisplayCount = ($scope.userDisplayCount < 0) ? $scope.searchCount : $scope.userDisplayCount;

                // Get checked items and add to display buckets if they dropped out of our aggregations.
                for (var term in $scope.filterStates[$scope.aggregationName]) {
                    if ($scope.filterStates[$scope.aggregationName].hasOwnProperty(term) &&
                        $scope.filterStates[$scope.aggregationName][term]) {
                        checkedItems.push(term);
                        /* jshint camelcase:false */
                        bucket = ($scope.getAggregationTermBucket(term) || {
                            key: term,
                            doc_count: 0
                        });
                        /* jshint camelcase:true */
                        $scope.displayBuckets.push(bucket);
                    }
                }

                // fill the rest of display buckets with the aggregation buckets.
                var numBuckets = ($scope.buckets) ? $scope.buckets.length : 0;
                var remainingBucketSlots = Math.min($scope.userDisplayCount, numBuckets) - checkedItems.length;
                var i = 0;

                while (remainingBucketSlots > 0) {
                    if (!_.contains(checkedItems, $scope.buckets[i].key)) {
                       $scope.displayBuckets.push($scope.buckets[i]);
                       remainingBucketSlots--;
                    }
                    i++;
                }
            };

            $scope.$watch('buckets', function() {
                $scope.facetCount = ($scope.buckets ? $scope.buckets.length : 0);

                $scope.resetDisplayBuckets();
            }, true);
        }
    };
});