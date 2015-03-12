'use strict';

angular.module('digApp')
.controller('GalleryCtrl', function($scope, $compile) {
    $scope.gallery = {
        rawData: []
    };

    $scope.$watch('indexVM.results', function() {
        $scope.gallery.rawData = ($scope.indexVM.results && $scope.indexVM.results.hits ? $scope.indexVM.results.hits.hits : []);
    }, true);
});