'use strict';

describe('Directive: shortListing', function() {
    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/short-listing/short-listing.partial.html'));

    var scope, element, euiConfigs;

    beforeEach(inject(function ($compile, $rootScope, _euiConfigs_) {
        scope = $rootScope;
        euiConfigs = _euiConfigs_;
        scope.doc = {
            _source: {
                a: 'thread',
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
    }));

    xit('should initialize doc in isolate scope to scope.doc', function() {
        inject(function ($compile) {       
            element = angular.element('<short-listing doc="doc"></short-listing>');
            $compile(element)(scope);
            element.scope().$digest();
        });
        
        expect(expect(element.isolateScope().doc).toBe(scope.doc));
        expect(expect(element.isolateScope().fieldsToRender).toBe(euiConfigs.threadFields));
    });

    xit('should initialize fieldsToRender in isolate scope to euiConfigs.threadFields', function() {
        inject(function ($compile) {       
            element = angular.element('<short-listing doc="doc"></short-listing>');
            $compile(element)(scope);
            element.scope().$digest();
        });
        
        expect(expect(element.isolateScope().fieldsToRender).toBe(euiConfigs.threadFields));
    });

    xit('should initialize fieldsToRender in isolate scope to euiConfigs.offerFields if doc type is WebPage', function() {
        scope.doc._source.a = 'WebPage';

        inject(function ($compile) {       
            element = angular.element('<short-listing doc="doc"></short-listing>');
            $compile(element)(scope);
            element.scope().$digest();
        });
        
        expect(expect(element.isolateScope().fieldsToRender).toBe(euiConfigs.offerFields));
    });


    xit('should change fieldsToRender if needed', function() {
        inject(function ($compile) {       
            element = angular.element('<short-listing doc="doc"></short-listing>');
            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(expect(element.isolateScope().fieldsToRender).toBe(euiConfigs.threadFields));
        scope.doc._source.a = 'WebPage';
        element.scope().$digest();
        
        expect(expect(element.isolateScope().fieldsToRender).toBe(euiConfigs.offerFields));
    });


});