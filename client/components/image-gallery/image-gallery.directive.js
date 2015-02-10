'use strict';

angular.module('digApp.directives')
.directive('imageGallery', function($compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'components/image-gallery/image-gallery.partial.html',
        link: function($scope, elem) {

            $scope.renderExpander = function(clickEvent) {
                var el = clickEvent.target;

                $scope.addExpandedList(el, true);
            };

            $scope.addExpandedList = function(el, toggle) {
                $('#gallery-expander').remove();

                var parentEl = getParentEl(el);
                var docNum = parentEl[0].attributes['gallery-index'].value;
                var insertAfterEl = findRowLastEl(parentEl);

                insertAfterEl.after($compile('<expanded-listing-view id="gallery-expander" doc="indexVM.results.hits.hits[' + docNum + ']" '+
                    'get-display-image-src="getDisplayImageSrc" view-details="viewDetails" parent-state="gallery"></expanded-listing-view>')($scope));

                if(toggle) {
                    var doc = $scope.indexVM.results.hits.hits[docNum];
                    $scope.toggleGalleryItemOpened($scope.indexVM.page, doc._id, docNum);
                }
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

            $scope.checkIfElementOpened = function() {
                $timeout(function() {
                    if($scope.isGalleryItemOpened($scope.indexVM.page)) {
                        var docNum = $scope.galleryView[$scope.indexVM.page].docNum;
                        var pageEl = elem[0].querySelector('div[gallery-index="' + docNum + '"] img');

                        $scope.addExpandedList(pageEl, false);
                    } else {
                        $('#gallery-expander').remove();
                    }
                });
            };


            $scope.checkIfElementOpened();

            $scope.$watch('indexVM.page', function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    $scope.checkIfElementOpened();
                }
            });

        }
    };
});