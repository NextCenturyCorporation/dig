'use strict';

angular.module('digApp')
.controller('CreateModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folders', 'currentFolder', 'items', 'childIds',
    function($scope, $modalInstance, $http, User, folders, currentFolder, items, childIds) {
    $scope.currentUser = User.get();
    $scope.currentFolder = currentFolder;
    $scope.folders = folders;
    $scope.folderName = "";
    $scope.items = items;
    $scope.childIds = childIds;

    $scope.isDisabled = function() {
     return ($scope.folderName.length === 0 || !$scope.parentFolder);
    };

    $scope.create = function () {
      var children = [];
      if($scope.currentFolder._id) {
        children.push($scope.currentFolder._id);
      } else if($scope.childIds.length){
        children = $scope.childIds;
      }

      $http.post('api/folders',
        {name: $scope.folderName, username: $scope.currentUser.username,
          parentId: $scope.parentFolder._id, childIds: children, items: $scope.items});
      
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

}]);