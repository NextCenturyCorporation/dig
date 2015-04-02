'use strict';

describe('Controller: SaveQueryCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var SaveQueryCtrl, scope, modalInstance, http, $httpBackend, mockUser, queryString, filterStates;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        queryString = 'search terms';
        filterStates = {'filter': 'option'};

        module(function($provide) {
            $provide.constant('queryString', queryString);
            $provide.constant('filterStates', filterStates);
        });

        inject(function ($controller, $rootScope, _$httpBackend_, $http) {
            scope = $rootScope.$new();
            modalInstance = { 
                close: jasmine.createSpy('modalInstance.close')
            };
            http = $http;
            $httpBackend = _$httpBackend_;

            mockUser = {
                get: function() {
                    return {'email': 'test@test.com'};
                }
            };

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
                User: mockUser
            });
        });
    });

    it('should initialize queryString to correct value', function () {
        expect(scope.queryString).toBe(queryString);
    });

    it('should initialize filterStates to correct value', function () {
        expect(scope.filterStates).toBe(filterStates);
    });

    it('should initialize user', function () {
        expect(scope.currentUser).toEqual({'email': 'test@test.com'});
    });

    it('should initialize query to correct value', function () {
        expect(scope.query).toEqual({name: '', frequency: 'daily'});
    });

    it('should initialize scope.frequencyOptions', function () {
        expect(scope.frequencyOptions).toEqual(['daily', 'weekly', 'monthly']);
    });

    it('should save and call close() function', function () {
        $httpBackend.expectPOST('api/query').respond(200, {});

        scope.save();
        
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should call close() function', function () {
        scope.cancel();
        expect(modalInstance.close).toHaveBeenCalled();
    });
});
