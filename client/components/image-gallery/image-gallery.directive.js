'use strict';

angular.module('digApp.directives')
.directive('imageGallery', function($compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'components/image-gallery/image-gallery.partial.html',
        link: function($scope, elem) {

            $scope.resetImageGallery = function() {
                $('#gallery-expander').remove();
                $scope.clearGalleryItem();
            };

            $scope.addExpandedListing = function(parentEl, docNum) {
                var insertAfterEl = findRowLastEl(parentEl);
               
                $('#gallery-expander').remove();
                insertAfterEl.after($compile('<expanded-listing-view id="gallery-expander" doc="indexVM.results.hits.hits[' + docNum + ']" '+
                'get-display-image-src="getDisplayImageSrc" view-details="viewDetails" parent-state="gallery">' +
                '</expanded-listing-view>')($scope));
            };

            $scope.renderExpander = function(clickEvent) {
                var el = clickEvent.target;

                var parentEl = getParentEl(el);
                var docNum = parentEl[0].attributes['gallery-index'].value;
                var doc = $scope.indexVM.results.hits.hits[docNum];

                if($scope.isGalleryItemOpened(doc._id)) {
                    $scope.resetImageGallery();
                } else {
                    $scope.addExpandedListing(parentEl, docNum);
                    $scope.toggleGalleryItemOpened(doc._id, docNum);
                }
            };

            $scope.checkIfElementOpened = function() {
                $timeout(function() {
                    if($scope.isGalleryItemPopulated()) {

                        var docNum = $scope.galleryItem.docNum;
                        var pageEl = elem[0].querySelector('div[gallery-index="' + docNum + '"] img');
                        var parentEl = getParentEl(pageEl);

                        $scope.addExpandedListing(parentEl, docNum);
                    } else {
                        $('#gallery-expander').remove();
                    }
                });
            };

            var getParentEl = function(el) {
                var parentDiv = $(el).parent().closest('div.image-gallery-container');
                return parentDiv;
            };

            var findRowLastEl = function(parentDiv) {
                var y = parentDiv.position().top;

                var currentEl = parentDiv;
                var nextEl;
                var lastEl;
                while(!lastEl) {
                    nextEl = currentEl.next('div.image-gallery-container');
                    if(nextEl.length === 0 || (nextEl.position().top > y)) {
                        //currentEl is last el or last in row
                        lastEl = currentEl;
                    } else {
                        currentEl = nextEl;
                    }
                }
                return lastEl;
            };

            $scope.checkIfElementOpened();

            $scope.$watch('indexVM.page', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    $scope.resetImageGallery();
                }
            });

            $scope.$watch('indexVM.filters', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    $scope.resetImageGallery();
                }
            }, true);

        }
    };
});