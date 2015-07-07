'use strict';

describe('Controller: DeleteItemsModalCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var DeleteItemsModalCtrl, scope, modalInstance, user, items, childIds, id, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;

            modalInstance = {
              close: jasmine.createSpy('modalInstance.close'),
              dismiss: jasmine.createSpy('modalInstance.dismiss')
            };

            user = {
              get: jasmine.createSpy('user.get').and.returnValue({username: 'test'})
            };

            items = ["123", "456", "789"];
            childIds = [1, 2];
            id = 3;

            DeleteItemsModalCtrl = $controller('DeleteItemsModalCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                User: user,
                items: items,
                childIds: childIds,
                id: id
            });

        });
    });

    it('should initialize variables', function () {
        expect(user.get).toHaveBeenCalled();
        expect(scope.currentUser.username).toEqual('test');
    });

    it('should make call to dismiss modal', function () {
        scope.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should delete items and subfolders', function () {
        $httpBackend.expectPUT('api/folders/removeItems/' + id, {items: items, childIds: childIds}).respond(200, {});
        scope.delete();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

});
