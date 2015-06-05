'use strict';

describe('Controller: EditModalCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var EditModalCtrl, scope, modalInstance, folder, user, $httpBackend;

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
              get: jasmine.createSpy('user.get').andReturn({username: 'test'})
            };

            folder = {
              _id: 4,
              name: "folder4",
              parentId: 3,
              children: [
                {
                  _id: 5,
                  name: "folder5",
                  parentId: 4,
                  children: []
                },{
                  _id: 6,
                  name: "folder6",
                  parentId: 4,
                  children: []
                }
              ]
            };

            EditModalCtrl = $controller('EditModalCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                User: user,
                folder: folder
            });

        });
    });

    it('should initialize variables', function () {
        expect(user.get).toHaveBeenCalled();
        expect(scope.currentUser.username).toEqual('test');
        expect(scope.folderName).toEqual(folder.name);
    });

    it('should make call to dismiss modal', function () {
        scope.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should change folder name', function () {
        $httpBackend.expectPUT('api/folders/' + folder._id, {name: "folder4NewName", parentId: folder.parentId}).respond(200, {});
        scope.folderName = "folder4NewName";
        scope.save();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should delete folder', function () {
        $httpBackend.expectDELETE('api/folders/' + folder._id).respond(204);
        scope.delete();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

});
