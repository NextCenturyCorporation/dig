'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $location, $modal, $state, User) {
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

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.openAbout = function () {
        $modal.open({
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        });
    };

    $scope.userPreferences = function() {
        $modal.open({
            templateUrl: 'app/user/user-prefs.html',
            controller: 'UserPrefsCtrl',
            size: 'sm'
        });
    };

    $scope.changeTab = function (link) {
      if(link == '/list') {
        $state.go('search.results.list');
      } else if(link == '/queries') {
        $state.go('queries');
      }
    };

  });