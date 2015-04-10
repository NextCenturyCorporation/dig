'use strict';

describe('Controller: SaveQueryCtrl', function () {

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
        'selectedSort': {
          'title':'Best Match',
          'order':'rank'
        },
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
        'selectedSort': {
          'title':'Best Match',
          'order':'rank'
        },
        'createDate': '2015-04-01T20:13:11.093Z',
        'lastRunDate': '2015-04-01T20:13:11.093Z'
      }
    ];

    // instantiate service
    var SaveQueryCtrl, scope, modalInstance, http, window, $httpBackend, mockUser, 
        queryString, filterStates, includeMissing, selectedSort;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        queryString = 'search terms';
        filterStates = {'filter': 'option'};
        includeMissing = {'aggregations': {}, 'allIncludeMissing': false};
        selectedSort =  {'title':'Newest First','order':'desc'};

        module(function($provide) {
            $provide.constant('queryString', queryString);
            $provide.constant('filterStates', filterStates);
            $provide.constant('includeMissing', includeMissing);
            $provide.constant('selectedSort', selectedSort);
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

            $httpBackend.expectGET('api/query/').respond(200, queryResults);

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
        expect(scope.queryString).toBe(queryString);
    });

    it('should initialize filterStates to correct value', function () {
        expect(scope.filterStates).toBe(filterStates);
    });

    it('should initialize includeMissing to correct value', function () {
        expect(scope.includeMissing).toBe(includeMissing);
    });

    it('should initialize selectedSort to correct value', function () {
        expect(scope.selectedSort).toBe(selectedSort);
    });

    it('should initialize user', function () {
        expect(scope.currentUser).toEqual({'username': 'test'});
    });

    it('should initialize query to correct value', function () {
        expect(scope.query).toEqual({name: '', frequency: 'daily'});
    });

    it('should initialize scope.frequencyOptions', function () {
        expect(scope.frequencyOptions).toEqual(['daily', 'weekly', 'monthly']);
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
        $httpBackend.expectPOST('api/query').respond(200, {});

        scope.save();
        
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should save, update, and call close() function', function () {
        spyOn(window, 'confirm').andCallFake(function () {
            return true;
        });

        scope.existingQuery = queryResults[0];
        scope.query.name = 'Query #1';
        $httpBackend.expectPUT('api/query/1', scope.query).respond(200, {});

        scope.save();
        
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should not update if user cancels existing query overwrite', function() {
        spyOn(window, 'confirm').andCallFake(function () {
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
