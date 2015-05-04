'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $location, $modal, User, blurImageService) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/list',
      'icon':'glyphicon glyphicon-home',
      'reload': true
    }, {
      'title': 'Search Queries',
      'link': '/queries',
      'count': 1, // hard coded notification count for now
      'reload': true
    }];

    $scope.isCollapsed = true;
    $scope.getCurrentUser = User.get();

    $scope.isActive = function(route) {
      return route === $location.path();
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


  });