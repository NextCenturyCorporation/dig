'use strict';

describe('Controller: SearchCtrl', function() {
    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var SearchCtrl, scope, state, modal, blurImageSvcMock;

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
            $provide.constant('euiConfigs', {
                facets: [],
                listFields: [],
                detailsFields: []
            });
            $provide.constant('includeMissingDefault', false);
        });

        inject(function($controller, $rootScope, $state, $modal, _$httpBackend_, _imageSearchService_) {
            scope = $rootScope.$new();
            state = $state;
            modal = $modal;
            blurImageSvcMock = {
                blurEnabled: 'blur',
                getBlurImagesEnabled: function() {
                    return this.blurEnabled;
                },
                changeBlurImagesEnabled: function(isBlurred) {
                    if(isBlurred) {
                        blurEnabled: 'blur';
                    } else {
                        blurEnabled: false;
                    }
                }
            }
            state.current.name = 'search';
            spyOn(state, 'go');
            spyOn(modal, 'open');
            spyOn(blurImageSvcMock, 'changeBlurImagesEnabled');

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
                $state: state,
                $modal: modal,
                blurImageService: blurImageSvcMock
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

    it('should call state.go with reload set to true', function() {
        scope.reload();
        expect(state.go).toHaveBeenCalledWith('search.results.list', {}, {'reload': true});
    });

    it('should initialize isBlurred to true', function() {
        expect(scope.isBlurred).toBe(true);
    });

    it('should initialize showresults to false', function() {
        expect(scope.showresults).toBe(false);
    });

    it('should initialize loading to false', function() {
        expect(scope.loading).toBe(false);
    });

    it('should initialize queryString values to empty strings', function() {
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
    });

    it('should call blurImageService with false parameter', function() {
        scope.changeBlur();
        expect(blurImageSvcMock.changeBlurImagesEnabled).toHaveBeenCalledWith(false);
    });

    it('should call blurImageService with true parameter', function() {
        scope.isBlurred = false;
        scope.changeBlur();
        expect(blurImageSvcMock.changeBlurImagesEnabled).toHaveBeenCalledWith(true);
    });

    it('should make call to open modal', function() {
        var modalParameters = {
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        };

        scope.openAbout();
        expect(modal.open).toHaveBeenCalledWith(modalParameters);
    });

    it('should remove correct aggFilter', function() {
        scope.filterStates.aggFilters['test'] = {};
        scope.filterStates.aggFilters['test']['value1'] = true;
        scope.filterStates.aggFilters['test']['value2'] = true;

        expect(scope.filterStates.aggFilters['test']['value1']).toBe(true);
        expect(scope.filterStates.aggFilters['test']['value2']).toBe(true);

        scope.removeAggFilter('test', 'value2');
        expect(scope.filterStates.aggFilters['test']['value1']).toBe(true);
        expect(scope.filterStates.aggFilters['test']['value2']).toBe(false);
    });

    it('should remove correct textFilter', function() {
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

    it('should set queryString.submitted to user input', function() {
        scope.queryString.live = 'test';
        scope.submit();
        expect(scope.queryString.submitted).toBe('test');
     });

    it('should set showresults to true', function() {
        scope.queryString.submitted = 'test';
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.showresults).toBe(true);
    });

    it('should set loading to false', function() {
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.loading).toBe(false);
    });

    it('should default to list view', function() {
        expect(state.go).toHaveBeenCalledWith('search.results.list');
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

    it('should toggle the enable state of the active search appropriately', function() {
        var enabled = false;
        // Since this merely intiates a search which won't complete, the initial enable
        // state should be false.
        imageSearchService.imageSearch('https://some.server/test.jpg');
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(false);

        scope.toggleImageSearchEnabled('https://some.server/test.jpg', true);
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(true);

        scope.toggleImageSearchEnabled('https://some.server/test.jpg', false);
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(false);
    });
});