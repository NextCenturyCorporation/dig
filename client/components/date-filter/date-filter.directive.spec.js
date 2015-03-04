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
        
        element = angular.element('<date-filter field="dateField" aggregation-name="dateAgg" indexvm="indexVM" ejs="ejs" ' +
            'filters="filters" filter-states="filterStates.dateFilters"></date-filter>');

        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize all fields to the appropriate values', function () {
        expect(element.isolateScope().aggregationName).toBe(scope.dateAgg);
        expect(element.isolateScope().field).toBe(scope.dateField);
        expect(element.isolateScope().indexVM).toBe(scope.indexVM);
        expect(element.isolateScope().ejs).toBe(scope.ejs);
        expect(element.isolateScope().filters).toBe(scope.filters);
        expect(element.isolateScope().filterStates).toBe(scope.filterStates.dateFilters);
    });

});