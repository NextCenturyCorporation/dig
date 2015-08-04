'use strict';

describe('Directive: postTemplate', function () {

    // load the necessary modules
    beforeEach(module('digApp'));
    beforeEach(module('components/thread-view/post-template.partial.html'));

    var scope, element, textHighlightService, $httpBackend;

    // Initialize the mock scope
    beforeEach(inject(function ($compile, $rootScope, _textHighlightService_, _$httpBackend_) {
        scope = $rootScope.$new();
        textHighlightService = _textHighlightService_;
        $httpBackend = _$httpBackend_;

        scope.post = {
            hasTitlePart: {
                text: 'title'
            }, 
            hasBodyPart: {
                text: 'body'
            }
        };
        scope.postFields = {
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
        };
    }));

    it('should initialize all fields to the appropriate values', function () {
        inject(function ($compile) {
            element = angular.element('<post-template post="post" post-fields="postFields"></post-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        expect(element.isolateScope().post).toBe(scope.post);
        expect(element.isolateScope().postFields).toBe(scope.postFields);
    });

    it('should call textHighlightService method', function () {
        inject(function ($compile) {
            element = angular.element('<post-template post="post" post-fields="postFields"></post-template>');

            $compile(element)(scope);
            element.scope().$digest();
        });
        spyOn(textHighlightService, 'highlightCheck');
        element.isolateScope().highlightCheck('field', ['field']);
        expect(textHighlightService.highlightCheck).toHaveBeenCalled();
    });

});