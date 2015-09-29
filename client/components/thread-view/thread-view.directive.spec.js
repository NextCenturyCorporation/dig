'use strict';

describe('Directive: threadView', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/thread-view/thread-view.partial.html'));

    var scope, element, textHighlightService, $httpBackend;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope, _textHighlightService_, _$httpBackend_) {
        scope = $rootScope.$new();
        textHighlightService = _textHighlightService_;
        $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('components/thread-view/post-template.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('components/display-desc-list/display-desc-list.partial.html'))
                .respond(200, 'some text');

        scope.doc = {
            _source : {
                subject: 'subject',
                body: 'text',
                username: 'user123'
            }
        };
        scope.threadFields = [{
            type: 'Thread',
            title: [{
                title: 'Title',
                type: 'title',
                field: 'doc.highlight["hasTitlePart.text"][0] || doc._source.hasTitlePart.text || doc._source.hasTitlePart[0].text',
                section: 'title'
            }],
            postFields: {
                field: 'doc._source.hasPost',
                name: 'Posts',
                subject: [{
                    title: 'Title',
                    type: 'title',
                    field: 'hasTitlePart.text || hasTitlePart[0].text',
                    highlightArray: 'doc.highlight["hasPost.hasTitlePart.text"]',
                    section: 'title'
                }],
                body: {
                    title: 'Body',
                    field: 'hasBodyPart.text',
                    highlightArray: 'doc.highlight["hasPost.hasBodyPart.text"]'
                }
            }
        }];
        
    }));

    it('should initialize all fields to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<thread-view doc="doc" thread-fields="threadFields"></thread-view>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().doc).toBe(scope.doc);
        expect(element.isolateScope().threadFields).toBe(scope.threadFields);
    });

    it('should call textHighlightService method', function () {
        inject(function ($compile) {
            element = angular.element('<thread-view doc="doc" thread-fields="threadFields"></thread-view>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        spyOn(textHighlightService, 'highlightCheck');
        element.isolateScope().highlightCheck('field', ['field']);
        expect(textHighlightService.highlightCheck).toHaveBeenCalled();
    });

});