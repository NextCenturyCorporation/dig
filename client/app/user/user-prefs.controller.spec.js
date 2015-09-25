'use strict';

describe('Controller: UserPrefsCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var UserPrefsCtrl, scope, modalInstance, http, window, $httpBackend, user;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, _$httpBackend_, $http, $window, _User_) {
            scope = $rootScope.$new();
            modalInstance = { 
                close: jasmine.createSpy('modalInstance.close')
            };
            http = $http;
            $httpBackend = _$httpBackend_;
            window = $window;

            user = {
                username: 'test',
                emailAddress: null,
                sendEmailNotification: false
            };

            $httpBackend.expectGET('/api/users/reqHeader').respond(200, user);

            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/search-results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search-results/list/list.partial.html'))
                .respond(200, 'some text');

            UserPrefsCtrl = $controller('UserPrefsCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                $http: http,
                $window: window,
                User: _User_
            });

            $rootScope.$apply();

            $httpBackend.flush();
        });
    });

    it('should instantiate updatedUser', function() {
        expect(scope.updatedUser.emailAddress).toBe(user.emailAddress);
        expect(scope.updatedUser.sendEmailNotification).toBe(user.sendEmailNotification);
    });

    it('should instantiate databaseError', function() {
        expect(scope.databaseError).toEqual({});
    });

    it('should return true when isNotificationStateValid() is called and sendEmailNotification is false', function() {
        scope.userForm = {emailAddress: {$valid: true}};
        scope.updatedUser.sendEmailNotification = false;
        expect(scope.isNotificationStateValid()).toEqual(true);
    });

    it('should return true when isNotificationStateValid() is called and a ' + 
        'valid email address exists with sendEmailNotification set to true', function() {
        scope.userForm = {emailAddress: {$valid: true}};
        scope.updatedUser.sendEmailNotification = true;
        scope.updatedUser.emailAddress = 'test@email.com';
        expect(scope.isNotificationStateValid()).toEqual(true);
    });

    it('should return false when isNotificationStateValid() is called and form is invalid', function() {
        scope.userForm = {emailAddress: {$valid: false}};
        scope.updatedUser.sendEmailNotification = true;
        scope.updatedUser.emailAddress = null;
        expect(scope.isNotificationStateValid()).toEqual(false);
    });

    it('should return false when isNotificationStateValid() is called and updatedUser ' + 
        'hasn\'t been instantiated yet', function() {
        scope.updatedUser = undefined;
        expect(scope.isNotificationStateValid()).toEqual(false);
    });

    it('should update user', function() {
        scope.userForm = {
            $valid: true,
            emailAddress: {$valid: true}
        };
        scope.updatedUser.sendEmailNotification = true;
        scope.updatedUser.emailAddress = 'test@email.com';
        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);
        scope.updateUser();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should change empty email to null', function() {
        scope.userForm = {
            $valid: true,
            emailAddress: {$valid: true}
        };
        scope.updatedUser.sendEmailNotification = false;
        scope.updatedUser.emailAddress = '';
        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);
        scope.updateUser();
        $httpBackend.flush();
        expect(scope.updatedUser.emailAddress).toBe(null);
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should return error when attempt made to update user', function() {
        scope.userForm = {
            $valid: true,
            emailAddress: {$valid: true}
        };
        scope.updatedUser.sendEmailNotification = true;
        scope.updatedUser.emailAddress = 'test@email.com';
        var expectedError = {error: 'could not update'};
        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(403, expectedError);
        scope.updateUser();
        $httpBackend.flush();
        expect(modalInstance.close).not.toHaveBeenCalled();
        expect(scope.databaseError.data).toEqual(expectedError);
    });

    it('shouldn\'t make call to update user', function() {
        scope.userForm = {
            $valid: false
        };
        scope.updatedUser.emailAddress = 'test@email.com';

        scope.updateUser();
    });

    it('should call close() function', function () {
        scope.cancel();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
