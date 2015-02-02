'use strict';

angular.module('digApp')
.controller('GalleryCtrl', function($scope, $compile) {
    $scope.counts = {
        row: 5
    };
    $scope.gallery = {
        formattedData: [],
        rawData: []
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

    $scope.renderExpander = function(clickEvent) {
        var el = clickEvent.target;

        $('#gallery-expander').remove();

        var parentEl = getParentEl(el);
        var docNum = parentEl[0].attributes['gallery-index'].value;
        var insertAfterEl = findRowLastEl(parentEl);

        insertAfterEl.after($compile('<expanded-listing-view id="gallery-expander" doc="indexVM.results.hits.hits[' + docNum + ']" '+
            'get-display-image-src="getDisplayImageSrc"></expanded-listing-view>')($scope));
    };

    var getParentEl = function(el) {
        var parentDiv = $(el).parent().closest('div.gallery-img-container');
        return parentDiv;
    };

    var findRowLastEl = function(parentDiv) {
        var y = parentDiv.position().top;

        var currentEl = parentDiv;
        var nextEl;
        var lastEl;
        while(!lastEl) {
            nextEl = currentEl.next('div.gallery-img-container');
            if(nextEl.length === 0 || (nextEl.position().top > y)) {
                //currentEl is last el or last in row
                lastEl = currentEl;
            } else {
                currentEl = nextEl;
            }
        }
        return lastEl;
    };

    $scope.$watch('indexVM.results', function() {
        console.log("firing data processing");
        $scope.gallery.rawData = ($scope.indexVM.results && $scope.indexVM.results.hits ? $scope.indexVM.results.hits.hits : []);
        $scope.gallery.formattedData = getGalleryData();
    }, true);
});