'use strict';

angular.module('digApp')
  .controller('NotificationsCtrl', function ($scope, $state, $http, User) {

    $scope.notificationCount = User.notificationCount();

    $scope.getQueriesWithNotifications = function() {
        $http.get('api/users/reqHeader/queries/notifications').
          success(function(data) {
              $scope.queriesWithNotifications = data;
          });
    };

    $scope.runQuery = function(query) {
        if($state.current.name === 'search.results.list') {
            $state.go('search.results.list', {
                query: query, callSubmit: true
            }, {
                location: true
            });
        } else {
            $state.go('search.results.list', {
                query: query
            }, {
                location: true
            });
        }
    };

    $scope.getQueriesWithNotifications();

});