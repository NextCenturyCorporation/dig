'use strict';

angular.module('digApp')
.controller('SearchResultsCtrl', function($scope, $state) {
    $scope.openDetailsPageOnLoad = false;
    $scope.opened = [];
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
        $scope.opened = [];
        $scope.indexVM.page = 1;
    });

    if($state.params.id) {
        $scope.openDetailsPageOnLoad = true;
        $scope.$watch("indexVM.results.hits.hits", function(newValue, oldValue) {
            if($scope.openDetailsPageOnLoad && newValue !== oldValue && newValue.length) {
                $scope.viewDetails(newValue[0], "list");
                $scope.openDetailsPageOnLoad = false;
            }
        });
    }
});
