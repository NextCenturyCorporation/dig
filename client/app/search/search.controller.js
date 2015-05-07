'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', '$modal', 'imageSearchService', 'euiSearchIndex', 'euiConfigs',
    function($scope, $state, $http, $modal, imageSearchService, euiSearchIndex, euiConfigs) {
    $scope.loading = false;
    $scope.imagesimLoading = false;
    $scope.searchConfig = {};
    $scope.searchConfig.filterByImage = false;
    $scope.searchConfig.euiSearchIndex = '';
    $scope.imageSearchResults = {};
    $scope.euiConfigs = euiConfigs;
    $scope.facets = euiConfigs.facets;
    $scope.hasNotification = false; // TODO: placeholder for real schema change
    $scope.stringDate = '2015-05-02';// TODO: placeholder date for lastRunDate

    $scope.saveQuery = function() {
        $modal.open({
            templateUrl: 'app/queries/save-query.html',
            controller: 'SaveQueryCtrl',
            resolve: {
                digState: function() {
                    return {
                        searchTerms: $scope.queryString.submitted,
                        filters: $scope.filterStates,
                        includeMissing: $scope.includeMissing,
                        selectedSort: $scope.selectedSort
                    };
                }, elasticUIState: function() {
                    return {
                        queryState: $scope.indexVM.query.toJSON(),
                        filterState: $scope.indexVM.filters.getAsFilter() ? $scope.indexVM.filters.getAsFilter().toJSON() : {}
                    };
                }
            },
            size: 'sm'
        });
    };

    $scope.init = function() {
        $scope.showresults = false;
        $scope.queryString = {
            live: '', submitted: ''
        };
        $scope.filterStates = {
            aggFilters: {},
            textFilters: {},
            dateFilters: {}
        };
        $scope.includeMissing = {
            aggregations: {},
            allIncludeMissing: false
        };

        $scope.selectedSort = {};

        if($state.params && $state.params.query && $state.params.query.digState) {

            if($state.params.query.digState.searchTerms) {
                $scope.queryString.live = $state.params.query.digState.searchTerms;
            }

            if($state.params.query.digState.filters) {
                if($state.params.query.digState.filters.aggFilters) {
                    $scope.filterStates.aggFilters = _.cloneDeep($state.params.query.digState.filters.aggFilters);
                }

                if($state.params.query.digState.filters.textFilters) {
                    $scope.filterStates.textFilters = _.cloneDeep($state.params.query.digState.filters.textFilters);
                }

                if($state.params.query.digState.filters.dateFilters) {
                    $scope.filterStates.dateFilters = _.cloneDeep($state.params.query.digState.filters.dateFilters);
                }

                if($state.params.query.digState.filters.withImagesOnly) {
                    $scope.filterStates.withImagesOnly = $state.params.query.digState.filters.withImagesOnly;
                }
            }
            
            if($state.params.query.digState.includeMissing) {
                $scope.includeMissing = _.cloneDeep($state.params.query.digState.includeMissing);
            }

            if($state.params.query.hasNotification) {
                $scope.hasNotification = $state.params.query.hasNotification;
            } else if($state.params.query.digState.selectedSort) {
                $scope.selectedSort = _.cloneDeep($state.params.query.digState.selectedSort);
            }

            $scope.$on('$locationChangeSuccess', function() {
                if($state.current.name === 'search.results.list') {
                    $scope.submit();
                }
            });
        }
    };

    $scope.clearNotification = function() {
        if($state.params.query && $scope.hasNotification && $scope.notificationLastRun) {
            $scope.notificationLastRun = null;
            $scope.hasNotification = false;
            $http.put('api/queries/' + $state.params.query._id, {hasNotification: false});
        }
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
        if($state.params.query && $scope.hasNotification) {
            if(!$scope.notificationLastRun) {
                $scope.notificationLastRun = new Date($scope.stringDate);//new Date($state.params.query.lastRunDate);  
            } else {
                $scope.notificationLastRun = null;
                $scope.hasNotification = false;
                $http.put('api/queries/' + $state.params.query._id, {hasNotification: false});
            }
        }

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

    $scope.highlightResult = function(doc) {
        if($scope.hasNotification && $scope.notificationLastRun && $scope.indexVM.sort) {
            return $scope.indexVM.sort.field() === '_timestamp' && doc.sort[0] > $scope.notificationLastRun.getTime();
        } else {
            return false;
        }
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


                if($scope.indexVM.sort && $scope.indexVM.sort.field() !== '_timestamp') {
                    $scope.clearNotification();
                }
            }
        }
    );

    $scope.$watch('indexVM.filters', function(newVal) {
        if(newVal) {
            $scope.clearNotification();
        } 
    }, true);

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



    $scope.init();
}]);
