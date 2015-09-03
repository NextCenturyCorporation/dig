'use strict';

describe('Directive: numericalRangeFilter', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/numerical-range-filter/numerical-range-filter.partial.html'));
    beforeEach(module('components/numerical-range-filter/slider/slider.partial.html'));

    var scope, element;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;

        scope.rangeField = 'rangeField';
        scope.rangeAgg = 'rangeAgg';
        scope.filterTitle = 'titlehere';

        scope.filterStates = {
            rangeFilters: {}
        };
        scope.indexVM = {};
        scope.ejs = {};
        scope.filters = {};
    }));

    it('should initialize all fields to the appropriate values', function () {

        inject(function ($compile) { 
            element = angular.element('<numerical-range-filter field="rangeField" title="filterTitle" aggregation-name="rangeAgg" ' +
                'indexvm="indexVM" ejs="ejs" filters="filters" filter-states="filterStates.rangeFilters"></numerical-range-filter>');
            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().aggregationName).toBe(scope.rangeAgg);
        expect(element.isolateScope().field).toBe(scope.rangeField);
        expect(element.isolateScope().indexVM).toBe(scope.indexVM);
        expect(element.isolateScope().ejs).toBe(scope.ejs);
        expect(element.isolateScope().filters).toBe(scope.filters);
        expect(element.isolateScope().filterStates).toBe(scope.filterStates.rangeFilters);
    });

    it('should initialize filter state if already present', function () {

        scope.filterStates.rangeFilters.rangeField = {
            begin: 5,
            end: 50,
            enabled: true
        };

        var begin = scope.filterStates.rangeFilters.rangeField.begin;
        var end = scope.filterStates.rangeFilters.rangeField.end;
        var enabled = scope.filterStates.rangeFilters.rangeField.enabled;

        inject(function ($compile) {       
            element = angular.element('<numerical-range-filter field="rangeField" title="filterTitle" aggregation-name="rangeAgg" ' +
                'indexvm="indexVM" ejs="ejs" filters="filters" filter-states="filterStates.rangeFilters"></numerical-range-filter>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().filterStates.rangeField.begin).toEqual(begin);
        expect(element.isolateScope().filterStates.rangeField.end).toEqual(end);
        expect(element.isolateScope().filterStates.rangeField.enabled).toEqual(enabled);
    });


    it('should create null/false values for rangeFilter if no values present', function () {

        inject(function ($compile) {       
            element = angular.element('<numerical-range-filter field="rangeField" title="filterTitle" aggregation-name="rangeAgg" ' +
                'indexvm="indexVM" ejs="ejs" filters="filters" filter-states="filterStates.rangeFilters"></numerical-range-filter>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.isolateScope().filterStates.rangeField.begin).toEqual(null);
        expect(element.isolateScope().filterStates.rangeField.end).toEqual(null);
        expect(element.isolateScope().filterStates.rangeField.enabled).toEqual(false);
    });


});