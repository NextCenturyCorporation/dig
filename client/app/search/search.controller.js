'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', 'imageSearchService', 'euiSearchIndex',
    function($scope, $state, $http, imageSearchService, euiSearchIndex) {
    $scope.showresults = false;
    $scope.currentOpened = 0;
    $scope.selectedImage = 0;
    $scope.queryString = {live: '', submitted: ''};
    $scope.loading = true;
    $scope.imagesimLoading = false;
    $scope.searchConfig = {};
    $scope.searchConfig.filterByImage = false;
    $scope.searchConfig.euiSearchIndex = euiSearchIndex;
    $scope.imageSearchResults = {};

    $scope.submit = function () {
        $scope.queryString.submitted = $scope.queryString.live;
    };

    $scope.$watch(
        function() { return $scope.indexVM.loading; },
        function(newValue, oldValue) {
            if(newValue !== oldValue) {
                $scope.loading = newValue;

                if($scope.loading === false && $scope.showresults === false && $scope.queryString.submitted) {
                    $scope.showresults = true;
                }       
            } 
        }
    );

    $scope.closeOthers = function(index, array) {
        if($scope.currentOpened < array.length) {
            array[$scope.currentOpened].isOpen = false;
        }
        $scope.currentOpened = index;
    };

    $scope.viewDetails = function(doc) {
        $scope.doc = doc;
        $state.go('search.list.details');
    };

    $scope.viewList = function() {
        if($scope.doc) {
            $scope.doc = null; 
        }
        $state.go('search.list');
    };

    $scope.getActiveImageSearch = function() {
        return imageSearchService.getActiveImageSearch();
    };

    $scope.clearActiveImageSearch = function() {
        $scope.searchConfig.filterByImage = false;
        imageSearchService.clearActiveImageSearch();
    };

    $scope.selectImage = function(index) {
        $scope.selectedImage = index;
    };

    $scope.imageSearch = function(imgUrl) {
        imageSearchService.imageSearch(imgUrl);
    };

    $scope.getDisplayImageSrc = function(doc) {
        var src = (doc._source.hasImagePart) ? 
            (doc._source.hasImagePart.cacheUrl || doc._source.hasImagePart[0].cacheUrl) : "";

        //var src = doc._source.hasImagePart[0].cacheUrl || doc._source.hasImagePart.cacheUrl;
        var currentSearch = imageSearchService.getActiveImageSearch();

        // If we have an active image search, check for a matching image.
        if (imageSearchService.getActiveImageSearch() && doc._source.hasFeatureCollection.similar_images_feature) {
            var imgFeature = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                function(item) { return item.featureName === "similarimageurl"; });

            if (currentSearch.url === imgFeature.featureValue) {
                var imgObj = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                    function(item) { return (typeof item.featureObject !== "undefined"); });
                var imgMatch = _.find(doc._source.hasImagePart, 
                    function(part) { return (part.uri === imgObj.featureObject.imageObjectUris[0]); });
                src = imgMatch.cacheUrl;
            }
        }

        return src;
    }

    $scope.$watch(function() {
            return imageSearchService.getActiveImageSearch();
        }, function(newVal) {
            if(newVal) {
                if(newVal.status === 'searching') {
                    $scope.imagesimLoading = true;
                } else if(newVal.status === 'success') {
                    // If our latest img search was successful, re-issue our query and
                    // enable our image filter.
                    $scope.imagesimLoading = false;
                    $scope.searchConfig.filterByImage = true;
                } else {
                    $scope.imagesimLoading = false;
                    $scope.searchConfig.filterByImage = false;
                }
            } else {
                $scope.imagesimLoading = false;
                $scope.searchConfig.filterByImage = false;
            }
        },
        true);

    if($state.current.name === 'search') {
        $scope.viewList();
    }
}]);
