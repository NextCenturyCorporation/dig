'use strict';

angular.module('digApp')
.controller('DeleteItemsModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'items', 'childIds', 'id',
    function($scope, $modalInstance, $http, User, items, childIds, id) {
    $scope.currentUser = User.get();

    $scope.delete = function() {
      $http.put('api/folders/removeItems/' + id, {items: items, childIds: childIds});
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };


}]);