'use strict';

angular.module('digApp')
.service('blurImageService', function($rootScope, blurImagesEnabled, blurImagesPercentage, User) {
    var blurConfig = this;
    var user = User.get();

    blurConfig.getBlurImagesEnabled = function() {
        return (user.blurConfig ? user.blurConfig.blurImagesEnabled : blurImagesEnabled);
    };

    blurConfig.getBlurImagesPercentage = function() {
        return (user.blurConfig ? user.blurConfig.blurImagesPercentage : blurImagesPercentage);
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        var blurAttributes = {blurConfig: {}};
        
        if(isBlurred) {
            blurAttributes.blurConfig.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : true;
            blurAttributes.blurConfig.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
        } else {
            blurAttributes.blurConfig.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            blurAttributes.blurConfig.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
        }

        user = User.update(blurAttributes);

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
