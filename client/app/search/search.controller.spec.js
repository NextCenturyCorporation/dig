'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var SearchCtrl, scope, rootScope, state, modal;

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
        var searchQuery;

        module(function($provide) {
            $provide.constant('simHost', simHost);
            $provide.constant('euiSearchIndex', 'dig');
        });

        inject(function ($controller, $rootScope, $state, $modal, _$httpBackend_, _imageSearchService_) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            state = $state;
            modal = $modal;
            scope.queryString = {
                live: '', submitted: ''
            };
            scope.filterStates = {
                aggFilters: {},
                textFilters: {},
                dateFilters: {}
            };
            state.current.name = 'main.search';
            spyOn(state, 'go');
            spyOn(modal, 'open');

            $httpBackend = _$httpBackend_;
            $httpBackend.when('GET', new RegExp('app/search/main.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/details/details.html'))
                .respond(200, 'some text');
            imageSearchService = _imageSearchService_;

            SearchCtrl = $controller('SearchCtrl', {
                $scope: scope,
                $state: state,
                $modal: modal
            });

            scope.$digest();
        });

    });

    it('should call state.go with reload set to true', function () {
        scope.reload();
        expect(state.go).toHaveBeenCalledWith('main.search.results.list', {}, {'reload': true});
    });

    it('should make call to open modal', function () {
        var modalParameters = {
            templateUrl: 'app/queries/save-query.html',
            controller: 'SaveQueryCtrl',
            resolve: {
                digState: jasmine.any(Function),
                elasticUIState: jasmine.any(Function)
            },
            size: 'sm'
        };

        scope.saveQuery();
        expect(modal.open).toHaveBeenCalledWith(modalParameters);
    });

    it('should remove correct aggFilter', function () {
        scope.filterStates.aggFilters['test'] = {};
        scope.filterStates.aggFilters['test']['value1'] = true; 
        scope.filterStates.aggFilters['test']['value2'] = true; 

        expect(scope.filterStates.aggFilters['test']['value1']).toBe(true);
        expect(scope.filterStates.aggFilters['test']['value2']).toBe(true);

        scope.removeAggFilter('test', 'value2');
        expect(scope.filterStates.aggFilters['test']['value1']).toBe(true);
        expect(scope.filterStates.aggFilters['test']['value2']).toBe(false);
    });

    it('should remove correct textFilter', function () {
        scope.filterStates.textFilters['textKey'] = {live: 'sometext', submitted: 'somethingelse'};
        expect(scope.filterStates.textFilters['textKey'].live).toBe('sometext');
        expect(scope.filterStates.textFilters['textKey'].submitted).toBe('somethingelse');

        scope.removeTextFilter('textKey');
        expect(scope.filterStates.textFilters['textKey'].live).toBe('');
        expect(scope.filterStates.textFilters['textKey'].submitted).toBe('');
    });

    it('should remove correct dateFilter', function() {
        var beginDate = new Date(2014, 11, 31);
        var endDate = new Date(2015, 0, 1); 

        scope.filterStates.dateFilters['test'] = {};
        scope.filterStates.dateFilters['test']['value1'] = beginDate;
        scope.filterStates.dateFilters['test']['value2'] = endDate;
        
        expect(scope.filterStates.dateFilters['test']['value1'].getTime()).toBe(beginDate.getTime());
        expect(scope.filterStates.dateFilters['test']['value2'].getTime()).toBe(endDate.getTime());

        scope.removeDateFilter('test', 'value2');
        expect(scope.filterStates.dateFilters['test']['value1'].getTime()).toBe(beginDate.getTime());
        expect(scope.filterStates.dateFilters['test']['value2']).toBe(null);
    });

    it('should select first image part if no image search is active', function() {
        expect(scope.getDisplayImageSrc(sampleDoc)).toBe("https://some.server/cached-1.jpg");
    });

    it('should select first matching image part if an image search is active', function() {
        imageSearchService.imageSearch('https://some.server/test.jpg');
        imageSearchService.setImageSearchEnabled('https://some.server/test.jpg', true);
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
