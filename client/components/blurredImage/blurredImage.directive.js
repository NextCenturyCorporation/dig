'use strict';


angular.module('digApp.directives')
.directive('blurredImage', function(blurImageService, $timeout) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var fallback = false;
            var blurImagesEnabled = blurImageService.getBlurImagesEnabled();
            var blurImagesPercentage = blurImageService.getBlurImagesPercentage();

            if(blurImagesEnabled) {
                element.addClass('image-blur-default');
            }

            $scope.getMaxSize = function() {
                return Math.max(element.height(), element.width());
            };

            var cssBlur = function() {

                if($scope.getMaxSize() !== 0) {
                    addCssBlur();
                } else {
                    // If image has no height/width, it could be because it 
                    // isn't yet loaded. Wait for image to load and try again.
                    element.on('load', function() {
                        addCssBlur();
                    });
                }

                if(element.hasClass('image-blur-default')) {
                    element.removeClass('image-blur-default');
                }
            };

            var addCssBlur = function() {
                var blurSize = ($scope.getMaxSize() * (blurImagesPercentage / 100));

                element.css({
                    '-webkit-filter': 'blur(' + blurSize + 'px)',
                    '-webkit-transform': 'translate3d(0, 0, 0)',
                    '-moz-filter': 'blur(' + blurSize + 'px)',
                    '-o-filter': 'blur(' + blurSize + 'px)',
                    '-ms-filter': 'blur(' + blurSize + 'px)',
                    'filter': 'blur(' + blurSize + 'px)'
                });
            };

            var blurImage = function() {
                if(!fallback && blurImagesEnabled) {
                    fallback = true;

                    $scope.$watch($scope.getMaxSize, function() {
                        cssBlur();
                    });

                    $timeout(cssBlur);
                } else if(fallback || blurImagesEnabled) {
                    $timeout(cssBlur);
                }
            };

            $scope.processImageBlur = function() {
                blurImagesEnabled = blurImageService.getBlurImagesEnabled();
                blurImagesPercentage = blurImageService.getBlurImagesPercentage();

                blurImage();
            };

            attrs.$observe('src', function() {
                $scope.processImageBlur();
            });

            $scope.$on('blur-state-change', function() {
                $scope.processImageBlur();
            });
        }
    };
});