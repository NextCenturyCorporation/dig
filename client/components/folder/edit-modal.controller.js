'use strict';

angular.module('digApp')
.controller('EditModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folder',
    function($scope, $modalInstance, $http, User, folder) {
        $scope.folderName = folder.name;
        $scope.currentUser = User.get();

        $scope.save = function () {
            $http.put('api/users/reqHeader/folders/' + folder.id, 
                {name: $scope.folderName, parentId: folder.parentId}
            )
            .then(function() {
                $modalInstance.close();
            })
            .catch(function(err) {
                console.log(err);
            });
            
        };

        $scope.deleteFolder = function() {
            $http.delete('api/users/reqHeader/folders/' + folder.id)
            .then(function() {
                $modalInstance.close();
            })
            .catch(function(err) {
                console.log(err);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
]);