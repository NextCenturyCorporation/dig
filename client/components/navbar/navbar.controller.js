'use strict';

angular.module('digApp')
  .controller('NavbarCtrl', function ($scope, $location, $modal, $state, User, blurImageService) {
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

    $scope.changeTab = function (link) {
      if(link == '/list') {
        $state.go('search.results.list');
      } else if(link == '/queries') {
        $state.go('queries');
      }
    };

  });