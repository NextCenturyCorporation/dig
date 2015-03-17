'use strict';

describe('Controller: AboutCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var AboutCtrl, scope, modalInstance, euiConfigMock;

    // Initialize the controller and a mock scope
    beforeEach(function() {
        var version = '0.0.0';

        module(function($provide) {
            $provide.constant('appVersion', version);
            $provide.constant('euiSearchIndex', 'dig');
        });

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            modalInstance = { 
                close: jasmine.createSpy('modalInstance.close')
            };

            euiConfigMock = {};

            AboutCtrl = $controller('AboutCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                euiConfigs: euiConfigMock
            });
        });
    });

    it('should have appVersion', function () {
        expect(scope.appVersion).toBe('0.0.0');
    });

    it('should have aboutSearchConfig', function () {
        expect(scope.aboutSearchConfig.index).toBe('dig');
        expect(scope.aboutSearchConfig.field).toBe(null);
    });

    it('if euiConfig.lastUpdateQuery exists, should initialize aboutSearchConfig.field accordingly', function () {
        euiConfigMock = {lastUpdateQuery: {field:'updatedDate'}};
        inject(function ($controller) {
            AboutCtrl = $controller('AboutCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                euiConfigs: euiConfigMock
            });
        });

        expect(scope.aboutSearchConfig.field).toBe(euiConfigMock.lastUpdateQuery.field);
    });

    it('should call close() function', function () {
        scope.ok();
        expect(modalInstance.close).toHaveBeenCalled();
    });

});
