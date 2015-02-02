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
        $scope.gallery.rawData = ($scope.indexVM.results && $scope.indexVM.results.hits ? $scope.indexVM.results.hits.hits : []);
    }, true);
});