'use strict';

var app = angular.module('digApp');

app.controller('SearchCtrl', ['$scope', '$state', function ($scope,  $state) {

  $scope.imageChecked = false;
  $scope.currentOpened = 0;
  $scope.selectedImage = 0;
  $scope.thumbClass = 'col-md-0';
  $scope.descriptionClass = 'col-md-12';

  $scope.closeOthers = function(index, array) {
    if($scope.currentOpened < array.length) {
      array[$scope.currentOpened].isOpen = false;
    }
    $scope.currentOpened = index;
  }

  $scope.imageCheckedClick = function() {
    $scope.imageChecked = !$scope.imageChecked;
    
    if($scope.imageChecked) {
      $scope.thumbClass = 'col-md-2';
      $scope.descriptionClass = 'col-md-10';
    } else {
      $scope.thumbClass = 'col-md-0';
      $scope.descriptionClass = 'col-md-12';
    }
  }
  
	$scope.viewDetails = function(doc) {
		$scope.doc = doc;
		$state.go('search.list.details');
	}

	$scope.viewList = function() {
    if($scope.doc) {
      $scope.doc = null; 
    }
		$state.go('search.list');
	}

  $scope.selectImage = function(index) {
    $scope.selectedImage = index;
  }
  
  // Temporary until ad body text is cleaned up
	$scope.cleanString = function(str) {
		return str.replace(/[^a-z0-9\-\!\@\#\$\%\^\&\*\(\)\s\.\,\'\"']/gi, '');
	}

	if($state.current.name === 'search') {
		$scope.viewList();
	}

}]);
