'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var SearchCtrl, scope, state;

    var sampleDoc = {
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
                }
            ],
            "uri": "http://some.server/AAAAA/BBBBB/processed",
            "url": "http://some.server/sample.html"
        }
    };

    var sampleDocMissingCacheUrl = {
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
                "snapshotUri": "http://some.server/AAAAA/AAAAA/raw",
                "a": "ImageObject",
                "wasGeneratedBy": {
                    "databaseId": "11111",
                    "wasAttributedTo": "http://some.server/unknown",
                    "a": "Activity",
                    "endedAtTime": "2015-01-01T00:00:00"
                },
                "uri": "http://some.server/AAAAA/AAAAA/processed",
                "url": "http://some.server/sample-1.jpg"
            },
            "uri": "http://some.server/AAAAA/BBBBB/processed",
            "url": "http://some.server/sample.html"
        }
    };

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
        var searchQuery;

        module(function($provide) {
            $provide.constant('simHost', simHost);
            $provide.constant('euiSearchIndex', 'dig');
            $provide.constant('euiConfigs', {
                facets: [],
                listFields: [],
                detailsFields: []
            })
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_, _imageSearchService_) {
            scope = $rootScope.$new();
            state = $state;
            state.current.name = 'search';
            spyOn(state, 'go');

            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/details/details.html'))
                .respond(200, 'some text');
            imageSearchService = _imageSearchService_;

            SearchCtrl = $controller('SearchCtrl', {
                $scope: scope,
                $state: state
            });

            scope.indexVM = {
                filters: {
                    ejsFilters: []
                },
                loading: true,
                page: 1,
                query: 'someValue'
            };
            scope.$digest();
        });
    });

    it('should call state.go with reload set to true', function () {
        scope.reload();
        expect(state.go).toHaveBeenCalledWith('search.results.list', {}, {'reload': true});
    });

    it('should initialize showresults to false', function () {
        expect(scope.showresults).toBe(false);
    });

    it('should initialize loading to false', function () {
        expect(scope.loading).toBe(false);
    });

    it('should initialize queryString values to empty strings', function () {
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
    });

    it('should set queryString.submitted to user input', function () {
        scope.queryString.live = 'test';
        scope.submit();
        expect(scope.queryString.submitted).toBe('test');
     });

    it('should set showresults to true', function () {
        scope.queryString.submitted = 'test';
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.showresults).toBe(true);
    });

    it('should set loading to false', function () {
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.loading).toBe(false);
    });

    it('should have selectedImage default to 0', function () {
        expect(scope.selectedImage).toBe(0);
    });

    it('should not have scope.doc', function () {
        expect(scope.doc).toBe(undefined);
    });

    it('should default to list view', function () {
        expect(state.go).toHaveBeenCalledWith('search.results.list');
    });

    it('should update selectedImage', function () {
        scope.selectImage(2);

        expect(scope.selectedImage).toBe(2);
    });

    it('should select first image part if no image search is active', function() {
        expect(scope.getDisplayImageSrc(sampleDoc)).toBe("https://some.server/cached-1.jpg");
    });

    it('should select first matching image part if an image search is active', function() {
        imageSearchService.imageSearch('https://some.server/test.jpg');
        expect(scope.getDisplayImageSrc(sampleImageSearchDoc)).toBe("https://some.server/cached-2.jpg")
    });

    it('should select image part object if an image search is active and the doc has only one image', function() {
        imageSearchService.imageSearch('https://some.server/test.jpg');
        expect(scope.getDisplayImageSrc(sampleImageSearchWithSingleImagePartDoc)).toBe("https://some.server/cached-2.jpg")
    });

    it('should generate an empty display image src if no cacheUrl is present', function() {
        expect(scope.getDisplayImageSrc(sampleDocMissingCacheUrl)).toBe("");
    });
});
