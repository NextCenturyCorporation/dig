'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/',
      'icon':'glyphicon glyphicon-home',
      'reload': true
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });