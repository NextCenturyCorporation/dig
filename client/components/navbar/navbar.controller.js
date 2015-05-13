'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $state, $location, $modal, $http, User, blurImageService) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/list',
      'icon':'glyphicon glyphicon-home',
      'reload': true
    }, {
      'title': 'Saved Queries',
      'link': '/queries',
      'reload': true
    }];

    $scope.isCollapsed = true;
    $scope.getCurrentUser = User.get();
    $scope.notificationCount = User.notificationCount();

    $scope.isActive = function(route) {
      return route === $location.path();
    };

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

    // settings methods
    $scope.isBlurred = blurImageService.getBlurImagesEnabled();

    $scope.changeBlur = function() {
        $scope.isBlurred = !$scope.isBlurred;
        blurImageService.changeBlurImagesEnabled($scope.isBlurred);
    };

    $scope.openAbout = function () {
        $modal.open({
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        });
    };

    $scope.getQueriesWithNotifications();

  });