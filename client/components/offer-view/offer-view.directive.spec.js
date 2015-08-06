'use strict';

describe('Directive: offerView', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/offer-view/offer-view.partial.html'));

    var scope, element, euiConfigs, $httpBackend;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope, _euiConfigs_, _$httpBackend_) {
        scope = $rootScope.$new();
        euiConfigs = _euiConfigs_;
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', new RegExp('components/display-desc-list/display-desc-list.partial.html'))
            .respond(200, 'some text');
       $httpBackend.when('GET', new RegExp('/api/users/reqHeader'))
            .respond(200, 'some text');


        scope.doc = {
            _source : {
                imageUrl: 'http://imageurl',
                subject: 'subject',
                body: 'text',
                username: 'user123'
            }
        };
        scope.offerFields = [{
            type: 'Offer',
            title: [{
                title: 'Title',
                type: 'title',
                field: 'doc.highlight["hasTitlePart.text"][0] || doc._source.hasTitlePart.text || doc._source.hasTitlePart[0].text',
                section: 'title'
            }]
        }];

        scope.getDisplayImageSrc = jasmine.createSpy('getDisplayImageSrc');
        scope.viewDetails = jasmine.createSpy('viewDetails');
        scope.imageSearch = jasmine.createSpy('imageSearch');

        scope.facets = [
            {aggFilters: {}}
        ];

    }));

    it('should initialize all fields to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<offer-view doc="doc" offer-fields="offerFields" get-display-image-src="getDisplayImageSrc" ' +
                'view-details="viewDetails" parent-state="list" facets="facets" image-search="imageSearch"></offer-view>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().euiConfigs).toBe(euiConfigs);
        expect(element.isolateScope().doc).toBe(scope.doc);
        expect(element.isolateScope().offerFields).toBe(scope.offerFields);
        expect(element.isolateScope().getDisplayImageSrc).toBe(scope.getDisplayImageSrc);
        expect(element.isolateScope().viewDetails).toBe(scope.viewDetails);
        expect(element.isolateScope().parentState).toBe('list');
        expect(element.isolateScope().facets).toBe(scope.facets);
        expect(element.isolateScope().imageSearch).toBe(scope.imageSearch);

    });

});