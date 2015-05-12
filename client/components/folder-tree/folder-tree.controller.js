'use strict';

angular.module('digApp')
  .controller('FolderTreeCtrl', function ($scope) {
    $scope.toggle = function(scope) {
      scope.toggle();
    };

  });