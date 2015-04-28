'use strict';

angular.module('digApp')
.service('blurImageService', function($rootScope, blurImagesEnabled, blurImagesPercentage, User) {
    var blurConfig = this;
    var user = User.get();

    blurConfig.getBlurImagesEnabled = function() {
        return (user.blurAttributes ? user.blurAttributes.blurImagesEnabled : blurImagesEnabled);
    };

    blurConfig.getBlurImagesPercentage = function() {
        return (user.blurAttributes ? user.blurAttributes.blurImagesPercentage : blurImagesPercentage);
    };

    blurConfig.changeBlurImagesEnabled = function(isBlurred) {
        var blurUpdate = {blurAttributes: {}};
        
        if(isBlurred) {
            blurUpdate.blurAttributes.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : true;
            blurUpdate.blurAttributes.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
        } else {
            blurUpdate.blurAttributes.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
            blurUpdate.blurAttributes.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
        }

        user = User.update(blurUpdate);

        $rootScope.$broadcast('blur-state-change', isBlurred);
    };

    return blurConfig;
});
