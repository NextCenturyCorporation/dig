'use strict';


angular.module('digApp.directives')
.directive('blurredImage', function(blurImagesEnabled, blurImagesPercentage) {
    return {
        restrict: 'A',
        link: function($scope, el, attrs) {
            var processing = false;

            attrs.$observe('src', function(imageSource) {
                if(blurImagesEnabled && !processing) {
                    processing = true;
                    el.addClass('hide-preblur-image');

                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var img = new Image();
                    img.crossOrigin = 'Anonymous';

                    img.onload = function() {
                        canvas.height = img.height;
                        canvas.width = img.width;
                        ctx.drawImage(img,0,0);

                        var size = (Math.max(img.height, img.width) * (.01 * blurImagesPercentage));

                        try{
                            var imgStr = ctx.getImageData(0, 0, canvas.width, canvas.height);

                            JSManipulate.pixelate.filter(imgStr, {
                                size: size
                            });

                            ctx.putImageData(imgStr,0,0);

                            var imgStr2 = canvas.toDataURL('image/png');

                            el.attr('src', imgStr2);
                            el.removeClass('hide-preblur-image');
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