'use strict';

angular.module('digApp')
.controller('DeleteItemsModalCtrl', ['$scope', '$modalInstance', '$http', '$q', 'User', 'items', 'childIds', 'id',
    function($scope, $modalInstance, $http, $q, User, items, childIds, id) {
        $scope.currentUser = User.get();

        $scope.delete = function() {
            var folderitems = [];
            items.forEach(function(item) {
                folderitems.push({elasticId: item});
            });

            var request = {
                method: 'DELETE',
                url: 'api/users/reqHeader/folders/' + id + '/folderitems',
                data: {items: folderitems},
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            };
            // first remove folder items, then remove any subfolders
            $http(request)
            .then(function() {
                var ajaxPromises = [];
                childIds.forEach(function(folderid) {
                    ajaxPromises.push($http.delete('api/users/reqHeader/folders/' + folderid));
                });

                return $q.all(ajaxPromises);
            })
            .then(function() {
                $modalInstance.close();
            })
            .catch(function(err) {
                console.log('error removing folders');
                $modalInstance.close();
                console.log(err);
            }); 
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
]);