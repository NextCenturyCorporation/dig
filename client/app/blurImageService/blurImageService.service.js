'use strict';

angular.module('digApp')
.service('blurImageService', function($rootScope, blurImagesEnabled, blurImagesPercentage, pixelateImagesPercentage) {
    var blurConfig = this;

    blurConfig.getBlurImagesEnabled = function() {
        return (sessionStorage.blurConfig ? JSON.parse(sessionStorage.blurConfig).blurImagesEnabled : blurImagesEnabled);
    };

    blurConfig.getBlurImagesPercentage = function() {
        return (sessionStorage.blurConfig ? JSON.parse(sessionStorage.blurConfig).blurImagesPercentage : blurImagesPercentage);
    };

    blurConfig.getPixelateImagesPercentage = function() {
        return (sessionStorage.blurConfig ? JSON.parse(sessionStorage.blurConfig).pixelateImagesPercentage : pixelateImagesPercentage);
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        var tempObject = {};
        
        if(isBlurred) {
            tempObject.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : 'blur';
            tempObject.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
            tempObject.pixelateImagesPercentage = (pixelateImagesPercentage > 0) ? pixelateImagesPercentage : 5;
            sessionStorage.blurConfig = JSON.stringify(tempObject);
        } else {
            tempObject.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            tempObject.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
            tempObject.pixelateImagesPercentage = (pixelateImagesPercentage === 0) ? pixelateImagesPercentage : 0;
            sessionStorage.blurConfig = JSON.stringify(tempObject);
        }

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
