'use strict';

angular.module('digApp.directives')
.directive('imageGallery', function($compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/search/search-results/gallery/image-gallery.partial.html',
        link: function($scope, elem) {
            var stylesheet = document.styleSheets[1];
            var ruleIndex = 1;

            $scope.resetImageGallery = function() {
                removeAfterRule();
                $('#gallery-expander').remove();
                $scope.clearGalleryItem();
            };

            $scope.addExpandedListing = function(parentEl, docNum, selectedElem) {
                var insertAfterEl = findRowLastEl(parentEl);
                var leftPos = getLeftPos(selectedElem);
                addAfterRule(leftPos);

                $('#gallery-expander').remove();
                insertAfterEl.after($compile('<expanded-listing-view id="gallery-expander" class="gallery-item-expanded" ' +
                'doc="indexVM.results.hits.hits[' + docNum + ']" get-display-image-src="getDisplayImageSrc" ' +
                'view-details="viewDetails" parent-state="gallery" facets="facets" image-search="imageSearch"></expanded-listing-view>')($scope));
            };

            $scope.renderExpander = function(clickEvent) {
                $timeout(function() {
                    var selectedElem = clickEvent.target;
                    
                    var parentEl = getParentEl(selectedElem);
                    var docNum = parentEl[0].attributes['gallery-index'].value;
                    var doc = $scope.indexVM.results.hits.hits[docNum];

                    // Item is already opened, if user clicks again, it is to collapse the view.
                    if($scope.isGalleryItemOpened(doc._id)) {
                        $scope.resetImageGallery();
                    } else {
                        $scope.addExpandedListing(parentEl, docNum, selectedElem);
                        $scope.toggleGalleryItemOpened(doc._id, docNum);
                    }
                });
            };

            $scope.checkIfElementOpened = function() {
                $timeout(function() {
                    if($scope.isGalleryItemPopulated()) {

                        var docNum = $scope.galleryItem.docNum;
                        var selectedElem = elem[0].querySelector('div[gallery-index="' + docNum + '"] img');
                        var parentEl = getParentEl(selectedElem);
                        var doc = $scope.indexVM.results.hits.hits[docNum];

                        if($scope.isGalleryItemOpened(doc._id)) {
                            $scope.addExpandedListing(parentEl, docNum, selectedElem);
                        } else {
                            // If galleryItem no longer matches with what's on the page, state changed and we need to do cleanup
                            $scope.resetImageGallery();
                        }
                    } 
                });
            };

            var getParentEl = function(selectedElem) {
                var parentDiv = $(selectedElem).parent().closest('div.image-gallery-container');
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

            var getLeftPos = function(selectedElem) {
                var firstElem = elem[0].querySelector('div[gallery-index="0"] img');
                var pixDifference = Math.floor(firstElem.getBoundingClientRect().left);
                var leftPos = Math.floor(selectedElem.getBoundingClientRect().left - pixDifference + selectedElem.getBoundingClientRect().width / 4);
                return leftPos;
            };

            var addAfterRule = function(leftPos) {
                removeAfterRule();

                stylesheet.insertRule('.gallery-item-expanded:after {content: ""; position: absolute; top: -9px; left:' + leftPos + 
                    'px; width: 16px; height: 16px; border: 1px solid #ddd8d4; border-bottom: 0; border-right: 0; background: #ffffff; ' +
                    '-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -ms-transform: rotate(45deg); ' +
                    '-o-transform: rotate(45deg);}', ruleIndex);
            };

            var removeAfterRule = function() {
                if(stylesheet.cssRules[ruleIndex].selectorText === '.gallery-item-expanded::after') {
                    stylesheet.deleteRule(ruleIndex);
                }
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
            
            $scope.$on('$destroy', function() {
                removeAfterRule();
                $('#gallery-expander').remove();
            });
        }
    };
});