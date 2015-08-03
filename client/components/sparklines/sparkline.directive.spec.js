'use strict';

describe('Directive: sparkline', function () {

    // load the necessary modules
    beforeEach(module('digApp'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.data = [{city: 'Vienna', count: 1},{city: 'Los Angeles', count:4},{city: 'Chicago', count: 2}];
    }));

    it('should initialize all fields in element tag to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<sparkline data="data" graph-type="line"></sparkline>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().data).toEqual(scope.data);
        expect(element.isolateScope().graphType).toBe('line');
    });

    it('should initialize all fields in div with attribute to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<div sparkline data="data" graph-type="bar"></div>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().data).toEqual(scope.data);
        expect(element.isolateScope().graphType).toBe('bar');
    }); 

    it('should change data displayed if data changes', function () {
        inject(function ($compile) {
            element = angular.element('<sparkline data="data" graph-type="line"></sparkline>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().data).toEqual(scope.data);

        scope.data = [{city: 'San Diego', count: 3},{city: 'Portland', count:1},{city: 'Seattle', count: 6}];
        element.scope().$digest();
        expect(element.isolateScope().data).toEqual(scope.data);
    }); 

});