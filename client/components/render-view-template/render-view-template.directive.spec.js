'use strict';

describe('Directive: renderViewTemplate', function () {

    // load the necessary modules
    beforeEach(module('digApp'));

    var scope, element, euiConfigs, $httpBackend, templateConfigs;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope, _euiConfigs_, _$httpBackend_) {
        scope = $rootScope.$new();
        euiConfigs = _euiConfigs_;
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', new RegExp('components/offer-view/offer-view.partial.html'))
            .respond(200, 'some text');
        $httpBackend.when('GET', new RegExp('components/thread-view/thread-view.partial.html'))
            .respond(200, 'some text');    
        $httpBackend.when('GET', new RegExp('components/display-desc-list/display-desc-list.partial.html'))
            .respond(200, 'some text');

        templateConfigs = {
            thread: {
                bindings: {
                    'doc': 'doc'
                }
            },
            offer: {
                bindings: {
                    'doc': 'doc',
                    'get-display-image-src': 'getDisplayImageSrc',
                    'view-details': 'viewDetails',
                    'parent-state': 'list',
                    'facets' : 'facets', 
                    'image-search': 'imageSearch'
                }
            }
        };

        scope.doc = {
            _source : {
                a: 'thread',
                subject: 'subject',
                body: 'text',
                username: 'user123'
            }
        };
    }));

    it('should have correct templateConfigs', function () {
        inject(function ($compile) {
            element = angular.element('<div render-view-template></div render-view-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        expect(element.scope().templateConfigs).toEqual(templateConfigs);        
    });

    it('should create div with attribute thread-view', function () {
        inject(function ($compile) {
            element = angular.element('<div render-view-template></div render-view-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        var threadDiv = element.find('div[thread-view]');
        expect(threadDiv.length).toBe(1);
        expect(threadDiv[0].outerHTML).toEqual('<div thread-view="" doc="doc" class="ng-scope"></div>');
    });

    it('should switch view templates when doc._source.a changes', function () {
        inject(function ($compile) {
            element = angular.element('<div render-view-template></div render-view-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        var threadDiv = element.find('div[thread-view]');
        expect(threadDiv.length).toBe(1);
        expect(threadDiv[0].outerHTML).toEqual('<div thread-view="" doc="doc" class="ng-scope"></div>');

        scope.doc._source.a = 'offer';
        element.scope().$digest();
        var offerDiv = element.find('div[offer-view]');
        expect(offerDiv.length).toBe(1);
        expect(offerDiv[0].outerHTML).toEqual('<div offer-view="" doc="doc" get-display-image-src="getDisplayImageSrc" ' +
            'view-details="viewDetails" parent-state="list" facets="facets" image-search="imageSearch" class="ng-scope"></div>');
    });

    it('should create div with attribute offer-view', function () {
        scope.doc._source.a = 'offer';
        inject(function ($compile) {
            element = angular.element('<div render-view-template></div render-view-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        var offerDiv = element.find('div[offer-view]');
        expect(offerDiv.length).toBe(1);
        expect(offerDiv[0].outerHTML).toEqual('<div offer-view="" doc="doc" get-display-image-src="getDisplayImageSrc" ' +
            'view-details="viewDetails" parent-state="list" facets="facets" image-search="imageSearch" class="ng-scope"></div>');
    });

    it('should create div with attribute offer-view if schema type is WebPage', function () {
        scope.doc._source.a = 'WebPage';
        inject(function ($compile) {
            element = angular.element('<div render-view-template></div render-view-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });

        var offerDiv = element.find('div[offer-view]');
        expect(offerDiv.length).toBe(1);
        expect(offerDiv[0].outerHTML).toEqual('<div offer-view="" doc="doc" get-display-image-src="getDisplayImageSrc" '+
            'view-details="viewDetails" parent-state="list" facets="facets" image-search="imageSearch" class="ng-scope"></div>');
    });

});