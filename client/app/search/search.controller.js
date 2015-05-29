'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$modal', 'imageSearchService',
    function($scope, $state, $modal, imageSearchService) {
      
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

      $scope.removeAggFilter = function(key1, key2) {
          $scope.filterStates.aggFilters[key1][key2] = false;
      };

      $scope.removeMissingFilter = function(key) {
          $scope.includeMissing.aggregations[key].active = false;
      };

      $scope.removeDateFilter = function(key1, key2) {
          $scope.filterStates.dateFilters[key1][key2] = null;
      };
      
      $scope.removeTextFilter = function(textKey) {
          $scope.filterStates.textFilters[textKey].live = '';
          $scope.filterStates.textFilters[textKey].submitted = '';
      };

      $scope.clearSearch = function() {
          $scope.queryString.live = '';
          $scope.submit();
      };

      // Used in testing
      $scope.reload = function() {
          $state.go('main.search.results.list', {}, {
              reload: true
          });
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
}]);
