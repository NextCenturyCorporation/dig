'use strict';

angular.module('digApp')
.controller('QueriesCtrl', ['$scope', '$state', '$http', 'User', 'euiConfigs',
    function($scope, $state, $http, User, euiConfigs) {

    $scope.currentUser = User.get();
    $scope.opened = [];
    $scope.frequencyOptions = ['daily', 'weekly', 'monthly'];
    $scope.facets = euiConfigs.facets;


    $scope.getQueries = function() {
        $http.get('api/queries/').
            success(function(data) {
                $scope.queryResults = data;
            });
    };

    $scope.getNotifications = function() {
        $http.get('api/notifications/').
            success(function(data) {
                $scope.notifications = data;
            });
    };

    $scope.toggleListItemOpened = function(index) {
        $scope.opened[index] = !($scope.opened[index]);
    };

    $scope.isListItemOpened = function(index) {
        return ($scope.opened[index]) ? true : false;
    };

    $scope.deleteQuery = function(id) {
        $http.delete('api/queries/' + id).
            success(function() {
                $scope.getQueries();
                $http.get('api/notifications?queryId=' + id).
                    success(function(notifications) {
                        notifications.forEach(function(notification) {
                            $scope.deleteNotification(notification);
                        });
                        $scope.getNotifications();                        
                    });
            });
    };

    $scope.deleteNotification = function(notification) {
        if(!notification.hasRun) {
            User.update({notificationCount: $scope.currentUser.notificationCount - 1});
        }
        $http.delete('api/notifications/' + notification._id);
    };

    $scope.updateNotification = function(notification) {
        if(!notification.hasRun) {
            User.update({notificationCount: $scope.currentUser.notificationCount - 1});
        }
        $http.put('api/notifications/' + notification._id, {hasRun: true});            
    };

    $scope.toggleFrequency = function(id, selectedOption) {
        $http.put('api/queries/' + id, {frequency: selectedOption});
    };

    $scope.runQuery = function(query) {
        $http.put('api/queries/' + query._id, {lastRunDate: new Date()});
        $http.get('api/notifications?queryId=' + query._id).
            success(function(notifications) {
                notifications.forEach(function(notification) {
                    $scope.updateNotification(notification);
                });
            });
        $state.go('search.results.list', {
            query: query
        }, {
            location: true
        });
    };

    $scope.getQueries();
    $scope.getNotifications();

}]);
