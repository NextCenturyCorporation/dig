'use strict';

angular.module('digApp')
.controller('SearchResultsCtrl', function($scope, $state, $sce) {
    $scope.opened = [];
    $scope.displayMode = {
        mode: 'list'
    };
    $scope.sortOptions = $scope.euiConfigs.sort.options;
    $scope.selectedSort = $scope.euiConfigs.sort.defaultOption;
    $scope.indexVM.pageSize = 25;
    $scope.selectedImage = 0;
    $scope.galleryItem = {};

    $scope.selectImage = function(index) {
        $scope.selectedImage = index;
    };

    $scope.stripHtml = function(data) {
        return $sce.trustAsHtml(String(data).replace(/<(?!\/?mark\s*\/?)[^>]+>/gm, ''));
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
        $scope.clearGalleryItem();
        $scope.displayMode.mode = 'list';
        $state.go('search.results.list');
    };

    $scope.toggleListItemOpened = function(index) {
        $scope.opened[index] = !($scope.opened[index]);
    };

    $scope.isListItemOpened = function(index) {
        return ($scope.opened[index]) ? true : false;
    };

    $scope.toggleGalleryItemOpened = function(id, index) {
        $scope.galleryItem = {docId: id, docNum: index};
    };

    $scope.clearGalleryItem = function() {
        $scope.galleryItem = {};
    };

    $scope.isGalleryItemPopulated = function() {
        if($scope.galleryItem.docId) {
            return true;
        }
        return false;
    };

    $scope.isGalleryItemOpened = function(id) {
        return ($scope.isGalleryItemPopulated() && $scope.galleryItem.docId === id);
    };

    $scope.switchView = function(displayMode) {
        if(displayMode === 'list') {
            $scope.viewList();
        } else if(displayMode === 'gallery') {
            $scope.viewGallery();
        }
    };

    $scope.switchSort = function(index) {
        if($scope.validSortOrder($scope.sortOptions[index].mode)) {
            $scope.euiSortOrder = $scope.sortOptions[index].mode;
        }
        $scope.selectedSort = $scope.sortOptions[index];
    };

    $scope.validSortOrder = function(order) {
        return (order === 'asc' || order === 'desc');
    };

    $scope.euiSortOrder = $scope.validSortOrder($scope.selectedSort.mode) ? $scope.selectedSort.mode : 'desc';

    $scope.$watch('indexVM.query', function(){
        // Reset our opened document state and page on a new query.
        $scope.opened = [];
        $scope.galleryItem = {};
        $scope.indexVM.page = 1;
    });

});