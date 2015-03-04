'use strict';

describe('Directive: dateRange', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/date-filter/date-range/date-range.partial.html'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;

        scope.beginDate = new Date(2014, 11, 31);
        scope.endDate = new Date(2015, 0, 1);
        scope.minMillisecs = 1417410000000;
        scope.maxMillisecs = 1422594000000;
        scope.format = 'yyyy-MM-dd';

        element = angular.element('<date-range begin-date="beginDate" end-date="endDate" date-format="format" ' + 
            'min="minMillisecs" max="maxMillisecs"></date-range>');
            
        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize all fields to the appropriate values', function () {
        expect(element.isolateScope().beginDate.getTime()).toBe(scope.beginDate.getTime());
        expect(element.isolateScope().endDate.getTime()).toBe(scope.endDate.getTime());
        expect(element.isolateScope().min).toBe(scope.minMillisecs);
        expect(element.isolateScope().minDate.getTime()).toBe(scope.minMillisecs);
        expect(element.isolateScope().max).toBe(scope.maxMillisecs);
        expect(element.isolateScope().maxDate.getTime()).toBe(scope.maxMillisecs);
        expect(element.isolateScope().dateFormat).toBe(scope.format);
        expect(element.isolateScope().today.toDateString()).toBe(new Date().toDateString());
        expect(element.isolateScope().beginOpened).toBe(false);
        expect(element.isolateScope().endOpened).toBe(false);
    });

    it('should set beginOpened to true when beginOpen() called', function () {
        element.isolateScope().beginOpen($.Event('click'));

        expect(element.isolateScope().beginOpened).toBe(true);
        expect(element.isolateScope().endOpened).toBe(false);
    });

    it('should set endOpened to true when endOpen() called', function () {
        element.isolateScope().endOpen($.Event('click'));

        expect(element.isolateScope().endOpened).toBe(true);
        expect(element.isolateScope().beginOpened).toBe(false);
    });

    it('should have no effect on beginOpened', function () {
        element.isolateScope().beginOpened = true;
        element.isolateScope().endOpened = true;

        element.isolateScope().endOpen($.Event('click'));

        expect(element.isolateScope().endOpened).toBe(false);
        expect(element.isolateScope().beginOpened).toBe(true);
    });

    it('should have no effect on endOpened', function () {
        element.isolateScope().beginOpened = true;
        element.isolateScope().endOpened = true;

        element.isolateScope().beginOpen($.Event('click'));

        expect(element.isolateScope().beginOpened).toBe(false);
        expect(element.isolateScope().endOpened).toBe(true);
    });    

    it('should reset beginOpened to false when endOpen() is called', function () {
        element.isolateScope().beginOpen($.Event('click'));

        expect(element.isolateScope().beginOpened).toBe(true);

        element.isolateScope().endOpen($.Event('click'));

        expect(element.isolateScope().endOpened).toBe(true);
        expect(element.isolateScope().beginOpened).toBe(false);
    });

    it('should reset endOpened to false when beginOpen() is called', function () {
        element.isolateScope().endOpen($.Event('click'));

        expect(element.isolateScope().endOpened).toBe(true);

        element.isolateScope().beginOpen($.Event('click'));

        expect(element.isolateScope().beginOpened).toBe(true);
        expect(element.isolateScope().endOpened).toBe(false);
    });

});
