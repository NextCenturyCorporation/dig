'use strict';


angular.module('digApp.directives')
.directive('blurredImage', function(userPrefsService, $timeout) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var fallback = false;
            var blurImagesEnabled;
            var blurImagesPercentage;

            userPrefsService.getBlurImagesEnabled().then(function(enabled) {
                blurImagesEnabled = enabled;
                if(blurImagesEnabled) {
                    element.addClass('image-blur-default');
                }
                return userPrefsService.getBlurImagesPercentage();
            }).then(function(percentage) {
                blurImagesPercentage = percentage;
            });
            
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

                userPrefsService.getBlurImagesEnabled().then(function(enabled) {
                    blurImagesEnabled = enabled;
                    return userPrefsService.getBlurImagesPercentage();
                }).then(function(percentage) {
                    blurImagesPercentage = percentage;
                    blurImage();
                });
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