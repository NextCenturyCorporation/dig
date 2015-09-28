'use strict';

describe('Controller: NavbarCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var NavbarCtrl, scope, location, modal;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, $location, $modal) {
            scope = $rootScope.$new();
            location = $location;
            modal = $modal;

            spyOn(modal, 'open');

            NavbarCtrl = $controller('NavbarCtrl', {
                $scope: scope,
                $location: location,
                $modal: modal
            });

        });
    });

    it('should make call to open about modal', function () {
        var modalParameters = {
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        };

        scope.openAbout();
        expect(modal.open).toHaveBeenCalledWith(modalParameters);
    });

    it('should make call to open user preferences modal', function () {
        var modalParameters = {
          templateUrl: 'app/user/user-prefs.html',
          controller: 'UserPrefsCtrl',
          size: 'sm'
        };

        scope.userPreferences();
        expect(modal.open).toHaveBeenCalledWith(modalParameters);
    });


});
