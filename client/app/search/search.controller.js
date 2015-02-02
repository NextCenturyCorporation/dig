'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', 'imageSearchService', 'euiSearchIndex', 'euiConfigs', 'blurImageService',
    function($scope, $state, $http, imageSearchService, euiSearchIndex, euiConfigs, blurImageService) {
    $scope.showresults = false;
    $scope.currentOpened = 0;
    $scope.selectedImage = 0;
    $scope.queryString = {live: '', submitted: ''};
    $scope.loading = false;
    $scope.imagesimLoading = false;
    $scope.searchConfig = {};
    $scope.searchConfig.filterByImage = false;

    $scope.searchConfig.euiSearchIndex = '';

    $scope.imageSearchResults = {};
    $scope.euiConfigs = euiConfigs;
    $scope.facets = euiConfigs.facets;
    $scope.opened = [];
    $scope.filterStates = {
        aggFilters: {},
        textFilters: {}
    };
    $scope.isBlurred = blurImageService.getBlurImagesEnabled() === 'blur' || blurImageService.getBlurImagesEnabled() === 'pixelate';

    $scope.changeBlur = function() {
        blurImageService.changeBlurImagesEnabled($scope.isBlurred);
    };

    $scope.removeAggFilter = function(key1, key2) {
        $scope.filterStates.aggFilters[key1][key2] = false;
    };

    $scope.removeTextFilter = function(textKey) {
        $scope.filterStates.textFilters[textKey].live = '';
        $scope.filterStates.textFilters[textKey].submitted = '';
    };

    $scope.submit = function() {
        $scope.queryString.submitted = $scope.queryString.live;
        if(!$scope.searchConfig.euiSearchIndex) {
            $scope.searchConfig.euiSearchIndex = euiSearchIndex;
        }
        $scope.viewList();
    };

    $scope.clearSearch = function() {
        $scope.queryString.live = '';
        $scope.submit();
    };

    $scope.reload = function() {    
        $state.go('search.list', {}, {'reload': true});
    };

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
        var src = '';
        var currentSearch = imageSearchService.getActiveImageSearch();

        // Default behavior.  Grab the only cached versions of the images from our docs.
        if (doc._source.hasImagePart && doc._source.hasImagePart.cacheUrl) {
            src = doc._source.hasImagePart.cacheUrl;
        } else if (doc._source.hasImagePart[0] && doc._source.hasImagePart[0].cacheUrl) {
            src = doc._source.hasImagePart[0].cacheUrl;
        }

        // If we have an active image search, check for a matching image.
        if (imageSearchService.getActiveImageSearch() && doc._source.hasFeatureCollection.similar_images_feature) {
            var imgFeature = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                function(item) { return item.featureValue === currentSearch.url; });

            // Verify that the current search url is in the similar images feature.  If so, select the matching
            // image.
            if (imgFeature) {
                var imgObj = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                    function(item) { return (typeof item.featureObject !== 'undefined'); });
                var imgMatch = _.find(doc._source.hasImagePart,
                    function(part) { return (part.uri === imgObj.featureObject.imageObjectUris[0]); });
                src = (imgMatch && imgMatch.cacheUrl) ? imgMatch.cacheUrl : src;
            }
        }

        return src;
    };

    $scope.toggleListItemOpened = function(index) {
        $scope.opened[index] = !($scope.opened[index]);
    };

    $scope.isListItemOpened = function(index) {
        return ($scope.opened[index]) ? true : false;
    };

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

    $scope.$watch('indexVM.loading',
        function(newValue, oldValue) {
            if(newValue !== oldValue) {
                $scope.loading = newValue;

                if($scope.loading === false && $scope.showresults === false && $scope.queryString.submitted) {
                    $scope.showresults = true;
                    // Reset our page collapse states
                    $scope.opened = [];
                }
            }
        }
    );

    $scope.$watch('indexVM.query', function(){
        // Reset our opened document state and page on a new query.
        $scope.opened = [];
        $scope.indexVM.page = 1;
    });

    if($state.current.name === 'search') {
        $scope.viewList();
    }
}]);
