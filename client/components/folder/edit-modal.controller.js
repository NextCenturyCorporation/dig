'use strict';

angular.module('digApp')
.controller('EditModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folder',
    function($scope, $modalInstance, $http, User, folder) {
    $scope.folderName = folder.name;
    $scope.currentUser = User.get();

    $scope.save = function () {
      $http.put('api/folders/' + folder._id, {name: $scope.folderName, parentId: folder.parentId});
      $modalInstance.close();
    };

    $scope.delete = function() {
      $http.delete('api/folders/' + folder._id);
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };


}]);