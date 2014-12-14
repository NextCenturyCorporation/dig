'use strict';

describe('Controller: SearchCtrl', function () {

	// load the controller's module
	beforeEach(module('digApp'));

	var SearchCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		SearchCtrl = $controller('SearchCtrl', {
			$scope: scope
		});
	}));

	it('should initialize showresults to false', function () {
		expect(scope.showresults).toBe(false);
	});

	it('should set showresults to true', function () {
		scope.indexVM = {};
		scope.indexVM.query = {};
		scope.submit();
		expect(scope.showresults).toBe(true);
	});	
});
