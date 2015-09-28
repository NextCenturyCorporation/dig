'use strict';

angular.module('digApp')
.controller('UserPrefsCtrl', ['$scope', '$rootScope', '$modalInstance', '$http', '$window', 'User', 'userPrefsService',
    function($scope, $rootScope, $modalInstance, $http, $window, User, userPrefsService) {

    User.get().$promise.then(function(result) {
        $scope.updatedUser = {
            emailAddress: result.emailAddress,
            sendEmailNotification: result.sendEmailNotification,
        };
        return userPrefsService.getBlurImagesEnabled();
    }).then(function(blurEnabled) {
        $scope.updatedUser.blurImagesEnabled = blurEnabled;
    });

    $scope.databaseError = {};

    $scope.isNotificationStateValid = function() {
        if($scope.updatedUser && $scope.userForm) {
            return (!$scope.updatedUser.sendEmailNotification) || 
                ($scope.updatedUser.sendEmailNotification && 
                !_.isEmpty($scope.updatedUser.emailAddress) && $scope.userForm.emailAddress.$valid);
        } else {
            return false;
        }
    };

    $scope.updateUser = function() {
        if($scope.userForm.$valid && $scope.isNotificationStateValid()) {
            userPrefsService.updateUserPreferences($scope.updatedUser).then(function() {
                $modalInstance.close();
            }, function(error) {
                $scope.databaseError = error;
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.close();
    };


}]);