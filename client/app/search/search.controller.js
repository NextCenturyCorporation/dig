'use strict';

angular.module('digApp')
.controller('SearchCtrl', ['$scope', function ($scope) {
	$scope.showresults = false;

	$scope.submit = function () {
		// if indexVM.query object is not null, then value for the query input
		// is not empty, so display results if any, otherwise do not
		// display results.
		if ($scope.indexVM.query) {
			$scope.showresults = true;
		}
		else {
			$scope.showresults = false;
		}
	};
}]);
