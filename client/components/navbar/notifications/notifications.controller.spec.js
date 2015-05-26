'use strict';

describe('Controller: NotificationsCtrl', function () {

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
        'frequency': 'daily',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z',
        'notificationHasRun': false
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
        'frequency': 'daily',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z',
        'notificationHasRun': false
      }
    ];

    var NotificationsCtrl, scope, state, $httpBackend, http, mockUser;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, $state, _$httpBackend_, $http) {
            scope = $rootScope.$new();
            state = $state;
            http = $http;
            $httpBackend = _$httpBackend_;

            spyOn(state, 'go');

            mockUser = {
                notificationCount: function() {
                    return queryResults.length;
                }
            };

            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');

            $httpBackend.expectGET('api/users/reqHeader/queries/notifications').respond(200, queryResults);

            NotificationsCtrl = $controller('NotificationsCtrl', {
                $scope: scope,
                $state: state,
                $http: http,
                User: mockUser
            });

            $httpBackend.flush();
        });
    });

    it('should initalize notificationCount', function () {
        expect(scope.notificationCount).toEqual(queryResults.length);
    });

    it('should initalize queriesWithNotifications', function () {
        expect(scope.queriesWithNotifications).toEqual(queryResults);
    });

    it('should initalize queriesWithNotifications', function () {
        expect(scope.queriesWithNotifications).toEqual(queryResults);
    });

    it('should call runQuery with query param', function() {
        state.current = {name: 'queries'};
        scope.runQuery(queryResults[0]);

        expect(state.go).toHaveBeenCalledWith('search.results.list', {query: queryResults[0]}, {location: true});

    });

    it('should call runQuery with query param and callSubmit set to true', function() {
        state.current = {name: 'search.results.list'};
        scope.runQuery(queryResults[0]);

        expect(state.go).toHaveBeenCalledWith('search.results.list', {query: queryResults[0], callSubmit: true}, {location: true});
    });
});
