'use strict';

angular.module('digApp')
.controller('SearchCtrl', ['$scope', '$state', '$timeout', function ($scope, $state, $timeout) {

	$scope.showresults = false;
	$scope.currentOpened = 0;
	$scope.selectedImage = 0;
	$scope.queryString = {live: '', submitted: ''};
	$scope.loading = false;

	$scope.submit = function () {
		$scope.loading = true;
		$scope.queryString.submitted = $scope.queryString.live;

		if ($scope.queryString.submitted) {
			$scope.showresults = true;
		}

		$timeout(function() {
			$scope.loading = false;
		}, 5000);
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

	if($state.current.name === 'search') {
		$scope.viewList();
	}

}]);
