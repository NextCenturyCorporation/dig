'use strict';

describe('Directive: shortListing', function() {
    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/short-listing/short-listing.partial.html'));

    var scope, element;

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope;
        scope.doc = {
            _source: {
                name: 'Steve', 
                age: 20
            }
        };
        scope.fieldsToPass = {
            title: [{
                title: 'Title',
                type: 'title',
                field: 'title.text',
                section: 'title'
            }],
            short: [{
                title: 'Author',
                field: 'author',
                classes: 'author'
            },{
                title: 'Provider',
                field: 'provider',
                classes: 'provider'
            }]
        };
        element = angular.element('<short-listing doc="doc" fields-to-render="fieldsToPass"></short-listing>');
        $compile(element)(scope);
        element.scope().$digest();
    }));

    it('should initialize doc in isolate scope to scope.doc', function() {
        expect(expect(element.isolateScope().doc).toBe(scope.doc));
    });

    it('should initialize fieldsToRender in isolate scope to scope.fieldsToPass', function() {
        expect(expect(element.isolateScope().fieldsToRender).toBe(scope.fieldsToPass));
    });

});