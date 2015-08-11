'use strict';

angular.module('digApp')
.controller('DeleteItemsModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'items', 'childIds', 'id',
    function($scope, $modalInstance, $http, User, items, childIds, id) {
        $scope.currentUser = User.get();

        $scope.delete = function() {
            $http.delete('api/users/reqHeader/folders/' + id, {items: items, childIds: childIds})
            .then(function() {
                $modalInstance.close();
            })
            .catch(function(err) {
                console.log(err);
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
]);