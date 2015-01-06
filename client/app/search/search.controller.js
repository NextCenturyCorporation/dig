'use strict';

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', 'imageSearchService', 
    function ($scope, $state, $http, imageSearchService) {

    $scope.showresults = true;
    $scope.currentOpened = 0;
    $scope.selectedImage = 0;
    $scope.queryString = {live: '', submitted: ''};
    $scope.loading = false;
    $scope.filterByImage = {};
    $scope.filterByImage.enabled = false;
    $scope.imageSearchResults = {};

    $scope.submit = function () {
        $scope.loading = true;
        $scope.queryString.submitted = $scope.queryString.live;

        if ($scope.queryString.submitted) {
            $scope.showresults = true;
        }

        $scope.loading = false;
    };

    $scope.getActiveImageSearch = function() {
        return imageSearchService.getActiveImageSearch();
    };

    $scope.clearActiveImageSearch = function() {
        $scope.filterByImage.enabled = false;
        imageSearchService.clearActiveImageSearch();
    };

    $scope.closeOthers = function(index, array) {
        if($scope.currentOpened < array.length) {
            array[$scope.currentOpened].isOpen = false;
        }
        $scope.currentOpened = index;
    };

    $scope.viewDetails = function(doc) {
        $scope.doc = doc;
        $state.go('search.list.details');
    };

    $scope.viewList = function() {
        if($scope.doc) {
            $scope.doc = null;
        }
        $state.go('search.list');
    };

    $scope.selectImage = function(index) {
        $scope.selectedImage = index;
    };

    // Temporary until ad body text is cleaned up
    $scope.cleanString = function(str) {
        return str.replace(/[^a-z0-9\-\!\@\#\$\%\^\&\*\(\)\s\.\,\'\"']/gi, '');
    };

    $scope.imageSearch = function(imgUrl) {
        imageSearchService.imageSearch(imgUrl);
    };

    $scope.$watch(function() {
            return imageSearchService.getActiveImageSearch();
        }, function(newVal) {
            if (newVal) {
                if (newVal.status === "searching") {
                    $scope.loading = true;
                } else if (newVal.status === "success" ) {
                    // If our latest img search was successful, re-issue our query and
                    // enable our image filter.
                    $scope.loading = false;
                    $scope.filterByImage.enabled = true;
                } else {
                    $scope.loading = false;
                    $scope.filterByImage.enabled = false;
                }
            } else {
                $scope.loading = false;
                $scope.filterByImage.enabled = false;
            }
        }, 
        true);

    if($state.current.name === 'search') {
        $scope.viewList();
    }
}]);
