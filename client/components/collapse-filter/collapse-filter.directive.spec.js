'use strict';

describe('Directive: collapseFilter', function() {
    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/collapse-filter/collapse-filter.html'));

    var scope;
    var element;

    // Initialize the mock scope
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope;
        element = angular.element('<collapse-filter title=\"Test\" closed=\"false\">content</collapse-filter>');
        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize title in isolate scope to \'Test\'', function() {
        expect(element.isolateScope().title).toBe('Test');
    });

    it('should initialize closed in isolate scope to false', function() {
        expect(element.isolateScope().closed).toBe(false);
    });

    it('should include content entered', function() {
        expect(element.text()).toContain('content');
    });
});
