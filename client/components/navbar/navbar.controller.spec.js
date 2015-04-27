'use strict';

describe('Controller: NavbarCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var NavbarCtrl, scope, location, modal, blurImageSvcMock;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, $location, $modal) {
            scope = $rootScope.$new();
            location = $location;
            modal = $modal;

            blurImageSvcMock = {
                blurEnabled: true,
                getBlurImagesEnabled : function() {
                    return this.blurEnabled;
                },
                changeBlurImagesEnabled: function(isBlurred) {
                    if(isBlurred) {
                        this.blurEnabled = true;
                    } else {
                        this.blurEnabled = false;
                    }
                }
            };

            spyOn(modal, 'open');
            spyOn(blurImageSvcMock, 'changeBlurImagesEnabled');

            NavbarCtrl = $controller('NavbarCtrl', {
                $scope: scope,
                $location: location,
                $modal: modal,
                blurImageService: blurImageSvcMock
            });

        });
    });

    it('should initialize isBlurred to true', function () {
        expect(scope.isBlurred).toBe(true);
    });

    it('should call blurImageService with false parameter', function () {
        scope.changeBlur();
        expect(blurImageSvcMock.changeBlurImagesEnabled).toHaveBeenCalledWith(false);
    });

    it('should call blurImageService with true parameter', function () {
        scope.isBlurred = false;
        scope.changeBlur();
        expect(blurImageSvcMock.changeBlurImagesEnabled).toHaveBeenCalledWith(true);
    });

    it('should make call to open modal', function () {
        var modalParameters = {
          templateUrl: 'app/about/about.html',
          controller: 'AboutCtrl',
          size: 'sm'
        };

        scope.openAbout();
        expect(modal.open).toHaveBeenCalledWith(modalParameters);
    });

});
