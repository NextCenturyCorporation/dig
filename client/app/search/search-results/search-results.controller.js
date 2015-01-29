'use strict';

angular.module('digApp')
.controller('SearchResultsCtrl', function($scope, $state) {
    $scope.displayMode = {
        mode: 'list'
    };
    $scope.indexVM.pageSize = 50;


    $scope.switchView = function(displayMode) {
        if(displayMode === 'list' && $scope.displayMode.mode !== 'list') {
            $scope.displayMode.mode = 'list';
            $state.go('search.results.list');
        } else if(displayMode === 'gallery' && $scope.displayMode.mode !== 'gallery') {
            $scope.displayMode.mode = 'gallery';
            $state.go('search.results.gallery');
        }
    };
});