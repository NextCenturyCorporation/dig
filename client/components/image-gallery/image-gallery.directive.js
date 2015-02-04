'use strict';

angular.module('digApp.directives')
.directive('imageGallery', function($compile) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'components/image-gallery/image-gallery.partial.html',
        link: function($scope) {
            $scope.renderExpander = function(clickEvent) {
                var el = clickEvent.target;

                $('#gallery-expander').remove();

                var parentEl = getParentEl(el);
                var docNum = parentEl[0].attributes['gallery-index'].value;
                var insertAfterEl = findRowLastEl(parentEl);

                insertAfterEl.after($compile('<expanded-listing-view id="gallery-expander" doc="indexVM.results.hits.hits[' + docNum + ']" '+
                    'get-display-image-src="getDisplayImageSrc" view-details="viewDetails" parent-state="gallery"></expanded-listing-view>')($scope));
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
        }
    };
});