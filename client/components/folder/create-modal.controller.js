'use strict';

angular.module('digApp')
.controller('CreateModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folders', 'currentFolder', 'items',
    function($scope, $modalInstance, $http, User, folders, currentFolder, items) {
    $scope.currentUser = User.get();
    $scope.currentFolder = currentFolder;
    $scope.folders = folders;
    $scope.folderName = "";
    $scope.items = items;

    $scope.isDisabled = function() {
     return ($scope.folderName.length === 0 || !$scope.parentFolder);
    };

    $scope.create = function () {
      var children = [];
      if($scope.currentFolder._id) {
        children.push($scope.currentFolder._id);
      }

      $http.post('api/folders',
        {name: $scope.folderName, username: $scope.currentUser.username,
          parentId: $scope.parentFolder._id, childIds: children, items: $scope.items});
      
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.close();
    };

}]);