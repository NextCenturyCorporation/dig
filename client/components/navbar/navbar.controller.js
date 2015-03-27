'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $location, User) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/list',
      'icon':'glyphicon glyphicon-home',
      'reload': true
    }, {
      'title': 'Search Queries',
      'link': '/queries',
      'reload': true
    }];

    $scope.isCollapsed = true;
    $scope.getCurrentUser = User.get();

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });