'use strict';

describe('Directive: displayDescList', function() {
    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/display-desc-list/display-desc-list.partial.html'));

    var scope, element;

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope;
        scope.doc = {
            _source: {
                name: 'Steve', 
                age: 20
            }
        };
        scope.section = {
          classes: 'person-details',
          fields: [
            {
              title: 'Name',
              field: 'doc._source.name'
            },
            {
              title: 'Age',
              field: 'doc._source.age'
            }
          ]
        };
        element = angular.element('<display-desc-list doc="doc" section="section"></display-desc-list>');
        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize doc in isolate scope to scope.doc', function() {
        expect(expect(element.isolateScope().doc).toBe(scope.doc));
    });

    it('should initialize section in isolate scope to scope.section', function() {
        expect(expect(element.isolateScope().section).toBe(scope.section));
    });

});