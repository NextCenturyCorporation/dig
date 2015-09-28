'use strict';

describe('Service: userPrefsService -- if user has blur settings and environment blur is set to true', function () {
    var blurImagesEnabled = true;
    var blurImagesPercentage = 2.5;

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var blurConfig, rootScope, userSvc, user, $httpBackend, defer, $q;

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('blurImagesEnabled', blurImagesEnabled);
            $provide.constant('blurImagesPercentage', blurImagesPercentage);
        });

        inject(function(_userPrefsService_, $injector, _User_, _$q_, _$httpBackend_) {
            blurConfig = _userPrefsService_;
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
            userSvc = _User_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;

            user = {
                username: 'test',
                emailAddress: null,
                sendEmailNotification: false,
                blurImagesEnabled: false,
                blurImagesPercentage: 0
            };

            $httpBackend.expectGET('/api/users/reqHeader').respond(200, user);
            $httpBackend.flush();

            defer = $q.defer();
            defer.resolve();
        });
    });

    it('blurImageService should be instantiated', function () {
        expect(blurConfig).toBeDefined();
        expect(blurConfig).toBeTruthy();
    });

    it('should initialize getBlurImagesEnabled() to value of user.blurImagesEnabled', function() {
        var blurEnable;
        blurConfig.getBlurImagesEnabled().then(function(result) {
            blurEnable = result;
            expect(blurEnable).toEqual(user.blurImagesEnabled);
        });
        rootScope.$apply();
    });

    it('should initialize getBlurImagesPercentage() to value of user.blurImagesPercentage', function() {
        var blurPercent;
        blurConfig.getBlurImagesPercentage().then(function(result) {
            blurPercent = result;
            expect(blurPercent).toEqual(user.blurImagesPercentage);
        });
        rootScope.$apply();

    });

    it('should set enabled to true and percentages to 2.5', function() {
        var updatePrefs;
        user.blurImagesEnabled = true;        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);

        defer = $q.defer();
        defer.resolve();
       
        blurConfig.updateUserPreferences(user).then(function(result) {
            expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', true);
            updatePrefs = result;

            expect(updatePrefs.blurImagesEnabled).toEqual(blurImagesEnabled);
            expect(updatePrefs.blurImagesPercentage).toBe(blurImagesPercentage);
        });
        
        rootScope.$apply();
        $httpBackend.flush();
    });

    it('should set enabled to false and percentages to 0', function() {
        var updatePrefs;
        user.blurImagesEnabled = false;        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);

        defer = $q.defer();
        defer.resolve();
       
        blurConfig.updateUserPreferences(user).then(function(result) {
            expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', false);
            updatePrefs = result;

            expect(updatePrefs.blurImagesEnabled).toEqual(false);
            expect(updatePrefs.blurImagesPercentage).toBe(0);
        });
        
        rootScope.$apply();
        $httpBackend.flush();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

describe('Service: userPrefsService -- if user has no blur settings and environment settings are false', function () {
    var blurImagesEnabled = false;
    var blurImagesPercentage = 0;

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var blurConfig, rootScope, userSvc, user, $httpBackend, defer, $q;

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('blurImagesEnabled', blurImagesEnabled);
            $provide.constant('blurImagesPercentage', blurImagesPercentage);
        });

        inject(function(_userPrefsService_, $injector, _User_, _$q_, _$httpBackend_) {
            blurConfig = _userPrefsService_;
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
            userSvc = _User_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;

            user = {
                username: 'test',
                emailAddress: null,
                sendEmailNotification: false
            };

            $httpBackend.expectGET('/api/users/reqHeader').respond(200, user);
            $httpBackend.flush();

            defer = $q.defer();
            defer.resolve();
        });
    });

    it('blurImageService should be instantiated', function () {
        expect(blurConfig).toBeDefined();
        expect(blurConfig).toBeTruthy();
    });

    it('should initialize getBlurImagesEnabled() to value of blurImagesEnabled', function() {
        var blurEnable;
        blurConfig.getBlurImagesEnabled().then(function(result) {
            blurEnable = result;
        });
        rootScope.$apply();
        expect(blurEnable).toEqual(blurImagesEnabled);
    });

    it('should initialize getBlurImagesPercentage() to value of blurImagesPercentage', function() {
        var blurPercent;
        blurConfig.getBlurImagesPercentage().then(function(result) {
            blurPercent = result;
            expect(blurPercent).toEqual(blurImagesPercentage);
        });
        rootScope.$apply();
    });

    it('should set enabled to true and percentage to 2.5', function() {
        var updatePrefs;
        user.blurImagesEnabled = true;        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);

        defer = $q.defer();
        defer.resolve();
       
        blurConfig.updateUserPreferences(user).then(function(result) {
            expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', true);
            updatePrefs = result;

            expect(updatePrefs.blurImagesEnabled).toEqual(true);
            expect(updatePrefs.blurImagesPercentage).toEqual(2.5);
        });
        
        rootScope.$apply();
        $httpBackend.flush();
    });

    it('should set enabled to false and percentages to 0', function() {
        var updatePrefs;
        user.blurImagesEnabled = false;        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(200, user);

        defer = $q.defer();
        defer.resolve();
       
        blurConfig.updateUserPreferences(user).then(function(result) {
            expect(rootScope.$broadcast).toHaveBeenCalledWith('blur-state-change', false);
            updatePrefs = result;

            expect(updatePrefs.blurImagesEnabled).toEqual(false);
            expect(updatePrefs.blurImagesPercentage).toEqual(0);
        });
        
        rootScope.$apply();
        $httpBackend.flush();
    });

    it('should not broadcast event on failure to update', function() {
        var updatePrefs;
        user.blurImagesEnabled = true;        
        $httpBackend.expectPUT('/api/users/reqHeader').respond(400, {error: 'update error'});

        defer = $q.defer();
        defer.resolve();
       
        blurConfig.updateUserPreferences(user).then(function(result) {
            expect(rootScope.$broadcast).not.toHaveBeenCalledWith('blur-state-change', false);
            expect(rootScope.$broadcast).not.toHaveBeenCalledWith('blur-state-change', true);
            updatePrefs = result;
        });
        
        rootScope.$apply();
        $httpBackend.flush();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

describe('Service: userPrefsService -- if original user get request failed', function () {
    var blurImagesEnabled = false;
    var blurImagesPercentage = 0;

    // load the service's module
    beforeEach(module('digApp'));

    // instantiate service
    var blurConfig, rootScope, userSvc, user, $httpBackend, defer, $q;

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('blurImagesEnabled', blurImagesEnabled);
            $provide.constant('blurImagesPercentage', blurImagesPercentage);
        });

        inject(function(_userPrefsService_, $injector, _User_, _$q_, _$httpBackend_) {
            blurConfig = _userPrefsService_;
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
            userSvc = _User_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;

            user = {
                username: 'test',
                emailAddress: null,
                sendEmailNotification: false
            };

            $httpBackend.expectGET('/api/users/reqHeader').respond(400, {error: 'error'});
            $httpBackend.flush();

            defer = $q.defer();
            defer.resolve();
        });
    });

    it('should initialize getBlurImagesEnabled() to value of blurImagesEnabled', function() {
        var blurEnable;
        blurConfig.getBlurImagesEnabled().then(function(result) {
            blurEnable = result;
        });
        rootScope.$apply();
        expect(blurEnable).toEqual(blurImagesEnabled);
    });

    it('should initialize getBlurImagesPercentage() to value of blurImagesPercentage', function() {
        var blurPercent;
        blurConfig.getBlurImagesPercentage().then(function(result) {
            blurPercent = result;
            expect(blurPercent).toEqual(blurImagesPercentage);
        });
        rootScope.$apply();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

