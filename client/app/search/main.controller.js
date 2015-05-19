'use strict';

// TODO: clean this controller.  loading was being used
// by two $watch handlers.

angular.module('digApp')
.constant('MainConstants', {
  "FILTER_TAB": '#filter',
  "FOLDERS_TAB": '#folders'
})
.controller('MainCtrl', ['$scope', '$state', '$modal', '$location', 'imageSearchService', 'euiSearchIndex', 'euiConfigs', 'MainConstants', '$http',
    function($scope, $state, $modal, $location, imageSearchService, euiSearchIndex, euiConfigs, MainConstants, $http) {
      $scope.FILTER_TAB = MainConstants.FILTER_TAB;
      $scope.FOLDERS_TAB = MainConstants.FOLDERS_TAB
      $scope.searchConfig = {};
      $scope.searchConfig.filterByImage = false;
      $scope.searchConfig.euiSearchIndex = '';
      $scope.loading = false;
      $scope.imagesimLoading = false;
      $scope.euiConfigs = euiConfigs;
      $scope.facets = euiConfigs.facets;
      $scope.nestedFolders = [];
      $scope.selectedFolder = {};
      $scope.validMoveFolders = [];
      $scope.activeTab = '';
      $scope.tabs = [
      {
        'title': 'Filter',
        'link': $scope.FILTER_TAB
      }, {
        'title': 'Folders',
        'link': $scope.FOLDERS_TAB
      }];

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

        $scope.getFolders();
        $scope.isActive();

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
          $scope.activeTab = $scope.FILTER_TAB;
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

      // Updates which tab is active
      $scope.isActive = function() {
        var path = $location.path();
        
        if(path == '/gallery' || path == '/list') {
          $scope.activeTab = $scope.FILTER_TAB;
          return true;
        } else if(path == '/folder') {
          $scope.activeTab = $scope.FOLDERS_TAB;
          return true;
        }

        return false;
      }

      $scope.changeTab = function(link) {
        if(link == $scope.FILTER_TAB) {
          $scope.viewList();
        } else {
          $scope.activeTab = $scope.FOLDERS_TAB;
          $scope.selectedFolder = {};
          $scope.validMoveFolders = [];
        }
      };

      // Returns array of valid folders the selected folder (if any) can move to.
      // A folder can move to to anything but itself and any children (recursively)
      $scope.retrieveValidMoveFolders = function() {
        if($scope.selectedFolder._id) {
          var validFolders = [];

          // Push ROOT on first since a folder can always move to it
          validFolders.push({name: $scope.rootFolder.name, _id: $scope.rootFolder._id});

          // Take out itself and all children from the list of valid folders
          validFolders = _filterOutChildren($scope.nestedFolders, $scope.selectedFolder._id, validFolders)

          return validFolders;
        }

        return [];
      };

      // Moves selected folder to given folder
      $scope.moveFolder = function(parentFolder) {
        $http.put('api/folders/' + $scope.selectedFolder._id,
          {name: $scope.selectedFolder.name, parentId: parentFolder._id}).success(function() {
            $scope.getFolders();
          });
      };

      // Selects/Deselects folder and changes to folder view
      $scope.select = function(folder) {
        // Change active tab so folder view shows
        $scope.activeTab = $scope.FOLDERS_TAB;
        $state.go('main.folder');

        // Select/Deselect folder and update folders able to move to
        if(!$scope.selectedFolder._id) {
          $scope.selectedFolder = angular.copy(folder);
          $scope.validMoveFolders = $scope.retrieveValidMoveFolders();
        } else if($scope.selectedFolder._id != folder._id) {
          $scope.selectedFolder = angular.copy(folder);
          $scope.validMoveFolders = $scope.retrieveValidMoveFolders();
        } else {
          $scope.selectedFolder = {};
          $scope.validMoveFolders = [];
        }
      };

      // Updates folders
      $scope.getFolders = function() {
        $http.get('api/folders/').
          success(function(data) {
            $scope.nestedFolders = [];
            $scope.rootFolder = _.find(data, {name: 'ROOT'});

            var rootId = $scope.rootFolder._id;

            var rootFolders = _.filter(data, {parentId: rootId});

            // Put children into root folders (recursively) instead of having a flat list with all folders
            angular.forEach(rootFolders, function(folder) {
              $scope.nestedFolders.push({
                name: folder.name,
                _id: folder._id,
                parentId: folder.parentId,
                children: _getSubfolders(folder._id, data)
              });
            });

            // Update the selectedFolder details (if any)
            if($scope.selectedFolder._id) {
              $scope.selectedFolder = _getUpdatedSelected($scope.selectedFolder._id, $scope.nestedFolders, {});
              $scope.validMoveFolders = $scope.retrieveValidMoveFolders();
              if(!$scope.selectedFolder) {
                $scope.selectedFolder = {};
              }
            }
          });
      };

      // Opens edit modal
      $scope.editFolder = function() {
          var modalInstance = $modal.open({
              templateUrl: 'components/folder/edit-modal.html',
              controller: 'EditModalCtrl',
              resolve: {
                  folder: function() {
                      return $scope.selectedFolder;
                  }
              },
              size: 'sm'
          });

          modalInstance.result.then(function () {
            $scope.getFolders();
          });
      };

      // Opens delete modal
      $scope.deleteFolder = function() {
          var modalInstance = $modal.open({
              templateUrl: 'components/folder/delete-modal.html',
              controller: 'EditModalCtrl',
              resolve: {
                  folder: function() {
                      return $scope.selectedFolder;
                  }
              },
              size: 'sm'
          });

          modalInstance.result.then(function () {
            $scope.getFolders();
          });
      };

      // Opens create folder modal
      $scope.createFolder = function() {
          var modalInstance = $modal.open({
              templateUrl: 'components/folder/create-modal.html',
              controller: 'CreateModalCtrl',
              resolve: {
                  folders: function() {
                    // Get valid folders to move folder to
                    var validFolders = [];
                    validFolders.push({name: $scope.rootFolder.name, _id: $scope.rootFolder._id});
                    validFolders = _filterOutChildren($scope.nestedFolders, $scope.selectedFolder._id, validFolders)
                    return validFolders;
                  },
                  currentFolder: function() {
                      return $scope.selectedFolder;
                  }
              },
              size: 'sm'
          });

          modalInstance.result.then(function () {
            $scope.getFolders();
          });
      };

      // Returns array of folders with children nested (recursively)
      function _getSubfolders(id, folders) {
        var children = [];
        var childFolders = _.filter(folders, {parentId: id});
        
        angular.forEach(childFolders, function(folder) {
          children.push({
            name: folder.name,
            _id: folder._id,
            parentId: folder.parentId,
            children: _getSubfolders(folder._id, folders)
          });
        });

        return children;
      };

      // Find selectedFolder in given folders array
      function _getUpdatedSelected(id, folders, selected) {
        angular.forEach(folders, function(folder) {
          if(folder._id == id) {
            selected = folder;
          }

          selected = _getUpdatedSelected(id, folder.children, selected);
        });

        return selected;
      };

      // Add folders without id (and children of id) to names array
      function _filterOutChildren(folders, id, names) {
        _.forEach(folders, function(child, index) {
          // Return if found id because we don't want it or any of its children
          if(child._id == id) {
            return;
          }
          names.push({name: child.name, _id: child._id});
          names = _filterOutChildren(child.children, id, names);
        });

        return names;
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

      $scope.init();
    }
  ]
);
