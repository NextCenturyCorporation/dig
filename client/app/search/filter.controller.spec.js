'use strict';

describe('Controller: FilterCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var FilterCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        FilterCtrl = $controller('FilterCtrl', {
            $scope: scope
        });
    }));

    it('should initialize phone object with empty values', function () {
        expect(scope.phone.live).toBe('');
        expect(scope.phone.submitted).toBe('');
    });

    it('should update submitted filters', function () {
        scope.phone.live = '2222222222';
        scope.changeFilters();

        expect(scope.phone.submitted).toBe(scope.phone.live);
    });

    it('should update submitted filters', function () {
        scope.phone.live = '2222222222';
        scope.phone.submitted = '2222222222';
        scope.clearFilters();

        expect(scope.phone.live).toBe('');
        expect(scope.phone.submitted).toBe('');
    });

});