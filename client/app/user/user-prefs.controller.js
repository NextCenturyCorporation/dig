'use strict';

angular.module('digApp')
.controller('UserPrefsCtrl', ['$scope', '$modalInstance', '$http', '$window', 'User',
    function($scope, $modalInstance, $http, $window, User) {

    User.get().$promise.then(function(result) {
        $scope.updatedUser = {
            emailAddress: result.emailAddress, 
            sendEmailNotification: result.sendEmailNotification
        };
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

            if(_.isEmpty($scope.updatedUser.emailAddress)) {
                $scope.updatedUser.emailAddress = null;
            }

            // TODO: figure out blurImages logic
            User.update($scope.updatedUser).$promise.then(function() {
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