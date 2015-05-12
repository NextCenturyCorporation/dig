'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('MainCtrl', ['$scope', '$state', 'imageSearchService', 'euiSearchIndex', 'euiConfigs', '$http',
    function($scope, $state, imageSearchService, euiSearchIndex, euiConfigs, $http) {
      $scope.searchConfig = {};
      $scope.searchConfig.filterByImage = false;
      $scope.searchConfig.euiSearchIndex = '';
      $scope.loading = false;
      $scope.imagesimLoading = false;
      $scope.euiConfigs = euiConfigs;
      $scope.facets = euiConfigs.facets;
      $scope.folders = [];
      $scope.nestedFolders = [];

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

        if($state.params && $state.params.query) {

            if($state.params.query.digState.searchTerms) {
                $scope.queryString.live = $state.params.query.digState.searchTerms;
            }

            if($state.params.query.digState.filters.aggFilters) {
                $scope.filterStates.aggFilters = _.cloneDeep($state.params.query.digState.filters.aggFilters);
            }
            if($state.params.query.digState.filters.textFilters) {
                $scope.filterStates.textFilters = _.cloneDeep($state.params.query.digState.filters.textFilters);
            }

            if($state.params.query.digState.filters.dateFilters) {
                $scope.filterStates.dateFilters = _.cloneDeep($state.params.query.digState.filters.dateFilters);
            }
            
            if($state.params.query.digState.includeMissing) {
                $scope.includeMissing = _.cloneDeep($state.params.query.digState.includeMissing);
            }

            if($state.params.query.digState.selectedSort) {
                $scope.selectedSort = _.cloneDeep($state.params.query.digState.selectedSort);
            }   

            if($state.params.query.digState.filters.withImagesOnly) {
                $scope.filterStates.withImagesOnly = $state.params.query.digState.filters.withImagesOnly;
            }

            $scope.$on('$locationChangeSuccess', function() {
                if($state.current.name === 'main.search.results.list') {
                    $scope.submit();
                }
            });
        }
      };

      $scope.submit = function() {
          $scope.queryString.submitted = $scope.queryString.live;
          if(!$scope.searchConfig.euiSearchIndex) {
              $scope.searchConfig.euiSearchIndex = euiSearchIndex;
          }
          $scope.viewList();
      };

      $scope.viewList = function() {
          $state.go('main.search.results.list');
      };

      $scope.getActiveImageSearch = function() {
          return imageSearchService.getActiveImageSearch();
      };

      $scope.toggleImageSearchEnabled = function(searchUrl) {
          imageSearchService.setImageSearchEnabled(searchUrl, !imageSearchService.isImageSearchEnabled(searchUrl));
      };

      $scope.clearActiveImageSearch = function() {
          $scope.searchConfig.filterByImage = false;
          imageSearchService.clearActiveImageSearch();
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

              $state.go('main.search.error');
          }
      }, true);

      if($state.current.name === 'main') {
          $scope.viewList();
      }

      $http.get('api/folders/').
        success(function(data) {
          $scope.folders = data;
          var rootId = _.find($scope.folders, {name: 'ROOT'})._id;

          var rootFolders = _.filter($scope.folders, {parentId: rootId});

          angular.forEach(rootFolders, function(folder) {
            $scope.nestedFolders.push({
              name: folder.name,
              _id: folder._id,
              children: _getSubfolders(folder._id)
            });
          });
        });

        function _getSubfolders(id) {
          var children = [];
          var childFolders = _.filter($scope.folders, {parentId: id});
          
          angular.forEach(childFolders, function(folder) {
            children.push({
              name: folder.name,
              _id: folder._id,
              children: _getSubfolders(folder._id)
            });
          });

          return children;
        };

      $scope.init();
    }
  ]
);
