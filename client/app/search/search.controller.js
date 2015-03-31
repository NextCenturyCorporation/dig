'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', '$modal', 'imageSearchService', 'euiSearchIndex', 'euiConfigs', 'blurImageService',
    function($scope, $state, $http, $modal, imageSearchService, euiSearchIndex, euiConfigs, blurImageService) {
    $scope.showresults = false;
    $scope.queryString = {
        live: '',
        submitted: ''
    };
    $scope.loading = false;
    $scope.imagesimLoading = false;
    $scope.searchConfig = {};
    $scope.searchConfig.filterByImage = false;
    $scope.searchConfig.euiSearchIndex = '';
    $scope.imageSearchResults = {};
    $scope.euiConfigs = euiConfigs;
    $scope.facets = euiConfigs.facets;
    $scope.filterStates = {
        aggFilters: {},
        textFilters: {},
        dateFilters: {}
    };
    $scope.isBlurred = blurImageService.getBlurImagesEnabled() === 'blur' || blurImageService.getBlurImagesEnabled() === 'pixelate';
    $scope.includeMissing = {
        aggregations: {},
        allIncludeMissing: false
    };

    $scope.changeBlur = function() {
        $scope.isBlurred = !$scope.isBlurred;
        blurImageService.changeBlurImagesEnabled($scope.isBlurred);
    };

    $scope.openAbout = function() {
        $modal.open({
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        });
    };

    $scope.removeAggFilter = function(key1, key2) {
        $scope.filterStates.aggFilters[key1][key2] = false;
    };

    $scope.removeMissingFilter = function(key) {
        $scope.includeMissing.aggregations[key].active = false;
    };

    $scope.setAllIncludeMissing = function() {
        $scope.includeMissing.allIncludeMissing = !$scope.includeMissing.allIncludeMissing;
        for(var aggregation in $scope.includeMissing.aggregations) {
            $scope.includeMissing.aggregations[aggregation].active = $scope.includeMissing.allIncludeMissing;
        }
    };

    $scope.removeDateFilter = function(key1, key2) {
        $scope.filterStates.dateFilters[key1][key2] = null;
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

    $scope.viewList = function() {
        $state.go('search.results.list');
    };

    $scope.toggleImageSearchEnabled = function(searchUrl) {
        imageSearchService.setImageSearchEnabled(searchUrl, !imageSearchService.isImageSearchEnabled(searchUrl));
    };

    $scope.clearSearch = function() {
        $scope.queryString.live = '';
        $scope.submit();
    };

    $scope.reload = function() {
        $state.go('search.results.list', {}, {
            reload: true
        });
    };

    $scope.getActiveImageSearch = function() {
        return imageSearchService.getActiveImageSearch();
    };

    $scope.clearActiveImageSearch = function() {
        $scope.searchConfig.filterByImage = false;
        imageSearchService.clearActiveImageSearch();
    };

    $scope.imageSearch = function(imgUrl) {
        imageSearchService.imageSearch(imgUrl);
    };

    $scope.getDisplayImageSrc = function(doc) {
        var src = '';
        var currentSearch = imageSearchService.getActiveImageSearch();

        // Default behavior.  Grab the only cached versions of the images from our docs.
        if(doc._source.hasImagePart && doc._source.hasImagePart.cacheUrl) {
            src = doc._source.hasImagePart.cacheUrl;
        } else if(doc._source.hasImagePart[0] && doc._source.hasImagePart[0].cacheUrl) {
            src = doc._source.hasImagePart[0].cacheUrl;
        }

        /* jshint camelcase:false */
        // If we have an active image search, check for a matching image.
        if(currentSearch &&
            imageSearchService.isImageSearchEnabled(currentSearch.url) &&
            doc._source.hasFeatureCollection.similar_images_feature) {
            var imgFeature = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                function(item) {
                    return item.featureValue === currentSearch.url;
                });

            // Verify that the current search url is in the similar images feature.  If so, select the matching
            // image.
            if(imgFeature) {
                var imgObj = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                    function(item) {
                        return (typeof item.featureObject !== 'undefined');
                    });
                var imgMatch = _.find(doc._source.hasImagePart,
                    function(part) {
                        return (part.uri === imgObj.featureObject.imageObjectUris[0]);
                    });
                src = (imgMatch && imgMatch.cacheUrl) ? imgMatch.cacheUrl : src;
            }
        }
        /* jshint camelcase:true */

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
                } else if(newVal.status === 'success' && newVal.enabled) {
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

                if($scope.loading === false && $scope.showresults === false && $scope.queryString.submitted && !$scope.indexVM.error) {
                    $scope.showresults = true;
                }
            }
        }
    );

    $scope.$watch('indexVM.error', function() {
        if($scope.indexVM.error) {
            $scope.loading = false;
            $scope.showresults = false;

            $state.go('search.error');
        }
    }, true);

    if($state.current.name === 'search') {
        $scope.viewList();
    }
}]);
