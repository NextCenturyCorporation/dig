'use strict';

angular.module('digApp')
.directive('sort', function() {
    return {
        restrict: 'E',
        scope: {
            indexVM: '=indexvm',
            ejs: '=',
            euiConfigs: '=',
            title: '=',
            order: '=',
            field: '=',
            notificationHasRun: '='
        },
        templateUrl: 'components/sort/sort.partial.html',
        controller: function($scope) {            
            $scope.sortOptions = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.options : [];

            if(!($scope.title && $scope.order && $scope.field)) {
                $scope.title = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.defaultOption.title : '';
                $scope.order = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.defaultOption.order : '';
                $scope.field = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.defaultOption.field : '';
            }

            if($scope.notificationHasRun === false) {
                $scope.title = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.notificationOption.title : '';
                $scope.order = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.notificationOption.order : '';
                $scope.field = $scope.euiConfigs.sort ? $scope.euiConfigs.sort.notificationOption.field : '';
            }

            $scope.validSortOrder = function(order) {
                return (order === 'asc' || order === 'desc');
            };

            $scope.euiSortOrder = $scope.validSortOrder($scope.order) ? $scope.order : 'desc';
        },
        link: function($scope) {
            $scope.switchSort = function(index) {
                $scope.title = $scope.sortOptions[index].title;
                $scope.order = $scope.sortOptions[index].order;
                $scope.field = $scope.sortOptions[index].field;

                if($scope.validSortOrder($scope.sortOptions[index].order)) {
                    $scope.euiSortOrder = $scope.sortOptions[index].order;
                }
            };
        }
    };
});