'use strict';

describe('Directive: postsView', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/posts-view/posts-view.partial.html'));

    var scope, element, euiConfigs, $httpBackend;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope, _euiConfigs_, _$httpBackend_) {
        scope = $rootScope.$new();
        euiConfigs = _euiConfigs_;
        $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('components/display-desc-list/display-desc-list.partial.html'))
                .respond(200, 'some text');

        scope.doc = {
            _source : {
                subject: 'subject',
                body: 'text',
                username: 'user123'
            }
        };
    }));

    it('should initialize all fields to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<posts-view doc="doc"></posts-view>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().doc).toBe(scope.doc);
        expect(element.isolateScope().euiConfigs).toEqual(euiConfigs);
    });

});