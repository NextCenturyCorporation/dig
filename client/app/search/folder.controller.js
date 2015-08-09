'use strict';

angular.module('digApp')
.controller('FolderCtrl', ['$scope', '$http', '$state', 'euiSearchIndex', 'imageSearchService',
    function($scope, $http, $state, euiSearchIndex, imageSearchService) {
      
      $scope.init = function() {
        $scope.showresults = true;
        $scope.filterFolder = {
            enabled: false
        };
        $scope.retrieveFolder();
      };

      // Gets the items and sub-folders in the selected folder for viewing
      $scope.retrieveFolder = function() {
        if($scope.selectedFolder.id) {
          var fldr = _.find($scope.folders, {id: $scope.selectedFolder.id});

          $scope.items = fldr.FolderItems;
          
          // find children for just this selected folder
          $scope.childFolders = [];
          _.forEach($scope.folders, function(folder) {
            if (folder.parentId === fldr.id) {
              $scope.childFolders.push(folder);
            }
          });

          $scope.selectedItems[$scope.selectedItemsKey] = [];
          $scope.selectedChildFolders[$scope.selectedItemsKey] = [];

          $scope.searchConfig.euiSearchIndex = euiSearchIndex;
          $scope.filterFolder.enabled = true;
        }
      };

      // Opens a subfolder on click event
      $scope.openFolder = function(folderId) {
        var selected = $scope.getUpdatedSelected(folderId, $scope.nestedFolders, {});
        $scope.select(selected);
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

      // Reloads the folder view when a folder is selected/deselected
      $scope.$watch('selectedFolder.id',
          function(newValue) {
              if(newValue) {
                $scope.getFolders($scope.retrieveFolder);
              } else {
                $scope.items = [];
                $scope.searchConfig.euiSearchIndex = '';
                $scope.filterFolder.enabled = false;
              }
          }
      );

      $scope.$watch('indexVM.loading',
          function(newValue, oldValue) {
              if(newValue !== oldValue) {
                  $scope.loading = newValue;

                  if($scope.loading === false && $scope.showresults === false && !$scope.indexVM.error) {
                      $scope.showresults = true;
                  }
              }
          }
      );

      $scope.$watch('indexVM.error', function() {
          if($scope.indexVM.error) {
              $scope.loading = false;
              $scope.showresults = false;
              if($scope.activeTab === $scope.FILTER_TAB) {
                $state.go('main.search.error');
              } else {
                $state.go('main.folder.error');
              }
          }
      }, true);

      $scope.init();

    }]);