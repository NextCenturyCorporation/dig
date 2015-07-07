'use strict';

angular.module('digApp')
.service('blurImageService', function($rootScope, blurImagesEnabled, blurImagesPercentage, User) {
    var blurConfig = this;
    var user = User.get();

    blurConfig.getBlurImagesEnabled = function() {
        return ((user.hasOwnProperty('blurImagesEnabled') && user.blurImagesEnabled !== null) ? user.blurImagesEnabled : blurImagesEnabled);
    };

    blurConfig.getBlurImagesPercentage = function() {
        return ((user.hasOwnProperty('blurImagesPercentage') && user.blurImagesPercentage !== null) ? user.blurImagesPercentage : blurImagesPercentage);
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        var blurAttributes = {};
        
        if(isBlurred) {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : true;
            blurAttributes.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
        } else {
            blurAttributes.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            blurAttributes.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
        }

        user = User.update(blurAttributes);

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
