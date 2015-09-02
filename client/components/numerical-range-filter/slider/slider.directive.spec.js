'use strict';

describe('Directive: slider', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/numerical-range-filter/slider/slider.partial.html'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;

        scope.rangeFilter = {
            begin: null,
            end: null,
            enabled: false
        };
        scope.aggStats = {
            min: 1, 
            max: 25
        };

        element = angular.element('<slider range-filter="rangeFilter" aggregation-stats="aggStats"></slider>');
            
        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize all fields to the appropriate values', function () {
        expect(element.isolateScope().rangeFilter).toBe(scope.rangeFilter);
        expect(element.isolateScope().aggregationStats).toBe(scope.aggStats);
    });

});