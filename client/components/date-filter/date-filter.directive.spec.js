'use strict';

describe('Directive: dateFilter', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/date-filter/date-filter.partial.html'));
    beforeEach(module('components/date-filter/date-range/date-range.partial.html'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;

        scope.dateField = 'dateField';
        scope.dateAgg = 'dateAgg';

        scope.filterStates = {
            dateFilters: {}
        };
        scope.indexVM = {};
        scope.ejs = {};
        scope.filters = {};
    }));

    it('should initialize all fields to the appropriate values', function () {

        inject(function ($compile) {       
            element = angular.element('<date-filter field="dateField" aggregation-name="dateAgg" indexvm="indexVM" ejs="ejs" ' +
                'filters="filters" filter-states="filterStates.dateFilters"></date-filter>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().aggregationName).toBe(scope.dateAgg);
        expect(element.isolateScope().field).toBe(scope.dateField);
        expect(element.isolateScope().indexVM).toBe(scope.indexVM);
        expect(element.isolateScope().ejs).toBe(scope.ejs);
        expect(element.isolateScope().filters).toBe(scope.filters);
        expect(element.isolateScope().filterStates).toBe(scope.filterStates.dateFilters);
    });

    it('should initialize filterStates if already present', function () {

        scope.filterStates.dateFilters.dateField = {
            beginDate: '2013-02-02T05:00:00.000Z',
            endDate: '2015-02-03T05:00:00.000Z'
        };

        var beginDate = new Date(scope.filterStates.dateFilters.dateField.beginDate);
        var endDate = new Date(scope.filterStates.dateFilters.dateField.endDate);

        inject(function ($compile) {       
            element = angular.element('<date-filter field="dateField" aggregation-name="dateAgg" indexvm="indexVM" ejs="ejs" ' +
                'filters="filters" filter-states="filterStates.dateFilters"></date-filter>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().filterStates.dateField.beginDate).toEqual(beginDate);
        expect(element.isolateScope().filterStates.dateField.endDate).toEqual(endDate);
    });


    it('should not create dates if date fields are null', function () {

        scope.filterStates.dateFilters.dateField = {
            beginDate: null,
            endDate: null
        };

        inject(function ($compile) {       
            element = angular.element('<date-filter field="dateField" aggregation-name="dateAgg" indexvm="indexVM" ejs="ejs" ' +
                'filters="filters" filter-states="filterStates.dateFilters"></date-filter>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().filterStates.dateField.beginDate).toEqual(null);
        expect(element.isolateScope().filterStates.dateField.endDate).toEqual(null);
    });


});