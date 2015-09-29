'use strict';

angular.module('digApp')
.service('userPrefsService', function($rootScope, blurImagesEnabled, blurImagesPercentage, User, $q) {
    var userConfig = this;
    var user = User.get();

    userConfig.getBlurImagesEnabled = function() {
        return $q(function(resolve) {
            user.$promise.then(function(result) {
                return resolve((result.hasOwnProperty('blurImagesEnabled') && result.blurImagesEnabled !== null) ? user.blurImagesEnabled : blurImagesEnabled);
            }, function() {
                // if call is unsuccessful, use environment variable setting
                return resolve(blurImagesEnabled);
            });
        });
    };

    userConfig.getBlurImagesPercentage = function() {
        return $q(function(resolve) {
            user.$promise.then(function(result) {
                return resolve((result.hasOwnProperty('blurImagesPercentage') && result.blurImagesPercentage !== null) ? result.blurImagesPercentage : blurImagesPercentage);
            }, function() {
                // if call is unsuccessful, use environment variable setting
                return resolve(blurImagesPercentage);
            });
        });
    };

    userConfig.updateUserPreferences = function(userPrefs) {
        return $q(function(resolve, reject) {
            // null out email address field if empty
            if(_.isEmpty(userPrefs.emailAddress)) {
                userPrefs.emailAddress = null;
            }

            // check blur settings
            if(userPrefs.blurImagesEnabled) {
                userPrefs.blurImagesEnabled = blurImagesEnabled ? blurImagesEnabled : true;
                userPrefs.blurImagesPercentage = (blurImagesPercentage > 0) ? blurImagesPercentage : 2.5;
            } else {
                userPrefs.blurImagesEnabled = blurImagesEnabled ? false : blurImagesEnabled;
                userPrefs.blurImagesPercentage = (blurImagesPercentage === 0) ? blurImagesPercentage : 0;
            }

            User.update(userPrefs).$promise.then(function(result) {
                user = result;
                $rootScope.$broadcast('blur-state-change', userPrefs.blurImagesEnabled);
                return resolve(result);
            }, function(error) {
                return reject(error);
            });
        });
    };

    return userConfig;
});
