'use strict';

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

    $scope.showresults = true;
    $scope.currentOpened = 0;
    $scope.selectedImage = 0;
    $scope.queryString = {live: '', submitted: ''};
    $scope.loading = false;
    $scope.imageSearchResults = {};

    $scope.submit = function () {
        $scope.loading = true;
        $scope.queryString.submitted = $scope.queryString.live;

        if ($scope.queryString.submitted) {
            $scope.showresults = true;
        }

        $scope.loading = false;
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
        $scope.loading = true;

        $scope.imageSearchResults[imgUrl] = {
            url: imgUrl,
            status: 'searching'
        };

        $http.get('http://vinisvr:3001/imagesim?uri=' + encodeURIComponent(imgUrl)).
        success(function(data, status, headers, config) {
            $scope.loading = false;
            $scope.imageSearchResults[imgUrl].status = 'success';
            $scope.activeImageSearch = $scope.imageSearchResults[imgUrl];
        }).
        error(function(data, status, headers, config) {
            $scope.loading = false;
            //save results -- url/failure
            $scope.imageSearchResults[imgUrl].status = 'error';
            $scope.imageSearchResults[imgUrl].error = data;
        });
    };

    if($state.current.name === 'search') {
        $scope.viewList();
    }
}]);
