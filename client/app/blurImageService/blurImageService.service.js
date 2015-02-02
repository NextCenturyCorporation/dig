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
            sessionStorage.blurImagesEnabled = 'blur';
            sessionStorage.blurImagesPercentage = 2.5;
            sessionStorage.pixelateImagesPercentage = 5;
        } else {
            sessionStorage.blurImagesEnabled = null;
            sessionStorage.blurImagesPercentage = 0;
            sessionStorage.pixelateImagesPercentage = 0;
        }
    };

    return blurConfig;
});
