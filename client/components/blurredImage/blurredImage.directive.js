'use strict';


angular.module('digApp.directives')
.directive('blurredImage', function(blurImagesEnabled) {
    return {
        restrict: 'A',
        link: function($scope, el, attrs) {
            var processing = false;

            attrs.$observe('src', function(imageSource) {
                if(blurImagesEnabled && !processing) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var img = new Image();
                    img.onload = function() {
                        ctx.width = canvas.width = img.width;
                        ctx.height = canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width , img.height);
                        try{
                            var imgStr = ctx.getImageData(0, 0, canvas.width, canvas.height);

                            JSManipulate.pixelate.filter(imgStr, {
                                size: 15
                            });

                            el.attr('src', imgStr);
                        } catch(e) {
                            //error most likely due to bad cors response
                        }

                        processing = false;
                    };
                    img.src = imageSource;
                }
            });
        }
    };
});