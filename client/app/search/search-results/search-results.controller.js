'use strict';

angular.module('digApp')
.controller('SearchResultsCtrl', function($scope, $state) {
    $scope.opened = [];
    $scope.keepOpened = false;
    $scope.displayMode = {
        mode: 'list'
    };
    $scope.indexVM.pageSize = 25;
    $scope.selectedImage = 0;
    
    $scope.selectImage = function(index) {
        $scope.selectedImage = index;
    };

    $scope.viewDetails = function(doc, previousState) {
        $scope.doc = doc;
        $scope.previousState = previousState;
        $state.go('search.results.details');
    };

    $scope.backToPreviousState = function() {
        if($scope.doc) {
            $scope.doc = null;
            $scope.selectedImage = 0;
        }

        if($scope.previousState && $scope.previousState === 'gallery') {
            $scope.viewGallery();
        } else {
            $scope.viewList();
        }
    };

    $scope.viewGallery = function() {
        $scope.displayMode.mode = 'gallery';
        $state.go('search.results.gallery');
    };

    $scope.viewList = function() {
        $scope.displayMode.mode = 'list';
        $state.go('search.results.list');
    };

    $scope.toggleListItemOpened = function(index) {
        $scope.opened[index] = !($scope.opened[index]);
    };

    $scope.isListItemOpened = function(index) {
        return ($scope.opened[index]) ? true : false;
    };

    $scope.switchView = function(displayMode) {
        if(displayMode === 'list') {
            $scope.viewList();
        } else if(displayMode === 'gallery') {
            $scope.viewGallery();
        }
    };

    $scope.$watch('indexVM.query', function(){
        // Reset our opened document state and page on a new query.
        if(!$scope.keepOpened) {
            $scope.opened = [];
        }
        $scope.keepOpened = false;
        $scope.indexVM.page = 1;
    });

    if($state.params.id) {
        $scope.toggleListItemOpened($state.params.id);
        $scope.keepOpened = true;
    }
});
