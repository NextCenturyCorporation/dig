'use strict';

describe('Controller: QueriesCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var queryResults = 
    [
      {
        '_id': 1,
        'name': 'Query #1',
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
        'username': 'test',
        'frequency': 'daily',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      },
      {
        '_id': 2,
        'name': 'Query #2',
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
        'username': 'test',
        'frequency': 'daily',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      }
    ];

    var QueriesCtrl, scope, state, $httpBackend, http, mockUser;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        module(function($provide) {
            $provide.constant('euiConfigs', {
                facets: []
            });
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_, $http) {
            scope = $rootScope.$new();
            state = $state;
            http = $http;
            $httpBackend = _$httpBackend_;

            spyOn(state, 'go');

            mockUser = {
                get: function() {
                    return {'username': 'test'};
                }
            };

            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');

            $httpBackend.expectGET('api/query/').respond(200, queryResults);

            QueriesCtrl = $controller('QueriesCtrl', {
                $scope: scope,
                $state: state,
                $http: http,
                User: mockUser
            });

            $httpBackend.flush();
        });
    });

    it('should initalize scope.opened', function () {
        expect(scope.opened).toEqual([]);
    });

    it('should initialize user', function () {
        expect(scope.currentUser).toEqual({'username': 'test'});
    });

    it('should initialize scope.frequencyOptions', function () {
        expect(scope.frequencyOptions).toEqual(['daily', 'weekly', 'monthly']);
    });

    it('should initalize scope.queryResults', function () {
        expect(scope.queryResults).toEqual(queryResults);
    });

    it('should return whether or not a list item is opened by id', function() {
        expect(scope.isListItemOpened('foo')).toBe(false);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(true);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(false);
    });

    it('should make delete request with correct id and update queryResults', function () {
        $httpBackend.expectDELETE('api/query/1').respond(200, {});
        $httpBackend.expectGET('api/query/').respond(200, queryResults);

        scope.deleteQuery(1);
        $httpBackend.flush();
    });

    it('should make put request with correct id and parameter', function () {
        $httpBackend.expectPUT('api/query/2', {frequency: 'monthly'}).respond(200, {});

        scope.toggleFrequency(2, 'monthly');
        $httpBackend.flush();
    });

    it('should call state.go with correct parameters', function () {
        scope.runQuery(queryResults[0]);

        expect(state.go).toHaveBeenCalledWith('search.results.list', {query: queryResults[0]}, {location: true});
    });
});
