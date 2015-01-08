'use strict';

describe('Service: imageSearchService', function () {

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    beforeEach(function() {
        module(function($provide) {
            $provide.constant('simHost', 'http://localhost');
        });

        inject(function(_imageSearchService_) {
            imageSearchService = _imageSearchService_;
        });
    });

    it('should do something', function () {
        expect(imageSearchService).toBeDefined();
        expect(imageSearchService).toBeTruthy();
    });

    it('should initialize with getActiveImageSearch() as null', function() {
        var activeSearch = imageSearchService.getActiveImageSearch();
        expect(activeSearch).toBeNull();
    });

    it('should return message for getImageSearchStatus call of invalid url', function() {
        var status = imageSearchService.getImageSearchStatus('http://fake');
        expect(status).toBe('no search available');
    });
});
