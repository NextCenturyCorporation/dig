'use strict';

describe('Controller: SearchResultsCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var SearchResultsCtrl, scope, state, imageSearchService;

        var sampleImageSearchDoc = {
        "_index": "dig",
        "_type": "WebPage",
        "_id": "SOMEUNIQUEID",
        "_score": 1.0,
        "_source": {
            "@context": "https://some.server/context.json",
            "snapshotUri": "http://some.server/AAAAA/BBBBB/raw",
            "a": "WebPage",
            "hasBodyPart": {
                "text": "some sample text",
                "a": "WebPageElement",
                "uri": "http://some.server/AAAAA/BBBBB/processed/body"
            },
            "dateCreated": "2015-01-01T00:00:00",
            "hasFeatureCollection": {
                "a": "FeatureCollection",
                "uri": "http://some.server/AAAAA/BBBBB/processed/featurecollection",
                "phonenumber_feature": [
                    {
                        "featureObject": {
                            "location": {
                                "a": "Place",
                                "uri": "http://some.server/data/phone/exchange/123456"
                            },
                            "a": "PhoneNumber",
                            "label": "1234567890",
                            "uri": "http://some.server/data/phonenumber/x-1234567890"
                        },
                        "featureName": "phonenumber",
                        "a": "Feature",
                        "uri": "http://some.server/AAAAA/BBBBB/raw/featurecollection/phonenumber/x-1234567890",
                        "featureValue": "1234567890"
                    }
                ],
                "similar_images_feature": [
                    {
                        "featureName": "similarimageurl",
                        "similarimageurl": "https://some.server/placeholder.jpg",
                        "featureValue": "https://some.server/placeholder.jpg"
                    },
                    {
                        "featureName": "similarimageurl",
                        "similarimageurl": "https://some.server/test.jpg",
                        "featureValue": "https://some.server/test.jpg"
                    },
                    {
                        "featureObject": {
                            "imageObjectUris": [
                                "http://some.server/AAAAA/BBBBB/processed",
                                "http://some.server/AAAAA/CCCCC/processed"
                            ]
                        }
                    }
                ]
            },
            "provider": {
                "a": "Organization",
                "uri": "http://some.server"
            },
            "hasTitlePart": {
                "text": "Sample Title",
                "a": "WebPageElement",
                "uri": "http://some.server/AAAAA/BBBBB/processed/title"
            },
            "hasImagePart": [
                {
                    "snapshotUri": "http://some.server/AAAAA/AAAAA/raw",
                    "a": "ImageObject",
                    "wasGeneratedBy": {
                        "databaseId": "11111",
                        "wasAttributedTo": "http://some.server/unknown",
                        "a": "Activity",
                        "endedAtTime": "2015-01-01T00:00:00"
                    },
                    "cacheUrl": "https://some.server/cached-1.jpg",
                    "uri": "http://some.server/AAAAA/AAAAA/processed",
                    "url": "http://some.server/sample-1.jpg"
                },
                {
                    "snapshotUri": "http://some.server/AAAAA/BBBBB/raw",
                    "a": "ImageObject",
                    "wasGeneratedBy": {
                        "databaseId": "22222",
                        "wasAttributedTo": "http://some.server/unknown",
                        "a": "Activity",
                        "endedAtTime": "2015-01-01T00:00:00"
                    },
                    "cacheUrl": "https://some.server/cached-2.jpg",
                    "uri": "http://some.server/AAAAA/BBBBB/processed",
                    "url": "http://some.server/sample-2.jpg"
                },
                {
                    "snapshotUri": "http://some.server/AAAAA/CCCCC/raw",
                    "a": "ImageObject",
                    "wasGeneratedBy": {
                        "databaseId": "33333",
                        "wasAttributedTo": "http://some.server/unknown",
                        "a": "Activity",
                        "endedAtTime": "2015-01-01T00:00:00"
                    },
                    "cacheUrl": "https://some.server/cached-3.jpg",
                    "uri": "http://some.server/AAAAA/CCCCC/processed",
                    "url": "http://some.server/sample-3.jpg"
                }
            ],
            "uri": "http://some.server/AAAAA/BBBBB/processed",
            "url": "http://some.server/sample.html"
        }
    };

    var sampleImageSearchWithSingleImagePartDoc = {
        "_index": "dig",
        "_type": "WebPage",
        "_id": "SOMEUNIQUEID",
        "_score": 1.0,
        "_source": {
            "@context": "https://some.server/context.json",
            "snapshotUri": "http://some.server/AAAAA/BBBBB/raw",
            "a": "WebPage",
            "hasBodyPart": {
                "text": "some sample text",
                "a": "WebPageElement",
                "uri": "http://some.server/AAAAA/BBBBB/processed/body"
            },
            "dateCreated": "2015-01-01T00:00:00",
            "hasFeatureCollection": {
                "a": "FeatureCollection",
                "uri": "http://some.server/AAAAA/BBBBB/processed/featurecollection",
                "phonenumber_feature": [
                    {
                        "featureObject": {
                            "location": {
                                "a": "Place",
                                "uri": "http://some.server/data/phone/exchange/123456"
                            },
                            "a": "PhoneNumber",
                            "label": "1234567890",
                            "uri": "http://some.server/data/phonenumber/x-1234567890"
                        },
                        "featureName": "phonenumber",
                        "a": "Feature",
                        "uri": "http://some.server/AAAAA/BBBBB/raw/featurecollection/phonenumber/x-1234567890",
                        "featureValue": "1234567890"
                    }
                ],
                "similar_images_feature": [
                    {
                        "featureName": "similarimageurl",
                        "similarimageurl": "https://some.server/test.jpg",
                        "featureValue": "https://some.server/test.jpg"
                    },
                    {
                        "featureObject": {
                            "imageObjectUris": [
                                "http://some.server/AAAAA/BBBBB/processed"
                            ]
                        }
                    }
                ]
            },
            "provider": {
                "a": "Organization",
                "uri": "http://some.server"
            },
            "hasTitlePart": {
                "text": "Sample Title",
                "a": "WebPageElement",
                "uri": "http://some.server/AAAAA/BBBBB/processed/title"
            },
            "hasImagePart": {
                "snapshotUri": "http://some.server/AAAAA/BBBBB/raw",
                "a": "ImageObject",
                "wasGeneratedBy": {
                    "databaseId": "22222",
                    "wasAttributedTo": "http://some.server/unknown",
                    "a": "Activity",
                    "endedAtTime": "2015-01-01T00:00:00"
                },
                "cacheUrl": "https://some.server/cached-2.jpg",
                "uri": "http://some.server/AAAAA/BBBBB/processed",
                "url": "http://some.server/sample-2.jpg"
            },
            "uri": "http://some.server/AAAAA/BBBBB/processed",
            "url": "http://some.server/sample.html"
        }
    };

    // Initialize the controller and a mock scope
    beforeEach(function() {
        var simHost = 'http://localhost';
        var $httpBackend;

        module(function($provide) {
            $provide.constant('simHost', simHost);
            $provide.constant('euiSearchIndex', 'dig');
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_, _imageSearchService_) {
            scope = $rootScope.$new();
            state = $state;
            state.current.name = 'search.results.list';
            spyOn(state, 'go');

            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/gallery/gallery.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/details/details.html'))
                .respond(200, 'some text');
            imageSearchService = _imageSearchService_;

            scope.indexVM = {
                filters: {
                    ejsFilters: []
                },
                loading: true,
                page: 1,
                query: 'someValue',
                pageSize: 10
            };

            scope.euiConfigs = {
                sort: {
                    field: 'dateCreated',
                    defaultOption: {order: 'rank', title: 'Best Match'}, 
                    options: [
                        {order: 'rank', title: 'Best Match'},
                        {order: 'desc', title: 'Newest First'},
                        {order: 'asc', title: 'Oldest First'}
                    ]
                }
            };

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });
    });

    it('should not have scope.doc', function () {
        expect(scope.doc).toBe(undefined);
    });
   
    it('should initialize opened to be an empty array', function () {
        expect(scope.opened.length).toBe(0);
    });

    it('should initialize displayMode.mode to \'list\'', function () {
        expect(scope.displayMode.mode).toBe('list');
    });

    it('should initialize indexVM.pageSize to 25', function () {
        expect(scope.indexVM.pageSize).toBe(25);
    });

    it('should have selectedImage default to 0', function () {
        expect(scope.selectedImage).toBe(0);
    });

    it('should have galleryItem default to empty object', function () {
        expect(scope.galleryItem).toEqual({});
    });

    it('should initialize sort variables based on euiConfigs.sort values if present', function () {
        expect(scope.sortOptions).toEqual(scope.euiConfigs.sort.options);
        expect(scope.selectedSort).toEqual(scope.euiConfigs.sort.defaultOption);
        expect(scope.euiSortOrder).toEqual('desc');
    });

    it('should initialize sort variables to appropriate values if config not present', function () {
        inject(function ($controller) {

            scope.euiConfigs = {};

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });

        expect(scope.sortOptions).toEqual([]);
        expect(scope.selectedSort).toEqual({});
        expect(scope.euiSortOrder).toEqual('desc');
    });

    it('should initialize euiSortOrder to match default option if it is a valid sort order', function () {
        inject(function ($controller) {

            scope.euiConfigs.sort.defaultOption = {order: 'asc', title: 'Oldest First'};

            SearchResultsCtrl = $controller('SearchResultsCtrl', {
                $scope: scope,
                $state: state
            });

            scope.$digest();
        });

        expect(scope.euiSortOrder).toEqual('asc');
    });

    it('should not have scope.previousState', function () {
        expect(scope.previousState).toBe(undefined);
    });

    it('should update selectedImage', function () {
        scope.selectImage(2);

        expect(scope.selectedImage).toBe(2);
    });

    it('should strip out appropriate html tags', function () {
        var validTags = scope.stripHtml('<mark>highlighted text</mark>');
        var invalidTags = scope.stripHtml('<b>no tags</b><br/>should be present <img src="test.jpg">');

        expect(validTags.$$unwrapTrustedValue()).toBe('<mark>highlighted text</mark>');
        expect(invalidTags.$$unwrapTrustedValue()).toBe('no tagsshould be present ');
    });

    it('should update state to details view and add passed in doc and state to scope', function () {
        var testDoc = {name: 'TestDoc'};

        scope.viewDetails(testDoc, 'list');

        expect(scope.doc).not.toBeNull();
        expect(scope.previousState).toBe('list');
        expect(state.go).toHaveBeenCalledWith('search.results.details');
    });

    it('should update state from details to list view and null out scope.doc if scope.doc is set and previousState is not set', function () {
        scope.doc = {name: 'TestDoc'};
        spyOn(scope, 'viewList');

        scope.backToPreviousState();

        expect(scope.doc).toBeNull();
        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should not null out scope.doc if it does not exist', function () {
        spyOn(scope, 'viewList');

        scope.backToPreviousState();

        expect(scope.doc).toBe(undefined);
        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should update state from details to previous view and null out scope.doc if scope.doc is set and previousState is set', function () {
        scope.doc = {name: 'TestDoc'};
        scope.previousState = 'gallery';
        spyOn(scope, 'viewGallery');

        scope.backToPreviousState();

        expect(scope.doc).toBeNull();
        expect(scope.viewGallery).toHaveBeenCalled();
    });

    it('should set displayMode.mode to \'gallery\' and make appropriate state call', function () {
        scope.viewGallery();

        expect(scope.displayMode.mode).toBe('gallery');
        expect(state.go).toHaveBeenCalledWith('search.results.gallery');
    });

    it('should set displayMode.mode to \'list\' and make appropriate state call', function () {
        scope.viewList();

        expect(scope.displayMode.mode).toBe('list');
        expect(state.go).toHaveBeenCalledWith('search.results.list');
    });

    it('should return whether or not a list item is opened by id', function() {
        expect(scope.isListItemOpened('foo')).toBe(false);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(true);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(false);
    });


    it('should return whether or not a gallery item is opened by id', function() {
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(false);

        scope.toggleGalleryItemOpened('foo', 1);
        expect(scope.isGalleryItemPopulated()).toBe(true);
        expect(scope.isGalleryItemOpened('blah')).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(true);

        scope.clearGalleryItem();
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.isGalleryItemOpened('foo')).toBe(false);
    });

    it('should switch to list view', function () {
        spyOn(scope, 'viewList');
        scope.switchView('list');

        expect(scope.viewList).toHaveBeenCalled();
    });

    it('should switch to gallery view', function () {
        spyOn(scope, 'viewGallery');
        scope.switchView('gallery');

        expect(scope.viewGallery).toHaveBeenCalled();
    });

    it('should not switch view', function () {
        spyOn(scope, 'viewList');
        spyOn(scope, 'viewGallery');
        scope.switchView('notAView');

        expect(scope.viewList).not.toHaveBeenCalled();
        expect(scope.viewGallery).not.toHaveBeenCalled();
    });

    it('should switch selectedSort and euiSortOrder to new value', function() {
        scope.switchSort(2);

        expect(scope.selectedSort).toEqual(scope.sortOptions[2]);
        expect(scope.euiSortOrder).toEqual(scope.sortOptions[2].order);
    });

    it('should switch selectedSort but not euiSortOrder to new value', function() {
        scope.switchSort(0);

        expect(scope.selectedSort).toEqual(scope.sortOptions[0]);
        expect(scope.euiSortOrder).toNotEqual(scope.sortOptions[0].order);
    });

    it('should check for valid sort orders', function() {
        expect(scope.validSortOrder('asc')).toBe(true);
        expect(scope.validSortOrder('desc')).toBe(true);
        expect(scope.validSortOrder('invalid')).toBe(false);
        expect(scope.validSortOrder('rank')).toBe(false);
    });

    it('should clear the opened items list on a query change and reset page to 1', function() {
        expect(scope.opened.length).toBe(0);

        scope.toggleListItemOpened('foo');
        scope.indexVM.query = 'some new query';
        scope.$digest();
        expect(scope.opened.length).toBe(0);
        expect(scope.isListItemOpened('foo')).toBe(false);
        expect(scope.isGalleryItemPopulated()).toBe(false);
        expect(scope.indexVM.page).toBe(1);
    });

    // TODO: Move this to the spec for the details page controller when the search controller is
    // refactored.
    it('.setImageSearchMatchIndices() should set the image match indices and selected image when an image search is active and enabled', function() {
        scope.doc = sampleImageSearchDoc;
        imageSearchService.imageSearch('https://some.server/test.jpg');
        imageSearchService.setImageSearchEnabled('https://some.server/test.jpg', true);
        scope.setImageSearchMatchIndices();

        expect(scope.imageMatchStates.length).toBe(3);
        expect(scope.imageMatchStates[0]).toBe(false);
        expect(scope.imageMatchStates[1]).toBe(true);
        expect(scope.imageMatchStates[2]).toBe(true);
        expect(scope.selectedImage).toBe(1);
    });

    // TODO: Move this to the spec for the details page controller when the search controller is
    // refactored.
    it('.setImageSearchMatchIndices() should set the image match indices and selected image when only one image part is available', function() {
        scope.doc = sampleImageSearchWithSingleImagePartDoc;
        imageSearchService.imageSearch('https://some.server/test.jpg');
        imageSearchService.setImageSearchEnabled('https://some.server/test.jpg', true);
        scope.setImageSearchMatchIndices();

        expect(scope.imageMatchStates.length).toBe(0);
        expect(scope.selectedImage).toBe(0);
    });

    // TODO: Move this to the spec for the details page controller when the search controller is
    // refactored.
    it('.setImageSearchMatchIndices() should clear the image match indices and selected image when no image search is active', function() {
        scope.doc = sampleImageSearchWithSingleImagePartDoc;
        scope.setImageSearchMatchIndices();

        expect(scope.imageMatchStates.length).toBe(0);
        expect(scope.selectedImage).toBe(0);

        imageSearchService.imageSearch('https://some.server/test.jpg');
        imageSearchService.setImageSearchEnabled('https://some.server/test.jpg', false);

        expect(scope.imageMatchStates.length).toBe(0);
        expect(scope.selectedImage).toBe(0);
    });

});
