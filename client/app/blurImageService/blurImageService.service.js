'use strict';

angular.module('digApp')
.service('blurImageService', function($rootScope, blurImagesEnabled, blurImagesPercentage) {
    var blurConfig = this;

    blurConfig.getBlurImagesEnabled = function() {
        return (sessionStorage.blurConfig ? JSON.parse(sessionStorage.blurConfig).blurImagesEnabled : blurImagesEnabled);
    };

    blurConfig.getBlurImagesPercentage = function() {
        return (sessionStorage.blurConfig ? JSON.parse(sessionStorage.blurConfig).blurImagesPercentage : blurImagesPercentage);
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        var blurAttributes = {};
        
        if(isBlurred) {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : true;
            blurAttributes.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
            sessionStorage.blurConfig = JSON.stringify(blurAttributes);
        } else {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            blurAttributes.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
            sessionStorage.blurConfig = JSON.stringify(blurAttributes);
        }

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
