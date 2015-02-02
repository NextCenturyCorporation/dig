'use strict';

angular.module('digApp.services')
.service('blurImageService', function(blurImagesEnabled, blurImagesPercentage, pixelateImagesPercentage) {
    var blurConfig = this;

    blurConfig.getBlurImagesEnabled = function() {
        return sessionStorage.blurImagesEnabled || blurImagesEnabled;
    };

    blurConfig.getBlurImagesPercentage = function() {
        return sessionStorage.blurImagesPercentage || blurImagesPercentage;
    };

    blurConfig.getPixelateImagesPercentage = function() {
        return sessionStorage.pixelateImagesPercentage || pixelateImagesPercentage;
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        if(isBlurred) {
            sessionStorage.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : 'blur';
            sessionStorage.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
            sessionStorage.pixelateImagesPercentage = (pixelateImagesPercentage > 0) ? pixelateImagesPercentage : 2.5;
        } else {
            sessionStorage.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            sessionStorage.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
            sessionStorage.pixelateImagesPercentage = (pixelateImagesPercentage === 0) ? pixelateImagesPercentage : 0;
        }
    };

    return blurConfig;
});
