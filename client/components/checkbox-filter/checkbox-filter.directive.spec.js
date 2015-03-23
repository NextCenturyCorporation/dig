'use strict';

describe('Directive: checkboxFilter', function() {
    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/checkbox-filter/checkbox-filter.partial.html'));
    beforeEach(module('components/checkbox-filter/checkbox-filter-list/checkbox-filter-list.partial.html'));
    beforeEach(module(function($provide) {
        $provide.constant('includeMissingDefault', false);
    }));

    var scope;
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope;

        scope.filterStates = {
            aggFilters: {}
        };
        scope.indexVM = {};
        scope.ejs = {};
        scope.filters = {};

        scope.testField = 'test-field';
        scope.testKey = 'test-key';
        scope.testType = 'string';

        scope.includeMissing = {
            allIncludeMissing: false,
            aggregations: {}
        };
    }));

    it('should initialize all fields as passed in if present', function() {
        inject(function($compile) {
            var testElement = angular.element('<checkbox-filter aggregation-name="{{testField}}" aggregation-key="{{testKey}}" ' +
            'aggregation-count="10" aggregation-terms-type="{{testType}}" indexvm="indexVM" ejs="ejs" filters="filters" ' +
            'filter-states="filterStates.aggFilters" include-missing="includeMissing.aggregations">');
            $compile(testElement)(scope);
            testElement.scope().$digest();

            expect(testElement.isolateScope().aggregationName).toBe('test-field');
            expect(testElement.isolateScope().aggregationKey).toBe('test-key');
            expect(testElement.isolateScope().aggregationCount).toBe(10);
            expect(testElement.isolateScope().aggregationTermsType).toBe('string');
        });
    });

    it('should default aggregationCount to 30 if not passed in', function() {
        inject(function($compile) {
            var testElement = angular.element('<checkbox-filter aggregation-name="{{testField}}" aggregation-key="{{testKey}}" ' +
            'aggregation-terms-type="{{testType}}" indexvm="indexVM" ejs="ejs" filters="filters" ' +
            'filter-states="filterStates.aggFilters" include-missing="includeMissing.aggregations">');
            $compile(testElement)(scope);
            testElement.scope().$digest();

            expect(testElement.isolateScope().aggregationCount).toBe(30);
        });
    });
});
