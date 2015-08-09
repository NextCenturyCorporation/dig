'use strict';

angular.module('digApp')
.controller('EditModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folder',
    function($scope, $modalInstance, $http, User, folder) {
    $scope.folderName = folder.name;
    $scope.currentUser = User.get();

    $scope.save = function () {
      $http.put('api/users/reqHeader/folders/' + folder.id, {name: $scope.folderName, parentId: folder.parentId});
      $modalInstance.close();
    };

    $scope.deleteFolder = function() {
      $http.delete('api/users/reqHeader/folders/' + folder.id);
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };


}]);