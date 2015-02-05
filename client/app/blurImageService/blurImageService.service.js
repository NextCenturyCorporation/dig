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
        var blurAttributes = {};
        
        if(isBlurred) {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : 'blur';
            blurAttributes.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
            blurAttributes.pixelateImagesPercentage = (pixelateImagesPercentage > 0) ? pixelateImagesPercentage : 5;
            sessionStorage.blurConfig = JSON.stringify(blurAttributes);
        } else {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            blurAttributes.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
            blurAttributes.pixelateImagesPercentage = (pixelateImagesPercentage === 0) ? pixelateImagesPercentage : 0;
            sessionStorage.blurConfig = JSON.stringify(blurAttributes);
        }

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
