'use strict';

angular.module('digApp')
.controller('SearchResultsCtrl', ['$scope', '$state', '$sce', 'imageSearchService', 
    function($scope, $state, $sce, imageSearchService) {
    $scope.opened = [];
    $scope.displayMode = {
        mode: 'list'
    };
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

    $scope.setImageSearchMatchIndices = function() {
        var doc = $scope.doc;
        var currentSearch, imgFeature;
        $scope.selectedImage = -1;
        $scope.imageMatchStates = [];

        /* jshint camelcase:false */
        // If we have an active image search and multiple image parts, check for a matching image.
        if (imageSearchService.getActiveImageSearch() && imageSearchService.getActiveImageSearch().enabled &&
            doc._source.hasFeatureCollection.similar_images_feature &&
            doc._source.hasImagePart.length > 0) {
            currentSearch = imageSearchService.getActiveImageSearch();
            imgFeature = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                function(item) { return item.featureValue === currentSearch.url; });

            // Verify that the current search url is in the similar images feature.  If so, select the matching
            // image.
            if (imgFeature) {
                var imgObj = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                    function(item) { return (typeof item.featureObject !== 'undefined'); });

                _.each(doc._source.hasImagePart, function(part, index) {
                    $scope.imageMatchStates[index] = _.contains(imgObj.featureObject.imageObjectUris, part.uri);
                    if ($scope.imageMatchStates[index] && $scope.selectedImage < 0) {
                        $scope.selectedImage = index;
                    }
                });
            }
        }
        /* jshint camelcase:true */

        // Set to selected index to 0 if no matches were found.
        $scope.selectedImage = ($scope.selectedImage >= 0) ? $scope.selectedImage : 0;
    };

    

    $scope.$watch('indexVM.query', function(){
        // Reset our opened document state and page on a new query.
        $scope.opened = [];
        $scope.galleryItem = {};
        $scope.indexVM.page = 1;
    });

    $scope.$watch(function() {
            return imageSearchService.getActiveImageSearch();
        }, function() {
            if ($scope.doc) {
                $scope.setImageSearchMatchIndices();
            }
        }, true);

}]);