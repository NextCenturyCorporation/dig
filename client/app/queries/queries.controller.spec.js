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
        'frequency': 'never',
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
        'frequency': 'never',
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      }
    ];

    var QueriesCtrl, scope, state, $httpBackend, http, mockUserSvc, user, notifications;

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

            user = 
            {
              'username': 'test', 
              'notificationCount' : 2
            };

            mockUserSvc = {
                get: function() {
                    return user;
                },
                update: function(jsonObj) {
                    user.notificationCount = jsonObj.notificationCount;
                    return user;
                }
            };

            notifications = 
            [
              {
                '_id': 11,
                'queryId': 1,
                'username': 'test',
                'hasRun': false,
                'dateCreated': '2015-04-01T20:13:11.093Z'
              },
              {
                '_id': 12,
                'queryId': 2,
                'username': 'test',
                'hasRun': false,
                'dateCreated': '2015-04-01T20:13:11.093Z'
              }
            ];

            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');

            $httpBackend.expectGET('api/queries/').respond(200, queryResults);
            $httpBackend.expectGET('api/notifications/').respond(200, notifications);

            QueriesCtrl = $controller('QueriesCtrl', {
                $scope: scope,
                $state: state,
                $http: http,
                User: mockUserSvc
            });

            $httpBackend.flush();
        });
    });

    it('should initalize scope.opened', function () {
        expect(scope.opened).toEqual([]);
    });

    it('should initialize user', function () {
        expect(scope.currentUser).toEqual(user);
    });

    it('should initialize scope.frequencyOptions', function () {
        expect(scope.frequencyOptions).toEqual(['never', 'hourly', 'daily', 'weekly']);
    });

    it('should initalize scope.queryResults', function () {
        expect(scope.queryResults).toEqual(queryResults);
    });

    it('should initalize scope.notifications', function () {
        expect(scope.notifications).toEqual(notifications);
    });

    it('should return whether or not a list item is opened by id', function() {
        expect(scope.isListItemOpened('foo')).toBe(false);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(true);

        scope.toggleListItemOpened('foo');
        expect(scope.isListItemOpened('foo')).toBe(false);
    });

    it('should make delete request with correct id and update queryResults and notifications', function () {
        $httpBackend.expectDELETE('api/queries/1').respond(204, {});
        $httpBackend.expectGET('api/queries/').respond(200, queryResults);
        $httpBackend.expectGET('api/notifications?queryId=1').respond(200, [].concat(notifications[0]));
        $httpBackend.expectDELETE('api/notifications/11').respond(204, {});
        $httpBackend.expectGET('api/notifications/').respond(200, notifications);

        scope.deleteQuery(1);
        $httpBackend.flush();
        
        expect(scope.currentUser.notificationCount).toBe(1);
    });

    it('should make put request with correct id and parameter', function () {
        $httpBackend.expectPUT('api/queries/2', {frequency: 'hourly'}).respond(200, {});

        scope.toggleFrequency(2, 'hourly');
        $httpBackend.flush();
    });

    it('should call state.go with correct parameters', function () {
        $httpBackend.expectPUT('api/queries/1').respond(200, {});
        $httpBackend.expectGET('api/notifications?queryId=1').respond(200, [].concat(notifications[0]));
        $httpBackend.expectPUT('api/notifications/11', {hasRun: true}).respond(200, {});

        scope.runQuery(queryResults[0]);
        $httpBackend.flush();

        expect(scope.currentUser.notificationCount).toBe(1);
        expect(state.go).toHaveBeenCalledWith('search.results.list', {query: queryResults[0]}, {location: true});
    });


    it('should make put request with correct id and parameter', function () {
        $httpBackend.expectPUT('api/queries/2', {frequency: 'monthly'}).respond(200, {});

        scope.toggleFrequency(2, 'monthly');
        $httpBackend.flush();
    });

    it('should delete notification and update user', function () {
        $httpBackend.expectDELETE('api/notifications/11').respond(204, {});

        scope.deleteNotification(notifications[0]);
        $httpBackend.flush();
        
        expect(scope.currentUser.notificationCount).toBe(1);
    });

    it('should delete notification but not update user', function () {
        notifications[0].hasRun = true;
        $httpBackend.expectDELETE('api/notifications/11').respond(204, {});

        scope.deleteNotification(notifications[0]);
        $httpBackend.flush();
        
        expect(scope.currentUser.notificationCount).toBe(2);
    });

    it('should update notification and user', function () {
        $httpBackend.expectPUT('api/notifications/11', {hasRun: true}).respond(200, {});

        scope.updateNotification(notifications[0]);
        $httpBackend.flush();
        
        expect(scope.currentUser.notificationCount).toBe(1);
    });

    it('should not update notification or user', function () {
        notifications[0].hasRun = true;

        scope.updateNotification(notifications[0]);
        
        expect(scope.currentUser.notificationCount).toBe(2);
    });
});
