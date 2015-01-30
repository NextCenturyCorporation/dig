'use strict';

angular.module('digApp')
.controller('GalleryCtrl', function($scope) {
    $scope.counts = {
        row: 5
    };
    $scope.gallery = {
        formattedData: []
    };

    var getGalleryData = function() {
        var galleryData = [];
        var rowData;
        var displayCount = ($scope.indexVM.results && $scope.indexVM.results.hits ? $scope.indexVM.results.hits.hits.length : 0);

        var i;
        var j;
        var dataIndex;
        for(i = 0; i < (displayCount / $scope.counts.row); i++) {
            rowData = [];
            for(j = 0; j < $scope.counts.row; j++) {
                dataIndex = (i * $scope.counts.row) + j;

                rowData.push($scope.indexVM.results.hits.hits[dataIndex]);
            }
            galleryData.push(rowData);
        }

        return galleryData;
    };

    $scope.$watch('indexVM.results', function() {
        console.log("firing data processing");
        $scope.gallery.formattedData = getGalleryData();
    }, true);
});