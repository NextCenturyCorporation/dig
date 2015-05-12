'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var MainCtrl, scope, rootScope, state;
    var folders = [
      {
        _id: 0,
        username: "test",
        name: "ROOT",
        childIds: [1, 3]
      },{
        _id: 1,
        username: "test",
        name: "folder1",
        parentId: 0,
        childIds: [2]
      },{
        _id: 2,
        username: "test",
        name: "folder2",
        parentId: 1,
        childIds: []
      },{
        _id: 3,
        username: "test",
        name: "folder3",
        parentId: 0,
        childIds: [4]
      },{
        _id: 4,
        username: "test",
        name: "folder4",
        parentId: 3,
        childIds: [5, 6]
      },{
        _id: 5,
        username: "test",
        name: "folder5",
        parentId: 4,
        childIds: []
      },{
        _id: 6,
        username: "test",
        name: "folder6",
        parentId: 4,
        childIds: []
      }
    ];

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
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_, _imageSearchService_) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            state = $state;
            state.current.name = 'main';
            spyOn(state, 'go');

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/folders/').respond(200, folders);
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

            MainCtrl = $controller('MainCtrl', {
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

    it('should initialize variables based on state params', function() {
        inject(function($controller) {
            state.current.name = 'main.search.results.list';
            state.params = {
                query: { 
                    _id: 1,
                    name: 'Query #1',
                    digState: {
                        searchTerms: 'bob smith',
                        filters: {
                            aggFilters: {
                                city_agg: {
                                  'LittleRock': true,
                                  'FortSmith': true
                                }
                            },
                            textFilters: {
                                phonenumber: {
                                  live: '',
                                  submitted: ''
                                }
                            },
                            dateFilters: {
                                dateCreated: {
                                  beginDate: null,
                                  endDate: null
                                }
                            }
                        },
                        selectedSort: {
                            title:'Best Match',
                            order:'rank'
                        },  
                        includeMissing: {
                            allIncludeMissing : false, 
                            aggregations : { 
                                city_agg : { 
                                    active : true 
                                } 
                            } 
                        }
                    }, 
                    elasticUIState: {
                        queryState: {
                            query_string: {
                                fields:['_all'],
                                query:'bob smith'
                            }
                        },
                        filterState: {
                            bool: {
                                should: [
                                    {
                                        terms: {
                                            'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality':['LittleRock']
                                        }
                                    },
                                    {
                                        terms: {
                                            'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality':['FortSmith']
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    username: 'test',
                    frequency: 'daily',
                    createDate: '2015-04-01T20:13:11.093Z',
                    lastRunDate: '2015-04-01T20:13:11.093Z'
                }    
            };

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                $state: state
            });

            rootScope.$broadcast('$locationChangeSuccess', '/list', '/queries');

        });

        expect(scope.queryString.live).toBe(state.params.query.digState.searchTerms);
        expect(scope.queryString.submitted).toBe(state.params.query.digState.searchTerms);
        expect(scope.filterStates).toEqual(state.params.query.digState.filters);
        expect(scope.includeMissing).toEqual(state.params.query.digState.includeMissing);
        expect(scope.selectedSort).toEqual(state.params.query.digState.selectedSort);

    });

    it('should not initialize query state if query params blank', function() {
        inject(function($controller) {
            state.params = {query: {digState:{filters: {}}}};

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                $state: state
            });

            rootScope.$broadcast('$locationChangeSuccess', '/list', '/queries');

        });
    
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
        expect(scope.filterStates).toEqual({aggFilters: {}, textFilters: {}, dateFilters: {}});
        expect(scope.includeMissing).toEqual({aggregations: {}, allIncludeMissing: false});
        expect(scope.selectedSort).toEqual({});

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

    it('should set loading to false', function () {
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.loading).toBe(false);
    });

    it('should set showresults to true', function () {
        scope.queryString.submitted = 'test';
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.showresults).toBe(true);
    });

    it('should default to list view', function () {
        expect(state.go).toHaveBeenCalledWith('main.search.results.list');
    });

    it('should set queryString.submitted to user input', function () {
        scope.queryString.live = 'test';
        scope.submit();
        expect(scope.queryString.submitted).toBe('test');
    });

    it('should toggle the enable state of the active search appropriately', function() {
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
