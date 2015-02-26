'use strict';

describe('Controller: AboutCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var AboutCtrl, scope, modalInstance;

    // Initialize the controller and a mock scope
    beforeEach(function() {
        var version = '0.0.0';

        module(function($provide) {
            $provide.constant('appVersion', version);
        });

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            modalInstance = { 
                close: jasmine.createSpy('modalInstance.close')
            };

            AboutCtrl = $controller('AboutCtrl', {
                $scope: scope,
                $modalInstance: modalInstance
            });
        });
    });

    it('should have appVersion', function () {
        expect(scope.appVersion).toBe('0.0.0');
    });


    it('should call close() function', function () {
        scope.ok();
        expect(modalInstance.close).toHaveBeenCalled();
    });


/*
    $scope.ok = function () {
        $modalInstance.close();
    };
*/
});
