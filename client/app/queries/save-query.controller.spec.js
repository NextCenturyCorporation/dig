'use strict';

describe('Controller: SaveQueryCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var queryResults = 
    [
      {
        'id': 1,
        'name': 'Query #1',
        'digState': {
            'searchTerms': 'bob smith',
            'filters': {
                'aggFilters': {
                    'city_agg': {
                        'LittleRock': true,
                        'FortSmith': true
                    }
                },
                'textFilters': {
                    'phonenumber': {
                        'live': '',
                        'submitted': ''
                    }
                },
                'dateFilters': {
                    'dateCreated': {
                        'beginDate': null,
                        'endDate': null
                    }
                }
            },
            'selectedSort': {
                'title': 'Best Match',
                'order': 'rank'
            },
            'includeMissing': {
                'aggregations': {},
                'allIncludeMissing': false
            }
        },
        'elasticUIState': {
            'queryState': {
                'query_string': {
                    'fields': ['_all'],
                    'query': 'bob smith'
                }
            },
            'filterState': {
                'bool': {
                    'should': [
                        {
                            'terms': {
                                'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality': [
                                    'LittleRock'
                                ]
                            }
                        },
                        {
                            'terms': {
                                'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality': [
                                    'FortSmith'
                                ]
                            }
                        }
                    ]
                }
            }
        },
        'username': 'test',
        'frequency': 'never',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      },
      {
        'id': 2,
        'name': 'Query #2',
        'digState': {
            'searchTerms': 'jane doe',
            'filters': {
                'textFilters': {
                    'phonenumber': {
                        'live': '',
                        'submitted': ''
                    }
                },
                'dateFilters': {
                    'dateCreated': {
                        'beginDate': '2013-02-02T05:00:00.000Z',
                        'endDate': '2015-02-03T05:00:00.000Z'
                    }
                }
            },
            'selectedSort': {
                'title':'Best Match',
                'order':'rank'
            },
            'includeMissing': {
                'aggregations': {},
                'allIncludeMissing': false
            }
        },
        'elasticUIState': {
            'queryState': {
                'query_string': {
                    'query': 'jane doe',
                    'fields': ['_all']
                }
            },
            'filterState': {
                'bool': {
                    'must': [
                        {
                            'range': {
                                'dateCreated': {
                                    'from':'2013-02-02'
                                }
                            }
                        },
                        {
                            'range': {
                                'dateCreated': {
                                    'to':'2015-02-03'
                                }
                            }
                        }
                    ]
                }
            }
        },
        'username': 'test',
        'frequency': 'never',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      }
    ];

    // instantiate service
    var SaveQueryCtrl, scope, modalInstance, http, window, $httpBackend, mockUser, 
        digState, elasticUIState;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        digState = {
            searchTerms: 'search terms',
            filter: {'filter': 'option'},
            includeMissing: {'aggregations': {}, 'allIncludeMissing': false},
            selectedSort:  {'title':'Newest First','order':'desc'}
        };

        elasticUIState = {
            queryState: {
                queryString: {
                    query: 'search terms',
                    fields: ['_all']
                }
            },
            filterState: {
                filter: 'option' 
            }
        };

        module(function($provide) {
            $provide.constant('digState', digState);
            $provide.constant('elasticUIState', elasticUIState);
        });

        inject(function ($controller, $rootScope, _$httpBackend_, $http, $window) {
            scope = $rootScope.$new();
            modalInstance = { 
                close: jasmine.createSpy('modalInstance.close')
            };
            http = $http;
            $httpBackend = _$httpBackend_;
            window = $window;

            mockUser = {
                get: function() {
                    return {'username': 'test'};
                }
            };

            $httpBackend.expectGET('api/users/reqHeader/queries').respond(200, queryResults);

            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');

            SaveQueryCtrl = $controller('SaveQueryCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                $http: http,
                $window: window,
                User: mockUser
            });

            $httpBackend.flush();
        });
    });

    it('should initialize queryString to correct value', function () {
        expect(scope.searchTerms).toBe(digState.searchTerms);
    });

    it('should initialize filterStates to correct value', function () {
        expect(scope.filters).toBe(digState.filters);
    });

    it('should initialize includeMissing to correct value', function () {
        expect(scope.includeMissing).toBe(digState.includeMissing);
    });

    it('should initialize selectedSort to correct value', function () {
        expect(scope.selectedSort).toBe(digState.selectedSort);
    });

    it('should initialize user', function () {
        expect(scope.currentUser).toEqual({'username': 'test'});
    });

    it('should initialize query to correct value', function () {
        expect(scope.query).toEqual({name: '', frequency: 'never', digState: {}, elasticUIState: {}});
    });

    it('should initialize scope.frequencyOptions', function () {
        expect(scope.frequencyOptions).toEqual(['never', 'hourly', 'daily', 'weekly']);
    });

    it('should update query.name to match existingQuery.name', function () {
        scope.existingQuery = queryResults[0];
        scope.updateName();

        expect(scope.query.name).toEqual(scope.existingQuery.name);
    });

    it('should reset query.name to blank value', function () {
        scope.query.name = 'test';
        scope.updateName();

        expect(scope.query.name).toEqual('');
    });

    it('should save, post, and call close() function', function () {
        $httpBackend.expectPOST('api/users/reqHeader/queries').respond(200, {});

        scope.save();
        
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should save, update, and call close() function', function () {
        spyOn(window, 'confirm').and.callFake(function () {
            return true;
        });

        scope.existingQuery = queryResults[0];
        scope.query.name = 'Query #1';
        $httpBackend.expectPUT('api/queries/1', scope.query).respond(200, {});

        scope.save();
        
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should not update if user cancels existing query overwrite', function() {
        spyOn(window, 'confirm').and.callFake(function () {
            return false;
        });

        spyOn(http, 'put');

        scope.existingQuery = queryResults[0];
        scope.query.name = 'Query #1';

        scope.save();

        expect(http.put).not.toHaveBeenCalled();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should call close() function', function () {
        scope.cancel();
        expect(modalInstance.close).toHaveBeenCalled();
    });

});
