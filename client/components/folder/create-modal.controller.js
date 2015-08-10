'use strict';

angular.module('digApp')
.controller('CreateModalCtrl', ['$scope', '$modalInstance', '$http', 'User', 'folders', 'currentFolder', 'items', 'childIds',
    function($scope, $modalInstance, $http, User, folders, currentFolder, items, childIds) {
        $scope.currentUser = User.get();
        $scope.currentFolder = currentFolder;
        $scope.folders = folders;
        $scope.folderName = '';
        $scope.items = items;
        $scope.childIds = childIds;

        $scope.isDisabled = function() {
            return ($scope.folderName.length === 0 || !$scope.parentFolder);
        };


        $scope.createFolder = function () {
            var children = [];
            if($scope.currentFolder.id) {
                children.push($scope.currentFolder.id);
            } else if($scope.childIds.length){
                children = $scope.childIds;
            }

            $http.post('api/users/reqHeader/folders',
                {name: $scope.folderName, parentId: $scope.parentFolder.id}
                )
            .then(function(folder){
                console.log(JSON.stringify(folder));
                $modalInstance.close();
            })
            .catch(function(err) {
                console.log(err);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

    }]);