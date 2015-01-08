'use strict';

describe('Service: imageSearchService', function () {
    var simHost = 'http://localhost';

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var $httpBackend;
    var imageSearchRequest;

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('simHost', simHost);
        });

        inject(function(_imageSearchService_, _$httpBackend_) {
            imageSearchService = _imageSearchService_;
            $httpBackend = _$httpBackend_;


            imageSearchRequest = $httpBackend.when('GET', new RegExp(simHost + '/imagesim\\?uri=*'))
                .respond(200, {some: 'json'});
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

    it('should set active image search on successful search', function() {
        imageSearchService.imageSearch('http://foo');

        var activeSearch = imageSearchService.getActiveImageSearch();

        $httpBackend.flush();

        expect(activeSearch).not.toBeNull();

        expect(activeSearch.url).toBeDefined();
        expect(activeSearch.url).toBe('http://foo');
        expect(activeSearch.status).toBeDefined();
        expect(activeSearch.status).toBe('success');
    });

    it('should set active image search on pending search', function() {
        imageSearchService.imageSearch('http://foo');

        var activeSearch = imageSearchService.getActiveImageSearch();

        expect(activeSearch).not.toBeNull();

        expect(activeSearch.url).toBeDefined();
        expect(activeSearch.url).toBe('http://foo');
        expect(activeSearch.status).toBeDefined();
        expect(activeSearch.status).toBe('searching');

        $httpBackend.flush();

        expect(activeSearch).not.toBeNull();

        expect(activeSearch.url).toBeDefined();
        expect(activeSearch.url).toBe('http://foo');
        expect(activeSearch.status).toBeDefined();
        expect(activeSearch.status).toBe('success');
    });

    it('should clear active image search on failure', function() {
        imageSearchRequest.respond(500, '');

        imageSearchService.imageSearch('http://foo');

        $httpBackend.flush();

        var activeSearch = imageSearchService.getActiveImageSearch();
        expect(activeSearch).toBeNull();
    });

    it('should return the status for available searches', function() {
        var imgUrl = 'http://foo';

        imageSearchRequest.respond(200, {some: 'json'});

        imageSearchService.imageSearch(imgUrl);
        expect(imageSearchService.getImageSearchStatus(imgUrl)).toBe('searching');

        $httpBackend.flush();

        expect(imageSearchService.getImageSearchStatus(imgUrl)).toBe('success');
    });

    it('should clear only the active image search for clearActiveImageSearch', function() {
        var imgUrl = 'http://foo';

        imageSearchRequest.respond(200, {some: 'json'});

        imageSearchService.imageSearch(imgUrl);
        $httpBackend.flush();

        imageSearchService.clearActiveImageSearch();

        var activeSearch = imageSearchService.getActiveImageSearch();
        expect(imageSearchService.getImageSearchStatus(imgUrl)).toBe('success');

        expect(activeSearch).toBeNull();
    });

    it('should clear all search requests for clearImageSearches', function() {
        var imgUrl = 'http://foo';

        imageSearchRequest.respond(200, {some: 'json'});

        imageSearchService.imageSearch('http://foo');
        $httpBackend.flush();

        imageSearchService.clearImageSearches();

        var activeSearch = imageSearchService.getActiveImageSearch();
        expect(imageSearchService.getImageSearchStatus(imgUrl)).toBe('no search available');
        expect(activeSearch).toBeNull();
    })
});
